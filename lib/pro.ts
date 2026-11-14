export const BUNDLE_ID = 'com.samayvashsht.momentumwomen';

export const PRODUCT_IDS = {
  monthly: `${BUNDLE_ID}.monthly`,
  yearly: `${BUNDLE_ID}.yearly`,
  lifetime: `${BUNDLE_ID}.lifetime`,
} as const;

export const PRODUCT_CATALOG = [
  { id: PRODUCT_IDS.yearly, kind: 'yearly' as const, type: 'subs' as const, label: 'Yearly', period: 'year' as const },
  { id: PRODUCT_IDS.monthly, kind: 'monthly' as const, type: 'subs' as const, label: 'Monthly', period: 'month' as const },
  { id: PRODUCT_IDS.lifetime, kind: 'lifetime' as const, type: 'in-app' as const, label: 'Lifetime', period: null },
];

export const SUB_PRODUCT_IDS = [PRODUCT_IDS.yearly, PRODUCT_IDS.monthly];
export const IAP_PRODUCT_IDS = [PRODUCT_IDS.lifetime];
export const ALL_PRODUCT_IDS: string[] = PRODUCT_CATALOG.map((p) => p.id);
export const isKnownProduct = (id: string | null | undefined) => !!id && ALL_PRODUCT_IDS.includes(id);

export const PRIVACY_URL = 'https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html';
export const TERMS_URL = 'https://samayhuf-star.github.io/app-legal/momentum-women/terms.html';
export const APPLE_EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

export const FREE_FEATURES: string[] = [
  "Today's suggested session",
  'Workout player with timer or reps',
  'Form cues and the exercise library',
  'Streak and workout count on this device',
];

export const PRO_FEATURES: string[] = ['Full Body and Upper Body training plans'];

export function planRequiresPro(planId: string): boolean {
  return planId !== 'beginner';
}
