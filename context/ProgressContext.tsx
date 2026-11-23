import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dayKey } from '../lib/week';

export type JournalEntry = { day: string; reps: number; weight: number };
export type LastWorkout = { key: string; day: string; seconds: number; moves: number; sets: number };

type Stored = {
  completedDays: string[];
  completedSessions: string[];
  minutesByDay: Record<string, number>;
  streak: number;
  totalWorkouts: number;
  minutes: number;
  journal: Record<string, JournalEntry[]>;
  last: LastWorkout | null;
};

type ProgressContextType = Stored & {
  loading: boolean;
  completeWorkout: (plannedSeconds?: number, detail?: { key: string; moves: number; sets: number }) => Promise<void>;
  logSet: (exerciseId: string, reps: number, weight: number) => Promise<void>;
  resetProgress: () => Promise<void>;
};

const EMPTY: Stored = { completedDays: [], completedSessions: [], minutesByDay: {}, streak: 0, totalWorkouts: 0, minutes: 0, journal: {}, last: null };
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
const STORAGE_KEY = '@momentum_women_progress';

function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Stored>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) setState({ ...EMPTY, ...JSON.parse(data) });
      } catch (e) {
        console.log('Progress load error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // A set can be logged and the workout completed in the same handler, so read the latest state from a ref.
  const latest = useRef(state);
  latest.current = state;
  const commit = async (next: Stored) => {
    latest.current = next;
    setState(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const completeWorkout: ProgressContextType['completeWorkout'] = async (plannedSeconds = 0, detail) => {
    const state = latest.current;
    const today = dayKey();
    const added = plannedSeconds > 0 ? Math.max(1, Math.round(plannedSeconds / 60)) : 0;
    const firstToday = !state.completedDays.includes(today);
    const continues = state.completedDays.includes(previousDay(today));
    await commit({
      ...state,
      completedDays: firstToday ? [...state.completedDays, today] : state.completedDays,
      completedSessions: detail && !state.completedSessions.includes(detail.key) ? [...state.completedSessions, detail.key] : state.completedSessions,
      minutesByDay: { ...state.minutesByDay, [today]: (state.minutesByDay[today] ?? 0) + added },
      streak: firstToday ? (continues ? state.streak + 1 : 1) : state.streak,
      totalWorkouts: state.totalWorkouts + 1,
      minutes: state.minutes + added,
      last: detail ? { ...detail, day: today, seconds: plannedSeconds } : state.last,
    });
  };

  const logSet: ProgressContextType['logSet'] = async (exerciseId, reps, weight) => {
    const state = latest.current;
    const list = [...(state.journal[exerciseId] ?? []), { day: dayKey(), reps, weight }].slice(-50);
    await commit({ ...state, journal: { ...state.journal, [exerciseId]: list } });
  };

  const resetProgress = async () => {
    latest.current = EMPTY;
    setState(EMPTY);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProgressContext.Provider value={{ ...state, loading, completeWorkout, logSet, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
