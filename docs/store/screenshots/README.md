# Final App Store screenshots

Rendered 14 Nov 2026 from `main` after the build 2 fixes and the UI redesign. Linux has no iOS Simulator, so each frame is the real app screen from Expo web, then a caption band and a 9:41 status bar were added for the store sizes.

`ios.supportsTablet` is false, so there is no iPad set.

## 6.9 inch — 1290 × 2796

`docs/store/screenshots/ios-6.9/`

| File | Screen | Caption |
| --- | --- | --- |
| `01-today.png` | Today | Start today's session |
| `02-plans.png` | Plans | Choose a plan |
| `03-workout.png` | Workout player | Follow the move |
| `04-progress.png` | Progress | Your streak, on this iPhone |
| `05-exercise.png` | Exercise detail | See the move first |

## 6.5 inch — 1284 × 2778

`docs/store/screenshots/ios-6.5/`

The same five files. Each 6.9 inch frame was scaled to 1284 × 2778.

## IAP review — 1290 × 2796

`docs/store/screenshots/iap-review/`

| File | What is highlighted |
| --- | --- |
| `paywall.png` | Yearly, the plan the paywall outlines by default |
| `paywall-monthly.png` | Monthly, $2.99 |
| `paywall-yearly.png` | Yearly, $19.99 with a 7-day trial |
| `paywall-lifetime.png` | Lifetime, $39.99 |

These use the paywall screen from `main`. This machine cannot load StoreKit, so the three prices shown are the ones in `qa/MomentumWomen.storekit`: monthly $2.99, yearly $19.99 with a 7-day free trial, lifetime $39.99. The lines are the paywall's own trial and price text. Restore, Terms, and Privacy are on the screen. No paywall code change was committed.

Illustrations are the Open Exercise Illustrations stills the app already ships. The Pilates Hundred still (CC BY-SA, Helisusa) is credited in the app and is not in these frames. This app has no custom generator. The fifth frame is the exercise detail, which is the library detail screen in the redesigned UI. Captions do not make medical or weight-loss claims.
