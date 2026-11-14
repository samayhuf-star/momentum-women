import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProgressContextType = {
  completedDays: string[];
  streak: number;
  totalWorkouts: number;
  minutes: number;
  loading: boolean;
  completeWorkout: (plannedSeconds?: number) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = '@momentum_women_progress';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const p = JSON.parse(data);
        setCompletedDays(p.completedDays || []);
        setStreak(p.streak || 0);
        setTotalWorkouts(p.totalWorkouts || 0);
        setMinutes(p.minutes || 0);
      }
    } catch (e) {
      console.log('Progress load error', e);
    } finally {
      setLoading(false);
    }
  };

  const save = async (next: { completedDays: string[]; streak: number; totalWorkouts: number; minutes: number }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const completeWorkout = async (plannedSeconds = 0) => {
    const today = new Date().toISOString().split('T')[0];
    if (completedDays.includes(today)) return;

    const nextDays = [...completedDays, today];
    const nextStreak = streak + 1;
    const nextTotal = totalWorkouts + 1;
    const added = plannedSeconds > 0 ? Math.max(1, Math.round(plannedSeconds / 60)) : 0;
    const nextMinutes = minutes + added;

    setCompletedDays(nextDays);
    setStreak(nextStreak);
    setTotalWorkouts(nextTotal);
    setMinutes(nextMinutes);

    await save({ completedDays: nextDays, streak: nextStreak, totalWorkouts: nextTotal, minutes: nextMinutes });
  };

  return (
    <ProgressContext.Provider value={{ completedDays, streak, totalWorkouts, minutes, loading, completeWorkout }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
