import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dayKey } from '../lib/week';
import { EMPTY, applyCompletion, applySet, type Stored, type JournalEntry, type LastWorkout } from '../lib/progress';

export type { JournalEntry, LastWorkout };

type ProgressContextType = Stored & {
  loading: boolean;
  completeWorkout: (plannedSeconds?: number, detail?: { key: string; moves: number; sets: number }) => Promise<void>;
  logSet: (exerciseId: string, reps: number, weight: number) => Promise<void>;
  resetProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
const STORAGE_KEY = '@momentum_women_progress';

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
    await commit(applyCompletion(latest.current, dayKey(), plannedSeconds, detail));
  };

  const logSet: ProgressContextType['logSet'] = async (exerciseId, reps, weight) => {
    await commit(applySet(latest.current, exerciseId, dayKey(), reps, weight));
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
