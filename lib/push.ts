type Mod = typeof import('react-native-onesignal');

/** OneSignal is native and missing in Expo Go, so load it lazily and carry on without it. */
function mod(): Mod | null {
  try {
    return require('react-native-onesignal') as Mod;
  } catch {
    return null;
  }
}


/** OneSignal push. Does nothing when no App ID is baked into the build. */
const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '';
let ready = false;

export function initPush(): boolean {
  if (!APP_ID) return false;
  if (!ready) {
    const m = mod();
    if (!m) return false;
    if (__DEV__) m.OneSignal.Debug.setLogLevel(m.LogLevel.Verbose);
    m.OneSignal.initialize(APP_ID);
    ready = true;
  }
  return true;
}

/** Ask for permission only from a screen that has explained why. Never a gate. */
export async function askForPush(): Promise<boolean> {
  if (!initPush()) return false;
  try {
    return await mod()!.OneSignal.Notifications.requestPermission(true);
  } catch (e) {
    console.log('[momentum-push] permission failed', (e as { message?: string })?.message);
    return false;
  }
}

export function tagPush(tags: Record<string, string>) {
  if (!ready) return;
  mod()?.OneSignal.User.addTags(tags);
}

export function loginPush(externalId: string | null) {
  if (!ready) return;
  if (externalId) mod()?.OneSignal.login(externalId);
  else mod()?.OneSignal.logout();
}
