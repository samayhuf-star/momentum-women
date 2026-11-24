import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type ProContextValue = { isPro: boolean; canTrain: boolean; loading: boolean; refresh: () => Promise<boolean> };
type Purchases = typeof import('../lib/purchases');

const ProContext = createContext<ProContextValue>({ isPro: false, canTrain: false, loading: true, refresh: async () => false });

/** RevenueCat is native. It is missing in Expo Go, so load it lazily and carry on without it. */
function loadPurchases(): Purchases | null {
  try {
    return require('../lib/purchases') as Purchases;
  } catch {
    return null;
  }
}

export function ProProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  // Expo Go and key-less dev runs have no store, so keep training open there. Release builds always need the entitlement.
  const devOpen = __DEV__ && !loadPurchases()?.hasKey();
  const appUserId = user && !user.isGuest ? user.id : null;

  const refresh = async () => {
    const store = loadPurchases();
    if (!store) return false;
    const entitled = await store.refreshEntitlements();
    setIsPro(entitled);
    return entitled;
  };

  useEffect(() => {
    let alive = true;
    let off = () => {};
    (async () => {
      const store = loadPurchases();
      try {
        if (store && (await store.initPurchases(appUserId))) {
          await store.identify(appUserId, user?.name);
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
  }, [appUserId]);

  return <ProContext.Provider value={{ isPro, canTrain: isPro || devOpen, loading, refresh }}>{children}</ProContext.Provider>;
}

export const usePro = () => useContext(ProContext);
