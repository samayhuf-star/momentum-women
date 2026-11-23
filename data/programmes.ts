import { visibleExercises, type Exercise } from './exercises.ts';
import type { PhotoKey } from '../lib/photos';

export type Move = { id: string; sets: number; reps?: number; secs?: number };
export type Block = { name: string; moves: Move[] };
export type Session = {
  key: string;
  title: string;
  focus: string;
  equipment: string;
  minutes: number;
  blocks: Block[];
  photo: PhotoKey;
};
export type Day = { rest: true; note: string } | { rest: false; session: Session };
export type Programme = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  styles: string[];
  length: number;
  photo: PhotoKey;
  weeks: Day[][];
};

export const STYLES = ['Strength basics', 'Pilates strength', 'Glutes and legs', 'Core', 'Bodyweight only', 'Dumbbells'] as const;
export const LENGTHS = [20, 30] as const;
export const WEEKS = 4;

type T = [string, number, number, ('s' | 'r')?];
type Template = { title: string; focus: string; photo: PhotoKey; blocks: { name: string; moves: T[] }[] };

const byId = new Map<string, Exercise>(visibleExercises.map((e) => [e.id, e]));
export const exerciseById = (id: string) => byId.get(id);

const WARM: Block = {
  name: 'Warm up',
  moves: [
    { id: 'cat-cow', sets: 1, secs: 30 },
    { id: 'shoulder-circles', sets: 1, secs: 30 },
    { id: 'bird-dog', sets: 1, secs: 30 },
  ],
};

function equipmentOf(blocks: Block[]): string {
  const kinds = new Set<string>();
  blocks.forEach((b) => b.moves.forEach((m) => kinds.add(byId.get(m.id)?.equipment ?? 'None')));
  kinds.delete('None');
  return kinds.size ? [...kinds].join(' · ') : 'Bodyweight';
}

/** Rough length: 4 seconds a rep, plus 40 seconds of rest and changeover per set. */
export function sessionMinutes(blocks: Block[]): number {
  let seconds = 0;
  blocks.forEach((b) => b.moves.forEach((m) => { seconds += m.sets * ((m.secs ?? (m.reps ?? 10) * 4) + 40); }));
  return Math.max(5, Math.round(seconds / 60));
}

function build(programmeId: string, week: number, day: number, t: Template): Session {
  const blocks: Block[] = [
    WARM,
    ...t.blocks.map((b) => ({
      name: b.name,
      moves: b.moves
        .filter(([id]) => byId.has(id))
        .map(([id, sets, n, kind]) =>
          kind === 's'
            ? { id, sets: sets + (week >= 2 ? 1 : 0), secs: n + week * 5 }
            : { id, sets: sets + (week >= 2 ? 1 : 0), reps: n + (week >= 1 ? 2 : 0) }
        ),
    })),
  ];
  return {
    key: `${programmeId}-${week + 1}-${day + 1}`,
    title: t.title,
    focus: t.focus,
    photo: t.photo,
    blocks,
    equipment: equipmentOf(blocks),
    minutes: sessionMinutes(blocks),
  };
}

function programme(
  meta: Omit<Programme, 'weeks' | 'length'>,
  templates: Template[],
  pattern: (number | null)[]
): Programme {
  const weeks: Day[][] = [];
  for (let w = 0; w < WEEKS; w += 1) {
    weeks.push(
      pattern.map((slot, d) =>
        slot === null
          ? { rest: true as const, note: d === 6 ? 'Rest. A new week starts tomorrow.' : 'Rest. Walk or stretch.' }
          : { rest: false as const, session: build(meta.id, w, d, templates[slot]) }
      )
    );
  }
  // The length shown for a programme is the average of its week 1 sessions, rounded to the nearest 10 minutes.
  const first = weeks[0].flatMap((d) => (d.rest ? [] : [d.session.minutes]));
  const average = first.reduce((a, b) => a + b, 0) / Math.max(1, first.length);
  return { ...meta, length: Math.max(10, Math.round(average / 10) * 10), weeks };
}

