import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { ENTITLEMENT } from './pro';

/** All store work goes through RevenueCat. Keys are public SDK keys baked in at build time. */
const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
}) ?? '';

let configured = false;
let listening = false;
const listeners = new Set<(isPremium: boolean) => void>();

export const isPremiumFrom = (info: CustomerInfo | null | undefined) => !!info?.entitlements.active[ENTITLEMENT];

const log = (action: string, e: unknown) => console.log('[momentum-rc]', `${action} failed`, (e as { message?: string })?.message ?? e);

/** Configure RevenueCat once. Returns false when no key is baked into this build. */
export async function initPurchases(appUserId?: string | null): Promise<boolean> {
  if (!API_KEY) return false;
  if (!configured) {
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: API_KEY, appUserID: appUserId || undefined });
    configured = true;
    if (Platform.OS === 'ios') Purchases.enableAdServicesAttributionTokenCollection().catch((e) => log('adServices', e));
  }
  if (!listening) {
    listening = true;
    Purchases.addCustomerInfoUpdateListener((info) => {
      const on = isPremiumFrom(info);
      listeners.forEach((cb) => cb(on));
    });
  }
  return true;
}

export async function refreshEntitlements(): Promise<boolean> {
  if (!configured) return false;
  try {
    return isPremiumFrom(await Purchases.getCustomerInfo());
  } catch (e) {
    log('getCustomerInfo', e);
    return false;
  }
}

export function onEntitlementChange(cb: (isPremium: boolean) => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export async function restore(): Promise<boolean> {
  if (!configured) return false;
  try {
    const on = isPremiumFrom(await Purchases.restorePurchases());
    listeners.forEach((cb) => cb(on));
    return on;
  } catch (e) {
    log('restorePurchases', e);
    return false;
  }
}

/** Link purchases to a signed-in user, or go back to anonymous on sign-out. */
export async function identify(appUserId: string | null, name?: string | null) {
  if (!configured) return;
  try {
    if (appUserId) {
      await Purchases.logIn(appUserId);
      if (name) await Purchases.setDisplayName(name);
    } else if (!(await Purchases.isAnonymous())) {
      await Purchases.logOut();
    }
  } catch (e) {
    log('identify', e);
  }
}

export async function setAttributes(attrs: Record<string, string | null>) {
  if (!configured) return;
  try {
    await Purchases.setAttributes(attrs);
  } catch (e) {
    log('setAttributes', e);
  }
}

export async function openCustomerCenter() {
  if (!configured) return;
  try {
    await RevenueCatUI.presentCustomerCenter();
  } catch (e) {
    log('customerCenter', e);
  }
}

export const hasKey = () => !!API_KEY;
