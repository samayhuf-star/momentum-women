# In-App Purchase Setup

Purchases go through RevenueCat (`react-native-purchases` and `react-native-purchases-ui`). No direct StoreKit code.

## Plans
See `PRICING.md`. Entitlement `premium`, offering `default`, packages `weekly`, `monthly`, `annual`, `lifetime`.

## In the app
- `lib/purchases.ts` configures RevenueCat from `EXPO_PUBLIC_RC_IOS_KEY`, listens for customer-info changes, restores and opens Customer Center.
- `app/paywall.tsx` shows RevenueCat's own paywall, designed in the RevenueCat dashboard.
- Starting a workout needs the `premium` entitlement. Expo Go and key-less dev runs stay open so screens can be checked.
- Push: OneSignal, App ID in `EXPO_PUBLIC_ONESIGNAL_APP_ID`.
- Purchases cannot be tested in Expo Go. Use a development or TestFlight build with a sandbox Apple ID.