export const programmes: Programme[] = [
  programme(
    { id: 'sculpt', name: 'Sculpt', tagline: 'Pilates and strength', description: 'Pilates and strength sessions for a lean, strong body. Beginner friendly.', styles: ['Pilates strength', 'Dumbbells'], photo: 'card' },
    [
      { title: 'Full body sculpt', focus: 'Full body', photo: 'press', blocks: [{ name: 'Squat and row', moves: [['goblet-squat', 3, 12], ['row', 3, 12], ['glute-bridge', 3, 15]] }, { name: 'Press and core', moves: [['shoulder-press', 3, 10], ['dead-bug', 3, 10], ['plank', 3, 30, 's']] }] },
      { title: 'Glutes and core', focus: 'Lower body', photo: 'catcow', blocks: [{ name: 'Glutes', moves: [['hip-thrust', 3, 12], ['curtsy-lunge', 3, 10], ['fire-hydrant', 3, 15]] }, { name: 'Pilates core', moves: [['pilates-hundred', 2, 40, 's'], ['leg-raises', 3, 12], ['side-plank', 2, 30, 's']] }] },
      { title: 'Upper body tone', focus: 'Upper body', photo: 'card', blocks: [{ name: 'Press and pull', moves: [['dumbbell-press', 3, 10], ['row', 3, 12], ['lateral-raise', 3, 12]] }, { name: 'Arms and abs', moves: [['biceps-curl', 3, 12], ['overhead-ext', 3, 12], ['bicycle-crunches', 3, 20]] }] },
      { title: 'Legs and balance', focus: 'Lower body', photo: 'kettle', blocks: [{ name: 'Single leg', moves: [['reverse-lunge', 3, 10], ['single-leg-rdl', 3, 10], ['sumo-squat', 3, 12]] }, { name: 'Finish', moves: [['calf-raise', 3, 15], ['donkey-kick', 3, 15], ['bird-dog', 3, 10]] }] },
    ],
    [0, 1, 2, null, 3, 0, null]
  ),
  programme(
    { id: 'basics', name: 'Strength basics', tagline: 'Three days a week', description: 'The main lifts, three days a week, with plenty of rest. A good place to start.', styles: ['Strength basics', 'Dumbbells'], photo: 'welcome' },
    [
      { title: 'Lower body basics', focus: 'Lower body', photo: 'welcome', blocks: [{ name: 'Legs', moves: [['goblet-squat', 3, 10], ['rdl', 3, 10], ['step-up', 3, 10]] }, { name: 'Glutes and core', moves: [['glute-bridge', 3, 12], ['calf-raise', 3, 15], ['plank', 3, 30, 's']] }] },
      { title: 'Upper body basics', focus: 'Upper body', photo: 'card', blocks: [{ name: 'Push and pull', moves: [['push-up', 3, 8], ['row', 3, 10], ['shoulder-press', 3, 10]] }, { name: 'Arms and core', moves: [['biceps-curl', 3, 12], ['overhead-ext', 3, 12], ['dead-bug', 3, 10]] }] },
      { title: 'Full body', focus: 'Full body', photo: 'press', blocks: [{ name: 'Main lifts', moves: [['goblet-squat', 3, 10], ['dumbbell-press', 3, 10], ['row', 3, 10]] }, { name: 'Accessory', moves: [['reverse-lunge', 3, 10], ['lateral-raise', 3, 12], ['bird-dog', 3, 10]] }] },
    ],
    [0, null, 1, null, 2, null, null]
  ),
  programme(
    { id: 'glutes', name: 'Glutes and legs', tagline: 'Lower body focus', description: 'Four lower-body sessions a week, built around hip thrusts, squats and lunges.', styles: ['Glutes and legs', 'Dumbbells'], photo: 'kettle' },
    [
      { title: 'Glute builder', focus: 'Glutes', photo: 'kettle', blocks: [{ name: 'Heavy', moves: [['hip-thrust', 3, 12], ['rdl', 3, 10], ['bulgarian-split-squat', 3, 10]] }, { name: 'Activation', moves: [['frog-pump', 3, 20], ['fire-hydrant', 3, 15], ['donkey-kick', 3, 15]] }] },
      { title: 'Quads and calves', focus: 'Legs', photo: 'press', blocks: [{ name: 'Squat and lunge', moves: [['goblet-squat', 3, 12], ['walking-lunge', 3, 12], ['step-up', 3, 10]] }, { name: 'Finish', moves: [['wall-sit', 3, 40, 's'], ['calf-raise', 3, 15], ['lateral-lunge', 3, 10]] }] },
      { title: 'Hamstrings and hips', focus: 'Legs', photo: 'welcome', blocks: [{ name: 'Hinge', moves: [['single-leg-rdl', 3, 10], ['good-morning', 3, 12], ['sumo-squat', 3, 12]] }, { name: 'Hips', moves: [['glute-bridge', 3, 15], ['curtsy-lunge', 3, 10], ['side-plank', 2, 30, 's']] }] },
      { title: 'Lower body burn', focus: 'Lower body', photo: 'catcow', blocks: [{ name: 'Power', moves: [['kettlebell-swing', 3, 15], ['reverse-lunge', 3, 12], ['hip-thrust', 3, 12]] }, { name: 'Burn', moves: [['mountain-climber', 3, 30, 's'], ['frog-pump', 3, 20], ['plank', 3, 30, 's']] }] },
    ],
    [0, 1, null, 2, null, 3, null]
  ),
  programme(
    { id: 'pilates', name: 'Pilates core', tagline: 'No equipment', description: 'Short mat sessions for a strong core, hips and posture. No equipment needed.', styles: ['Core', 'Pilates strength', 'Bodyweight only'], photo: 'catcow' },
    [
      { title: 'Core foundations', focus: 'Core', photo: 'catcow', blocks: [{ name: 'Control', moves: [['pilates-hundred', 2, 40, 's'], ['dead-bug', 2, 10], ['bird-dog', 2, 10]] }, { name: 'Hold', moves: [['plank', 2, 30, 's'], ['glute-bridge', 2, 15], ['side-plank', 2, 30, 's']] }] },
      { title: 'Abs and obliques', focus: 'Core', photo: 'explain', blocks: [{ name: 'Rotation', moves: [['bicycle-crunches', 2, 20], ['russian-twist', 2, 20], ['leg-raises', 2, 12]] }, { name: 'Finish', moves: [['v-ups', 2, 10], ['mountain-climber', 2, 30, 's'], ['side-plank', 2, 30, 's']] }] },
      { title: 'Hips and posture', focus: 'Hips', photo: 'intro', blocks: [{ name: 'Hips', moves: [['glute-bridge', 2, 15], ['fire-hydrant', 2, 15], ['donkey-kick', 2, 15]] }, { name: 'Posture', moves: [['cat-cow', 2, 30, 's'], ['bird-dog', 2, 10], ['plank', 2, 30, 's']] }] },
    ],
    [0, 1, null, 2, 0, null, null]
  ),
];

