# In-App Purchase Setup

Purchases use Apple StoreKit 2 through `expo-iap`. Do not add RevenueCat or `react-native-purchases`.

## Product IDs (App Store Connect)
- `com.samayvashsht.momentumwomen.monthly` — $2.99/month, 7-day free trial for eligible new subscribers
- `com.samayvashsht.momentumwomen.yearly` — $19.99/year, 7-day free trial for eligible new subscribers
- `com.samayvashsht.momentumwomen.lifetime` — $39.99 one-time non-consumable, no trial

## In the app
- `lib/purchases.ts` loads store prices, checks intro-offer eligibility, and restores purchases.
- The paywall shows "7 days free, then <store price>/period, cancel anytime" only when the store reports an eligible trial. Lifetime never shows trial text.
- Simulator testing uses `qa/MomentumWomen.storekit` (wired by `qa/sim-qa/prepare.sh`).
