export const APPLE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

export type ManageSubscriptionsResult = 'store-sheet' | 'deep-link' | 'apple-account';

type OpenManageDeps = {
  platform: string;
  showManage?: () => Promise<unknown>;
  deepLink?: () => Promise<unknown>;
  openURL: (url: string) => Promise<unknown>;
};

/** Opens the store's subscription manager, then the Apple subscriptions page if that fails. */
export async function openManageSubscriptions(deps: OpenManageDeps): Promise<ManageSubscriptionsResult> {
  if (deps.platform === 'ios' && deps.showManage) {
    try {
      await deps.showManage();
      return 'store-sheet';
    } catch {
      // The sheet is unavailable. Try the deep link, then the account page.
    }
  }
  if (deps.deepLink) {
    try {
      await deps.deepLink();
      return 'deep-link';
    } catch {
      // Fall through to the public subscriptions page.
    }
  }
  await deps.openURL(APPLE_SUBSCRIPTIONS_URL);
  return 'apple-account';
}