export const programmeById = (id: string | null | undefined) => programmes.find((p) => p.id === id) ?? null;

export function matchProgrammes(styles: string[], length: number | null): Programme[] {
  return programmes.filter(
    (p) => (styles.length === 0 || styles.some((s) => p.styles.includes(s))) && (length === null || p.length === length)
  );
}

/** A short first session: the warm up and the first block of the programme's first workout. */
export function welcomeSession(p: Programme): Session {
  const first = p.weeks[0].find((d) => !d.rest);
  const base = first && !first.rest ? first.session : null;
  const blocks = base ? base.blocks.slice(0, 2) : [WARM];
  return {
    key: `${p.id}-welcome`,
    title: 'Welcome workout',
    focus: base?.focus ?? 'Full body',
    photo: 'press',
    blocks,
    equipment: equipmentOf(blocks),
    minutes: sessionMinutes(blocks),
  };
}

export function findSession(key: string): Session | null {
  for (const p of programmes) {
    if (key === `${p.id}-welcome`) return welcomeSession(p);
    for (const week of p.weeks) for (const d of week) if (!d.rest && d.session.key === key) return d.session;
  }
  return null;
}

export type Step = { block: string; blockIndex: number; move: Move; exercise: Exercise; round: number };

/** Player order: each block is done as a circuit, one round at a time. */
export function stepsFor(session: Session): Step[] {
  const steps: Step[] = [];
  session.blocks.forEach((b, blockIndex) => {
    const rounds = Math.max(...b.moves.map((m) => m.sets));
    for (let r = 1; r <= rounds; r += 1) {
      b.moves.forEach((move) => {
        const exercise = byId.get(move.id);
        if (exercise && r <= move.sets) steps.push({ block: b.name, blockIndex, move, exercise, round: r });
      });
    }
  });
  return steps;
}
