import React, { createContext, useContext, useEffect, useState } from 'react';
import { initIAP, onEntitlementChange, refreshEntitlements } from '../lib/purchases';

type ProContextValue = { isPro: boolean; loading: boolean; refresh: () => Promise<boolean> };

const ProContext = createContext<ProContextValue>({ isPro: false, loading: true, refresh: async () => false });

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const entitled = await refreshEntitlements();
    setIsPro(entitled);
    return entitled;
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await initIAP();
      const entitled = await refreshEntitlements();
      if (alive) {
        setIsPro(entitled);
        setLoading(false);
      }
    })();
    const off = onEntitlementChange((value) => {
      if (alive) setIsPro(value);
    });
    return () => {
      alive = false;
      off();
    };
  }, []);

  return <ProContext.Provider value={{ isPro, loading, refresh }}>{children}</ProContext.Provider>;
}

export const usePro = () => useContext(ProContext);
