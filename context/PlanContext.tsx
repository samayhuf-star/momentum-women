import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dayKey, mondayOf } from '../lib/week';

type PlanState = {
  programmeId: string | null;
  startKey: string | null;
  styles: string[];
  length: number | null;
  reminders: boolean;
  onboarded: boolean;
};

type PlanContextType = PlanState & {
  loading: boolean;
  setFilters: (styles: string[], length: number | null) => void;
  chooseProgramme: (id: string) => Promise<void>;
  setReminders: (on: boolean) => Promise<void>;
  finishOnboarding: () => Promise<void>;
  reset: () => Promise<void>;
};

const EMPTY: PlanState = { programmeId: null, startKey: null, styles: [], length: null, reminders: false, onboarded: false };
const KEY = '@momentum_women_plan';
const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlanState>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
      } catch (e) {
        console.log('Plan load error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const commit = async (next: PlanState) => {
    setState(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const value: PlanContextType = {
    ...state,
    loading,
    setFilters: (styles, length) => setState((s) => ({ ...s, styles, length })),
    chooseProgramme: (id) => commit({ ...state, programmeId: id, startKey: dayKey(mondayOf()) }),
    setReminders: (on) => commit({ ...state, reminders: on }),
    finishOnboarding: () => commit({ ...state, onboarded: true }),
    reset: async () => {
      setState(EMPTY);
      await AsyncStorage.removeItem(KEY);
    },
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
