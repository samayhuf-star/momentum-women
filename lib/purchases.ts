import { Linking, Platform } from 'react-native';
import Purchases, {
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesPackage,
  type PurchasesStoreProduct,
} from 'react-native-purchases';
import { PRODUCT_CATALOG } from './pro';

// RevenueCat-backed store layer. Public API is unchanged from the previous expo-iap
// version (initIAP / loadPlans / refreshEntitlements / onEntitlementChange / buy /
// manageSubscription / restore) so ProContext and the custom paywall are untouched.
//
// Premium = ANY active RevenueCat entitlement (so the entitlement id can be anything);
// plans are matched to PRODUCT_CATALOG by store product id (offering/package names are free).
// Requires env at build time: EXPO_PUBLIC_RC_IOS_KEY (iOS) / EXPO_PUBLIC_RC_ANDROID_KEY (Android).

export type Plan = (typeof PRODUCT_CATALOG)[number] & {
  price: string;
  product: PurchasesStoreProduct;
  pkg: PurchasesPackage;
  trialDays: number | null;
};
export type BuyResult = 'purchased' | 'cancelled' | 'pending' | 'error';
export type PlansLoad = { plans: Plan[]; error: string | null };

const UNIT_DAYS: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
let configured = false;
const entitlementListeners = new Set<(isPremium: boolean) => void>();

const emitPremium = (isPremium: boolean) => entitlementListeners.forEach((cb) => cb(isPremium));
const isPremium = (info: CustomerInfo | null | undefined) =>
  !!info && Object.keys(info.entitlements.active).length > 0;

const logErr = (action: string, e: unknown) => {
  const err = e as { code?: unknown; message?: string; underlyingErrorMessage?: string };
  console.log('[momentum-iap]', `${action} failed`, {
    code: err?.code,
    message: err?.message,
    underlyingErrorMessage: err?.underlyingErrorMessage,
  });
};

function apiKey(): string | undefined {
  return Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_RC_IOS_KEY
    : process.env.EXPO_PUBLIC_RC_ANDROID_KEY;
}

export async function initIAP(): Promise<boolean> {
  if (configured) return true;
  const key = apiKey();
  if (!key) {
    logErr('configure', { message: 'missing RevenueCat API key (EXPO_PUBLIC_RC_IOS_KEY)' });
    return false;
  }
  try {
    Purchases.configure({ apiKey: key });
    Purchases.addCustomerInfoUpdateListener((info) => emitPremium(isPremium(info)));
    configured = true;
    return true;
  } catch (e) {
    logErr('configure', e);
    return false;
  }
}

function introDays(product: PurchasesStoreProduct): number | null {
  const ip = product.introPrice;
  if (!ip || ip.price !== 0) return null; // only a *free* trial counts
  const per = UNIT_DAYS[ip.periodUnit] ?? 0;
  const days = per * (ip.periodNumberOfUnits || 1) * (ip.cycles || 1);
  return days > 0 ? days : null;
}

async function trialEligible(productId: string): Promise<boolean> {
  if (Platform.OS !== 'ios') return true;
  try {
    const map = await Purchases.checkTrialOrIntroductoryPriceEligibility([productId]);
    return map?.[productId]?.status !== 1; // 1 = INELIGIBLE; unknown/eligible both allowed
  } catch (e) {
    logErr('checkTrialEligibility', e);
    return true;
  }
}

export async function loadPlans(): Promise<PlansLoad> {
  if (!(await initIAP())) {
    return { plans: [], error: 'Plans unavailable right now. Please try again shortly.' };
  }
  let packages: PurchasesPackage[] = [];
  try {
    const offerings = await Purchases.getOfferings();
    packages = offerings.current?.availablePackages ?? [];
  } catch (e) {
    logErr('getOfferings', e);
  }
  const byProductId = new Map<string, PurchasesPackage>();
  for (const pkg of packages) {
    if (pkg.product?.identifier) byProductId.set(pkg.product.identifier, pkg);
  }
  const plans: Plan[] = [];
  for (const def of PRODUCT_CATALOG) {
    const pkg = byProductId.get(def.id);
    if (!pkg) continue;
    let trialDays: number | null = null;
    if (def.kind !== 'lifetime') {
      const days = introDays(pkg.product);
      trialDays = days && (await trialEligible(def.id)) ? days : null;
    }
    plans.push({ ...def, price: pkg.product.priceString, product: pkg.product, pkg, trialDays });
  }
  if (!plans.length) {
    return { plans: [], error: 'Plans unavailable right now. Please try again shortly.' };
  }
  return { plans, error: null };
}

export async function refreshEntitlements(): Promise<boolean> {
  if (!(await initIAP())) return false;
  try {
    return isPremium(await Purchases.getCustomerInfo());
  } catch (e) {
    logErr('getCustomerInfo', e);
    return false;
  }
}

export function onEntitlementChange(cb: (isPremium: boolean) => void): () => void {
  entitlementListeners.add(cb);
  return () => {
    entitlementListeners.delete(cb);
  };
}

export async function buy(plan: Plan): Promise<BuyResult> {
  if (!(await initIAP())) return 'error';
  if (!plan?.pkg) return 'error';
  try {
    const { customerInfo } = await Purchases.purchasePackage(plan.pkg);
    const entitled = isPremium(customerInfo);
    emitPremium(entitled);
    return entitled ? 'purchased' : 'error';
  } catch (e) {
    if ((e as { userCancelled?: boolean })?.userCancelled) return 'cancelled';
    if ((e as { code?: string })?.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) return 'pending';
    logErr('purchasePackage', e);
    return 'error';
  }
}

export async function manageSubscription(): Promise<void> {
  const url =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions';
  try {
    await Linking.openURL(url);
  } catch (e) {
    logErr('manageSubscription', e);
  }
}

export async function restore(): Promise<boolean> {
  if (!(await initIAP())) return false;
  try {
    const entitled = isPremium(await Purchases.restorePurchases());
    emitPremium(entitled);
    return entitled;
  } catch (e) {
    logErr('restorePurchases', e);
    return false;
  }
}
