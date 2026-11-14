# QA checklist — Momentum – Women's Workout, iOS build 1

Date: 14 Nov 2026. Scope: docs and a local pass only. No EAS cloud build, no App Store Connect write, no submit.

Build under test: iOS `buildNumber` 1. The uploaded local build and the passing simulator run both used app commit `1e48e20` ("Expose testIDs to XCUITest, add Close on workout, and respect safe areas"). Commits after that, on `main` and on `store-assets`, are docs only. This checklist was run on `store-assets` plus this branch, which contains that same app code.

The checklist is the women release list in `docs/launch-archive/momentum-plan-2026-11-14.md` (code gaps in section 1, and the simulator flow in section 3). That archive has no separate checkbox file. Each row is one of those items, checked against the current tree.

How this pass ran:

- `npm ci`, then `npx tsc --noEmit` (the `lint` script). Exit 0. Node v22.23.4. There is no Jest script.
- Expo web (`npx expo start --web`) in Chrome, because Linux has no iOS Simulator. `react-native-web` is not a repo dependency; it was installed only in local `node_modules` and was not committed.
- GitHub Actions was read, not triggered.

Legend: **PASS** checked here. **FAIL** a real gap. **DEVICE** needs an iOS Simulator or a phone. A prior simulator run is cited where it exists, and is not treated as a new run from this machine.

