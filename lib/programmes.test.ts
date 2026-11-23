import assert from 'node:assert/strict';
import { test } from 'node:test';
import { programmes, WEEKS, LENGTHS, findSession, stepsFor, welcomeSession, matchProgrammes, exerciseById, sessionMinutes } from '../data/programmes.ts';

test('there are 4 programmes of 4 weeks with 7 days each', () => {
  assert.equal(programmes.length, 4);
  for (const p of programmes) {
    assert.equal(p.weeks.length, WEEKS);
    for (const w of p.weeks) assert.equal(w.length, 7);
  }
});

test('every move points at a real exercise', () => {
  for (const p of programmes) for (const w of p.weeks) for (const d of w) {
    if (d.rest) continue;
    for (const b of d.session.blocks) for (const m of b.moves) assert.ok(exerciseById(m.id), `${p.id}: ${m.id}`);
  }
});

test('session keys are unique and found again by findSession', () => {
  const keys = new Set<string>();
  for (const p of programmes) for (const w of p.weeks) for (const d of w) {
    if (d.rest) continue;
    assert.ok(!keys.has(d.session.key), d.session.key);
    keys.add(d.session.key);
    assert.equal(findSession(d.session.key)?.key, d.session.key);
  }
  assert.ok(keys.size > 0);
  assert.equal(findSession('nope-9-9'), null);
});

test('each week has at least 3 workouts and at least 2 rest days', () => {
  for (const p of programmes) for (const w of p.weeks) {
    const work = w.filter((d) => !d.rest).length;
    assert.ok(work >= 3 && work <= 5, `${p.id} has ${work}`);
  }
});

test('programme length is one of the offered lengths and sessions are in a sane range', () => {
  for (const p of programmes) {
    assert.ok((LENGTHS as readonly number[]).includes(p.length), p.id);
    for (const w of p.weeks) for (const d of w) if (!d.rest) {
      assert.ok(d.session.minutes >= 8 && d.session.minutes <= 50, `${d.session.key} ${d.session.minutes}`);
      assert.equal(d.session.minutes, sessionMinutes(d.session.blocks));
    }
  }
});

test('workouts get harder from week 1 to week 4 (more total reps or time)', () => {
  const load = (blocks: { moves: { sets: number; reps?: number; secs?: number }[] }[]) =>
    blocks.reduce((a, b) => a + b.moves.reduce((x, m) => x + m.sets * (m.reps ?? 0) + m.sets * (m.secs ?? 0), 0), 0);
  for (const p of programmes) {
    const first = p.weeks[0].find((d) => !d.rest);
    const last = p.weeks[WEEKS - 1].find((d) => !d.rest);
    if (first && last && !first.rest && !last.rest) assert.ok(load(last.session.blocks) > load(first.session.blocks), p.id);
  }
});

test('stepsFor lists each block as circuit rounds and never exceeds a move\'s sets', () => {
  for (const p of programmes) {
    const d = p.weeks[0].find((x) => !x.rest);
    if (!d || d.rest) continue;
    const steps = stepsFor(d.session);
    const expected = d.session.blocks.reduce((a, b) => a + b.moves.reduce((x, m) => x + m.sets, 0), 0);
    assert.equal(steps.length, expected);
    for (const s of steps) assert.ok(s.round >= 1 && s.round <= s.move.sets);
  }
});

test('welcome workout is short, uses the first two blocks and has its own key', () => {
  for (const p of programmes) {
    const w = welcomeSession(p);
    assert.equal(w.key, `${p.id}-welcome`);
    assert.ok(w.blocks.length <= 2);
    assert.equal(findSession(w.key)?.key, w.key);
  }
});

test('matchProgrammes filters by style and length, and returns all with no filters', () => {
  assert.equal(matchProgrammes([], null).length, 4);
  assert.deepEqual(matchProgrammes(['Glutes and legs'], null).map((p) => p.name).includes('Glutes and legs'), true);
  assert.equal(matchProgrammes([], 20).every((p) => p.length === 20), true);
  assert.equal(matchProgrammes(['no such style'], null).length, 0);
});
