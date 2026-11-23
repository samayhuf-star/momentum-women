import React, { createContext, useContext, useEffect, useState } from 'react';

type ProContextValue = { isPro: boolean; loading: boolean; refresh: () => Promise<boolean> };
type Purchases = typeof import('../lib/purchases');

const ProContext = createContext<ProContextValue>({ isPro: false, loading: true, refresh: async () => false });

/** The store module is native. It is missing in Expo Go, so load it lazily and carry on without it. */
function loadPurchases(): Purchases | null {
  try {
    return require('../lib/purchases') as Purchases;
  } catch {
    return null;
  }
}

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const store = loadPurchases();
    if (!store) return false;
    try {
      const entitled = await store.refreshEntitlements();
      setIsPro(entitled);
      return entitled;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let alive = true;
    let off = () => {};
    (async () => {
      const store = loadPurchases();
      try {
        if (store) {
          await store.initIAP();
          const entitled = await store.refreshEntitlements();
          if (alive) setIsPro(entitled);
          off = store.onEntitlementChange((value) => {
            if (alive) setIsPro(value);
          });
        }
      } catch (e) {
        console.log('Store unavailable', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
      off();
    };
  }, []);

  return <ProContext.Provider value={{ isPro, loading, refresh }}>{children}</ProContext.Provider>;
}

export const usePro = () => useContext(ProContext);