| # | Item | Result | Evidence |
| --- | --- | --- | --- |
| 1 | No third-party exercise GIFs in the shipping tree | PASS | `find` over the worktree: 0 `.gif` files. No `assets/gifs/` directory (`assets/gifs/` is gitignored). No `require` of a gif path. Stills are the CC0 / CC BY-SA files in `assets/exercise-media/`. |
| 2 | No missing image `require`s | PASS | 46 visible exercises in `data/exercises.ts`, 46 keys in `lib/exerciseMediaMap.ts`, none missing. Four catalog rows are `hidden: true` and are not in plans. Web loaded `goblet-squat-start.webp` and the push-up still from Metro. |
| 3 | Today **Start** opens a workout | PASS | Web: `start-workout` opened Goblet Squat, "Lower Body · 1 / 6". |
| 4 | Quick actions go somewhere | PASS | `app/(tabs)/index.tsx` routes Browse, Plans, and Progress to those tabs. Web opened `/workouts`, `/plans`, and `/progress` from the tab bar (same routes). |
| 5 | Today stats are stored progress, not the old 12 / 4 / 180 placeholders | PASS | Fresh web session showed 0 and 0 plus "Complete a session to start your on-device history." After Finish, `@momentum_women_progress` was `{"completedDays":["2026-11-14"],"streak":1,"totalWorkouts":1}` and Today showed 1 and 1. |
| 6 | Plans is a real list, with no cycle-aware copy | PASS | Web Plans: Beginner Strength (6, free), Full Body · Pro (8), Upper Body · Pro (8). Subtitle is "Sessions built from the exercise library". No cycle wording in `app/`, `data/`, or `components/`. |
| 7 | No "Sign in later to save progress" | PASS | Login subtitle: "Progress stays on this device. No account is required." |
| 8 | No missing `onboarding` route | PASS | `app/_layout.tsx` registers login, tabs, `workout/[id]`, paywall, and credits. No `onboarding` screen and no link to one. |
| 9 | Guest only. No account and no email login | PASS | `AuthContext` has `loginAsGuest` and `logout` only. The login screen has one button, Continue as Guest. |
| 10 | HealthKit removed for v1 | PASS | `app.json` plugins are expo-router, expo-iap, and expo-splash-screen. `package.json` has no `react-native-health`. No `healthSync` file. No `energyBurned` write. |
| 11 | Soft paywall through expo-iap, store-loaded prices | PASS in source. DEVICE for a live purchase | `app/paywall.tsx` loads plans from `loadPlans()` and renders `displayPrice`. It does not ship a fake dollar button. On web, `expo-iap` throws "Cannot find native module 'ExpoIap'", so the paywall cannot load offers here. Simulator run [43585260629](https://github.com/AI-Samay/sim-qa-runner/actions/runs/43585260629) on `momentum-women@1e48e20` passed the paywall and the yearly StoreKit control. A purchase on build 1 still needs a device or TestFlight. |
| 12 | `.storekit` file matches the locked prices | PASS | `qa/MomentumWomen.storekit`: monthly $2.99 P1M, yearly $19.99 P1Y, both with a free intro of P1W (7 days). Lifetime $39.99 non-consumable, no intro offer. |
| 13 | Restore is on the paywall | PASS for the control. DEVICE for a real restore | `testID="restore"` in `app/paywall.tsx`, label "Restore purchases". The simulator run above recorded the Restore control as present. Completing a restore against a sandbox purchase was not done here. |
| 14 | Terms and privacy links | PASS | URLs in `lib/pro.ts`. `curl -L` on 14 Nov 2026: privacy, terms, and support each returned HTTP 200. Apple standard EULA also returned 200. |
| 15 | Auto-renew disclosure, and lifetime does not renew | PASS | `renewalDisclosure()` in `lib/introOffer.ts` covers trial end, renewal, the lifetime one-time purchase, and where to cancel. The paywall renders it. |
| 16 | Trial copy only when the store reports a trial. Lifetime never shows a trial | PASS in source. DEVICE for the live string | `planLine` / `ctaText`. Lifetime returns before any trial branch. Web cannot ask StoreKit. The `.storekit` intro offer is 7 days, which matches the locked price. |
| 17 | Pro gate is real | PASS for the lock label. DEVICE to buy through it | `planRequiresPro` is true for every plan except `beginner`. Web Plans showed "Full Body · Pro" and "Upper Body · Pro". Tapping those routes to the paywall in `app/(tabs)/plans.tsx`. Unlock after purchase was not exercised (no StoreKit on web). |
| 18 | `IAP_SETUP.md` does not tell anyone to add RevenueCat | PASS | It says to use expo-iap and not to add RevenueCat or `react-native-purchases`. The package is not installed. |
| 19 | Product IDs are the long `com.samayvashsht.momentumwomen.*` IDs | PASS | `lib/pro.ts` builds monthly, yearly, and lifetime from the bundle ID. No `momentum_women_monthly` style IDs in the app. |
| 20 | Prices match free / 7-day trial / $2.99 / $19.99 / $39.99 | PASS | No mismatch. See the pricing table in `docs/store/listing-draft.md`. Dollar amounts are not hardcoded in the paywall. `ctaText` says "7 days" whenever a trial exists, while `planLine` uses the store's day count. With the current P1W offer both say 7. Pricing code was not changed. |
| 21 | `ITSAppUsesNonExemptEncryption` is false | PASS | `app.json` `ios.infoPlist`. |
| 22 | `ios.buildNumber` is 1 | PASS | `app.json`. Matches the TestFlight build described as build 1. |
| 23 | Expo owner and project id | PASS | `owner` `krosz`, `extra.eas.projectId` `53a2cf35-ce2a-4aa6-aa9f-f63b318a9f5f`. |
| 24 | No "AI" wording in the UI | PASS | Search of `app/`, `components/`, `data/`, `lib/`, `context/`. None in user-facing strings. |
| 25 | No ellipsis character in the UI | PASS | No U+2026 in those sources. |
| 26 | No medical or cycle-diagnosis copy in the UI | PASS | No cycle, calorie, diagnosis, or weight-loss strings in the UI sources. Progress subtitle is "Track your strength and consistency", which is training language. Flagged for Samay below in case that line should be plainer. |
| 27 | No CoreForge leftovers in the app | PASS | No matches under `app/`, `components/`, `data/`, `lib/`. |
| 28 | Icon 1024 and no alpha | PASS | `assets/icon.png` is 1024 × 1024, PNG color type 2 (RGB, no alpha). `assets/splash.png` is 1284 × 1913, RGB. |
| 29 | Typecheck | PASS | `npx tsc --noEmit` exit 0. |
| 30 | Simulator flow: guest, home, workout, exercise detail, paywall, Restore | DEVICE for a new run. Prior run passed | This machine cannot boot an iOS Simulator. Web covered guest, home, workout, exercise detail, plans, and progress (screenshots in `docs/store/screenshots/ios-6.9/`). Paywall and Restore need StoreKit. Prior pass: [iOS Simulator QA 43585260629](https://github.com/AI-Samay/sim-qa-runner/actions/runs/43585260629), job "Simulator QA (samayhuf-star/momentum-women@1e48e20)", `macos-latest`, conclusion success, 14 Nov 2026 10:26–10:55 UTC. That job's steps include "Run flow" success. |
| 31 | Workout-complete alert dismisses the player | DEVICE | On iOS, `Alert.alert` in `app/workout/[id].tsx` asks the reviewer to tap OK, then `router.back()`. react-native-web's `Alert.alert` is an empty function, so web saved progress and stayed on the player until Close. Confirm the alert on a simulator or on build 1. |
| 32 | Safe area and status bar | DEVICE | Screens use `SafeAreaView`. Web insets are 0, so the new screenshots have no status bar. The older sim frames in `docs/sim-screenshots/` are 1206 × 2622 and do show a status bar. They are the wrong size for the 6.9" slot and `03-paywall.png` is not listing art. |
| 33 | iPad screenshots, because `supportsTablet` is true on build 1 | FIXED on build 2, not in this branch | Build 1's `app.json` has `supportsTablet: true`. `release/build2` sets it to `false` and `buildNumber` to `2`. This listing set stays iPhone 6.9" only. No iPad set is required once that change ships. |
| 34 | README still says unmatched exercises use a placeholder | FIXED on build 2, not in this branch | On build 1, `README.md` says unmatched exercises use a neutral placeholder. `release/build2` replaces that sentence. Unmatched moves are hidden. `LICENSE-SOURCES.md` lists the 88 stills that ship, including one CC BY-SA photograph (Pilates Hundred by Helisusa). |

## GitHub Actions macOS runners

This repo (`samayhuf-star/momentum-women`) has **no** `.github/workflows` and the Actions API returns **0 workflows and 0 runs**. Nothing on this repo can start a macOS job, and nothing here was triggered.

iOS builds and simulator QA for this app run on `AI-Samay/sim-qa-runner`, label `macos-latest`. Recent jobs were read, not started:

| Run | When (UTC) | Result | Notes |
| --- | --- | --- | --- |
| [43585260629](https://github.com/AI-Samay/sim-qa-runner/actions/runs/43585260629) iOS Simulator QA | 14 Nov 2026 10:26 | success | `momentum-women@1e48e20`. Runner assigned (`macos-latest`). Not a billing lock. |
| [43587712681](https://github.com/AI-Samay/sim-qa-runner/actions/runs/43587712681) iOS Local Build | 14 Nov 2026 10:57 | success | Same commit, `upload=true`. `eas build --local` and the App Store Connect upload step both succeeded. This is the likely build 1 upload. |
| [43562521008](https://github.com/AI-Samay/sim-qa-runner/actions/runs/43562521008) iOS Simulator QA | 14 Nov 2026 05:38 | failure | Older commit `4dfa993`. The runner started. Failure was "Build Release simulator app", not a billing lock. |

The 12 Nov audit in `docs/store/workout-apps-audit-2026-11-12.md` says a billing lock did not block clone that day. No billing-lock message showed up on the jobs above: each job left "Set up job" and received a GitHub-hosted runner id.

## What still needs a device or TestFlight

- Paywall offers, localized prices, the 7-day trial line, and Restore against StoreKit.
- The "Workout complete" alert and the return to Today.
- Status bar and home-indicator insets.
- A click-through of the TestFlight build, as opposed to this web render. Build 2 turns tablet support off, so an iPad screenshot set is not part of that build.

## Build 2 update (14 Nov 2026)

`04-progress.png` was recaptured from the build 2 progress screen. The recent day reads "Nov 14" (short month, numeric day, no year because 2026 is the current year). The subtitle is still "Track your strength and consistency". The other four listing frames were not recaptured: the tab icons were already Ionicons (`home`, `calendar`, `barbell`, `stats-chart`, `person`) and build 2 does not change them. The code for the date format, the README credit note, and `supportsTablet: false` is on `release/build2`, not on this branch.
