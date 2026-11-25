import { OneSignal } from 'react-native-onesignal';

// OneSignal push init. App ID from env at build time (EXPO_PUBLIC_ONESIGNAL_APP_ID).
// Safe no-op if the id is missing, so the app still runs without push configured.
let started = false;

export function initOneSignal(): void {
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
