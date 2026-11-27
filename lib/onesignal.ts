import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';

// OneSignal push. App ID from env at build time (EXPO_PUBLIC_ONESIGNAL_APP_ID).
// Consent first: the SDK is never initialized until the user opts in to reminders
// (onboarding reminders step). Safe no-op if the id is missing.
const CONSENT_KEY = '@momentum_push_consent';
let started = false;

function start(): void {
  if (started) return;
  const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
  if (!appId) return;
  try {
    OneSignal.initialize(appId);
    OneSignal.Notifications.requestPermission(true);
    started = true;
  } catch (e) {
    console.log('[momentum-onesignal] init failed', (e as { message?: string })?.message);
  }
}

/** Called at launch: starts OneSignal only if the user already opted in. */
export async function initOneSignal(): Promise<void> {
  try {
    if ((await AsyncStorage.getItem(CONSENT_KEY)) === 'yes') start();
  } catch {}
}

/** Record the user's reminder choice; starts OneSignal (and the iOS prompt) only on yes. */
export async function setPushConsent(granted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(CONSENT_KEY, granted ? 'yes' : 'no');
  } catch {}
  if (granted) start();
}
