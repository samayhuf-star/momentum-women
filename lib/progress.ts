import { dayKey } from './week.ts';

export type JournalEntry = { day: string; reps: number; weight: number };
export type LastWorkout = { key: string; day: string; seconds: number; moves: number; sets: number };

export type Stored = {
  completedDays: string[];
  completedSessions: string[];
  minutesByDay: Record<string, number>;
  streak: number;
  totalWorkouts: number;
  minutes: number;
  journal: Record<string, JournalEntry[]>;
  last: LastWorkout | null;
};

export const EMPTY: Stored = { completedDays: [], completedSessions: [], minutesByDay: {}, streak: 0, totalWorkouts: 0, minutes: 0, journal: {}, last: null };

export function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

/** The state after finishing a workout on `today`. Pure, so it can be tested. */
export function applyCompletion(
  state: Stored,
  today: string,
  plannedSeconds = 0,
  detail?: { key: string; moves: number; sets: number }
): Stored {
  const added = plannedSeconds > 0 ? Math.max(1, Math.round(plannedSeconds / 60)) : 0;
  const firstToday = !state.completedDays.includes(today);
  const continues = state.completedDays.includes(previousDay(today));
  return {
    ...state,
    completedDays: firstToday ? [...state.completedDays, today] : state.completedDays,
    completedSessions: detail && !state.completedSessions.includes(detail.key) ? [...state.completedSessions, detail.key] : state.completedSessions,
    minutesByDay: { ...state.minutesByDay, [today]: (state.minutesByDay[today] ?? 0) + added },
    streak: firstToday ? (continues ? state.streak + 1 : 1) : state.streak,
    totalWorkouts: state.totalWorkouts + 1,
    minutes: state.minutes + added,
    last: detail ? { ...detail, day: today, seconds: plannedSeconds } : state.last,
  };
}

/** The state after logging a set. Keeps the last 50 entries per exercise. */
export function applySet(state: Stored, exerciseId: string, day: string, reps: number, weight: number): Stored {
  const list = [...(state.journal[exerciseId] ?? []), { day, reps, weight }].slice(-50);
  return { ...state, journal: { ...state.journal, [exerciseId]: list } };
}
