# Workout apps: iOS TestFlight readiness audit

- Date: 12 Nov 2026, about 8:30 PM Asia/Dhaka
- Scope: read-only. Nothing was pushed, built, or changed in App Store Connect. No secrets were printed or committed.
- Repos cloned successfully (GitHub Actions billing lock did not block clone) to `/workspace/7apps/women-workout` and `/workspace/7apps/men-workout`, using `gh` as `samayhuf-star`.
- Local `npm install` created `node_modules` and a `package-lock.json` in each clone for the install and typecheck only. Those lockfiles are **not** in GitHub and were not uploaded.

## Does either repo match @krosz/abs-challenge-45?

**Neither repo is the 45 Days Abs Challenge project.**

Checked against Expo project `@krosz/abs-challenge-45` (id `39a19fc6-2a0f-4fa8-abba-0c4ca5792f4b`):

| Check | women-workout | men-workout | Expected |
|---|---|---|---|
| `extra.eas.projectId` | missing | missing | `39a19fc6-2a0f-4fa8-abba-0c4ca5792f4b` |
| Expo slug / owner | `momentum-for-women`, no owner | `coreforge`, no owner | `abs-challenge-45` / `krosz` |
| `android.package` | `com.momentum.women` | missing | `com.momentum.abscore45` |
| `package.json` name | `momentum-for-women` | `coreforge` | `abs-challenge-28` |
| Commit `ea2a0c8` | not in git history | not in git history | the 11 Nov EAS build commit |
| Expo project link | none | none | Expo `githubRepository` is also `null` |

men-workout does share the same **stack** as that project (Expo `~58.0.23`, React Native `0.88.1`), but it is a different app: display name **CoreForge**, slug `coreforge`.

Live Expo API check (12 Nov 2026, 8:24 PM Asia/Dhaka): `@krosz/abs-challenge-45` exists, created 11 Nov 2026, 11:49 PM Asia/Dhaka, updated 11 Nov 2026, 11:51 PM Asia/Dhaka (same minute as the errored EAS build `351a9351`).

**Matching GitHub repo (full audit in section 3 below):** [samayhuf-star/45-days-abs-challenge](https://github.com/samayhuf-star/45-days-abs-challenge). Its `app.json` matches the Expo project (name, slug, `projectId`, iOS/Android id `com.momentum.abscore45`, `package.json` name `abs-challenge-28`). It is a fresh 12 Nov tree and does **not** contain commit `ea2a0c8`. No App Store Connect app exists for that bundle.

Other related GitHub repos, for context only: `samayhuf-star/coreforge` (older CoreForge tree from 11 Nov, **no** `app.json`) and private `samayhuf-star/coreforge-exercises` (GIF assets). men-workout is the newer CoreForge app repo.

---

## 1. women-workout — Momentum for Women

GitHub: https://github.com/samayhuf-star/women-workout (public). Head: `cc36db3` on `main`, 12 Nov 2026, 8:08 PM Asia/Dhaka.

### 1. Stack
- Expo SDK **52** (declared `~52.0.0`, installed `52.0.49`)
- React Native **0.76.0**, React 18.3.1
- Router: **expo-router ~4.0.0** (installed `4.0.22`), entry is `index.ts` → `expo-router/entry`
- Node required: React Native 0.76 engines say `>=18`. Box ran this on Node v24.22.1. No `engines` field or `.nvmrc` in the repo.
- Package manager: npm. **No lockfile** in git, so **`npm ci` fails**: "The `npm ci` command can only install with an existing package-lock.json".
- A local `npm install --ignore-scripts` succeeded (929 packages). Warnings were deprecations and 25 audit findings, not peer-resolution failures.
- **`npx tsc --noEmit` fails** (exit 2): `context/AuthContext.tsx` imports `@react-native-async-storage/async-storage`, which is **not** in `package.json`.
- No test script and no test files.

### 2. iOS config
- Display name: **Momentum for Women** (19 characters, under the 30-character App Store limit)
- Version: `1.0.0`. **No `ios.buildNumber`.**
- `ios.bundleIdentifier`: **present** — `com.momentum.women`. Android package is the same.
- Icon and splash: **referenced but missing.** `app.json` points at `./assets/icon.png`, `./assets/splash.png`, `./assets/adaptive-icon.png`, and `./assets/favicon.png`. There is **no `assets/` directory** in the repo. An EAS iOS build will fail without an icon.
- **No `eas.json`.** No iOS production profile, no `ascAppId`, no `extra.eas.projectId`, no `owner`.
- No `ios.infoPlist` usage strings. Current code does not use camera, HealthKit, notifications, or tracking, so none are required for a first TestFlight build. Cycle-aware copy is present, but there is no health API yet.
- Unused leftover `App.tsx` still has the default Expo placeholder, "Open up App.tsx to start working on your app!" The real entry is expo-router, so this file is not shown, but it should be removed.

### 3. App Store Connect
- **No ASC app exists** for `com.momentum.women`, or for the name "Momentum for Women".
- The account currently has 10 apps (Playsz, Lulla, 2 Patti, Klenzer, ClearScan, Chezz, Twist 21, Scanwise, Klarity, Krosz Visa). None are workout apps.
- Samay must create the App Store Connect record in the web UI. `POST /v1/apps` returns 403.

### 4. IAP / paywall
- **No paywall and no IAP library.** No RevenueCat, no `react-native-purchases`, no expo-iap, no product IDs, no prices in code.
- No matching ASC products (no app record).
- No pricing decision is required for a first TestFlight build unless Samay wants a paid tier later.

### 5. Completeness
Build or runtime blockers:
- Missing icon/splash assets
- Missing AsyncStorage dependency
- Missing lockfile and eas.json
- Tab layout registers a **Today** tab named `index`, but **`app/(tabs)/index.tsx` does not exist**. Opening the main tabs will be broken.
- Root stack also registers `workout/[id]` and `onboarding`, and neither route exists.

Product gaps (the binary could still be produced after the blockers above, but the app is not a complete workout app):
- README and the initial commit claim an **82-exercise** library across six categories. `data/exercises.ts` has only **18 Lower Body** exercises. Upper Body, Core, Full Body, Pilates, and Mobility are empty.
- **Plans** and **Progress** are title-and-subtitle stubs only.
- There is no workout player, no set tracking, and no rest timer, despite the README.
- Login is guest-only. Copy says "Sign in later to save progress," but there is no sign-in.
- Cycle-aware marketing copy is on the login screen; there is no cycle tracking.
- No privacy policy URL, no ads SDKs, no AI wording, and no typographic ellipsis characters in the UI copy.

### 6. Work to get a TestFlight-installable build
This is **not trivial**. Queue it after Klenzer 25 and Twist 21.

1. Add a 1024×1024 icon and a splash image at the paths in `app.json` (or update the paths).
2. Add `@react-native-async-storage/async-storage` to `package.json` and commit a `package-lock.json` from `npm install` on Node 18+.
3. Add the missing `app/(tabs)/index.tsx` Today screen, or stop registering that tab. Remove or stub the missing `workout/[id]` and `onboarding` routes so expo-router does not warn or crash.
4. Create `eas.json` with a production (and optional preview/internal) **iOS** profile, `autoIncrement`, and later `ascAppId`.
5. Run `eas init` on the krosz account; set `expo.owner` and `extra.eas.projectId`. Do not submit to App Review.
6. Samay creates the ASC app in the web UI for the agreed bundle ID.
7. Set `ios.buildNumber` (or rely on EAS autoIncrement) and `ITSAppUsesNonExemptEncryption: false`.
8. EAS iOS build, then Internal and Team (Expo) groups only, labelled **NOT RUN** unless a device run actually happens.
9. Keep the Google Drive backup updated after meaningful code changes.

Optional before a useful QA pass, but not required just to land a binary: finish the 82-exercise library, Today/home, workout player, Plans, Progress, and a privacy policy URL.

### 7. Decisions for Samay
- **App Store name:** "Momentum for Women" is already set and is 19 characters. No new name is required unless he wants a different listing name.
- **Bundle ID:** already `com.momentum.women`. He should confirm that, or choose `com.samayvashsht.momentum-for-women` / `com.samayvashsht.women` to match the other apps. Confirm before the ASC record is created; this cannot be changed later.
- **Pricing:** none in the app today. No price to set for TestFlight unless he wants a paywall.
- **ASC record:** he must create it in the App Store Connect web UI. No record exists yet.

### Backup
Private Google Drive folder named exactly **Momentum for Women** (owner only, Samay's account; not shared):

[private recording link redacted]

Contents: `momentum-for-women-source-cc36db3-2026-11-12.zip` (git-tracked source only; no `node_modules`, `.git`, or `.env`).

---

## 2. men-workout — CoreForge

GitHub: https://github.com/samayhuf-star/men-workout (private). Head: `ba99ffd` on `main`, 12 Nov 2026, 8:07 PM Asia/Dhaka. Display name in `app.json` is **CoreForge**.

### 1. Stack
- Expo SDK **58** (declared `~58.0.23`, installed `58.0.24`)
- React Native **0.88.1**, React 19.3.0
- Router: **React Navigation 7** (native stack + bottom tabs), not expo-router. Entry is `index.js` → `registerRootComponent(App)`.
- Node required: Expo 58 engines `^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`; React Native 0.88.1 is the same plus `>= 26.0.0`. **Node 22.13+ or 24.3+.** Box Node v24.22.1 is fine. No `.nvmrc`.
- Package manager: npm. **No lockfile** in git, so **`npm ci` fails** with the same missing-lockfile error.
- A local `npm install --ignore-scripts` succeeded (475 packages, 3 moderate audit findings, no peer-resolution errors).
- **No TypeScript.** There is no `tsconfig.json`. `npx tsc --noEmit` is not applicable (npx downloaded the unrelated `tsc@2.0.4` stub because `typescript` is not a dependency).
- No test script and no test files.

### 2. iOS config
- Display name: **CoreForge** (9 characters, under 30)
- Version: `1.0.0`. **No `ios.buildNumber`.**
- `ios.bundleIdentifier`: **missing.** `ios` only has `supportsTablet: true`. Android `package` is also missing.
- Icon: **referenced but missing** (`./assets/icon.png`). There is **no `assets/` directory**. Splash is a background colour only (`#0f0f0f`), no splash image. Android adaptive-icon files are also referenced and missing. EAS needs at least the iOS icon.
- `eas.json` exists with generic `development`, `preview`, and `production` (`autoIncrement: true`) profiles. **There is no iOS-specific production profile**, no `image`, no `ascAppId`, no `owner`, and no `extra.eas.projectId`.
- No usage strings. Current code does not use camera, health, or notifications.

### 3. App Store Connect
- **No ASC app exists** for the name CoreForge, or for candidate bundle IDs `com.samayvashsht.coreforge` and `com.coreforge.app`.
- Samay must create the record in the web UI after choosing a bundle ID. `POST /v1/apps` returns 403.

### 4. IAP / paywall
- A **Paywall** screen exists, but it is a static mock.
- **No IAP library at all:** no RevenueCat, no `react-native-purchases`, no expo-iap / StoreKit 2.
- **No product IDs in code.** The CTA button ("Continue with 7-Day Free Trial") has **no `onPress`** and cannot start a purchase.
- Prices are hardcoded in the UI and in `STORE_LISTING.md` / README: **7-day free trial, then $29.99 / year**. That is copy, not a live store price.
- No ASC products exist, because there is no app record.
- Home also does not gate plans: all three 30-day plans open without a purchase. Paywall benefits mention "Video Guides" but there are no videos.

### 5. Completeness
Build blockers: missing bundle ID, missing icon, missing lockfile, no Expo project or ASC record, paywall not wired (the binary can still be built if IAP is deferred, but a Pro purchase cannot be tested).

Product / QA gaps:
- `WorkoutScreen` ignores the `plan`, `custom`, `exercises`, and `duration` params passed from Home and the Generator. It only reads `route.params.exercise` (which no screen passes) and always shows hardcoded **"DAY 7"** and default **Bicycle Crunches**.
- Plans are metadata only (name, description, 30 days). There is no day-by-day workout list.
- The Generator can select exercises, but the workout screen does not use that selection.
- Progress shows **hardcoded placeholder metrics**: 7-day streak, 5/30 days, a pre-filled week, waist `32.5" → 31.2"`, weight `178 → 174 lbs`.
- Email sign-in only writes the email into AsyncStorage. There is no real auth backend.
- Repo description mentions exercise GIFs; none are in this tree (they may live in private `coreforge-exercises`).
- No privacy policy URL in this repo (the older `coreforge` repo has a `PRIVACY.md`; this one does not).
- README says the app is "based on reverse engineering of 'Six Pack in 30 Days'". That may be a review or legal concern; it should not go into the store listing.
- No ads SDKs, no AI wording, no typographic ellipsis characters. The Auth email field uses a normal `placeholder` prop, not placeholder app copy.
- Store listing draft is already in `STORE_LISTING.md` (subtitle: "Core Training That Adapts to You").

### 6. Work to get a TestFlight-installable build
This is **not trivial**. Queue it after Klenzer 25 and Twist 21, same as the women app.

1. Samay confirms the App Store name (CoreForge is fine) and the bundle ID (suggested: `com.samayvashsht.coreforge`).
2. Add `ios.bundleIdentifier` and a 1024×1024 icon at `./assets/icon.png`.
3. Commit a `package-lock.json` generated on Node 22.13+ or 24.3+.
4. Create or extend `eas.json` with an iOS production/internal profile; `eas init` on krosz; set owner and `projectId`.
5. Samay creates the ASC app record in the web UI.
6. Confirm pricing (repo already states $29.99/year with a 7-day trial). Create the subscription in ASC with group localization, a review screenshot, and all-territory availability. Add `expo-iap` (StoreKit 2 only; no RevenueCat) and wire the paywall so the CTA actually starts a purchase and the app grants Pro.
7. The account-level Paid Apps agreement must show **Active** in ASC Business (already the likely cause of missing prices on Playsz, Klenzer, and Twist 21). Signed-but-pending still hides products.
8. Set encryption to false, then EAS iOS build to Internal and Team (Expo) only, labelled **NOT RUN**.
9. Keep the Google Drive backup updated.

Strongly recommended before a useful TestFlight pass, though not strictly required to produce a binary: fix WorkoutScreen so it uses the selected plan or custom list; replace the fake Progress numbers; add a privacy policy URL; drop the "reverse engineering" wording from anything user-facing.

### 7. Decisions for Samay
- **App Store name:** "CoreForge" is already set and is 9 characters. Subtitle draft is "Core Training That Adapts to You" (30 characters exactly). No new name required unless he wants a different one.
- **Bundle ID:** missing. Suggested: `com.samayvashsht.coreforge`.
- **Pricing:** the repo already proposes **$29.99 per year with a 7-day free trial**. He should confirm that before the ASC product is created. There is no monthly plan and no consumable packs in this app.
- **ASC record:** he must create it in the App Store Connect web UI after the bundle ID is agreed. No record exists yet.

### Backup
Private Google Drive folder named exactly **CoreForge** (owner only, Samay's account; not shared):

[private recording link redacted]

Contents: `coreforge-source-ba99ffd-2026-11-12.zip` (git-tracked source only; no `node_modules`, `.git`, or `.env`).

---

## Queue recommendation

Momentum for Women and CoreForge are not quick TestFlight slots. Keep the existing order: **Klenzer 25, then Twist 21**, then the workout builds.

If the goal is the workout app already on expo.dev, start with **45 Days Abs Challenge** (section 3). It is further along (Expo project, bundle ID, and typecheck already work) but it still needs a lockfile, a Node 22 pin in `eas.json`, an icon, and an ASC record Samay creates. It is still not a same-day trivial build, and it does not contain the failed commit `ea2a0c8`.

---

## 3. 45-days-abs-challenge — 45 Days Abs Challenge

GitHub: https://github.com/samayhuf-star/45-days-abs-challenge (public). Cloned to `/workspace/7apps/abs-challenge-45`. Head: `71a3b3b` on `main`, 12 Nov 2026, 8:06 PM Asia/Dhaka (the only app commit; `7f34f2e` at 8:05 PM is a README-only first commit).

This **is** Expo project `@krosz/abs-challenge-45` (id `39a19fc6-2a0f-4fa8-abba-0c4ca5792f4b`). `eas project:info` confirms the link. It is **not** the exact git tree of the failed 11 Nov build (see below).

### 1. Stack
- Expo SDK **58** (declared `~58.0.23`, installed `58.0.24`)
- React Native **0.88.1**, React 19.3.0
- Router: **none**. Single-file `App.tsx` via `index.ts` → `registerRootComponent`. No expo-router, no React Navigation.
- Also uses `@react-native-async-storage/async-storage` `^2.1.0` (installed 2.2.0) and TypeScript `~6.0.3` (installed 6.0.3).
- Node required: Expo 58 engines `^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`; React Native 0.88.1 is the same plus `>= 26.0.0`. **Node 22.13+ or 24.3+.** No `engines` field or `.nvmrc` in the repo. Box Node v24.22.1 is fine.
- Package manager: npm. **No lockfile** in git, so **`npm ci` fails**: "The `npm ci` command can only install with an existing package-lock.json".
- A local `npm install --ignore-scripts` succeeded (456 packages, 3 moderate audit findings, no peer-resolution errors).
- **`npx tsc --noEmit` passes** (exit 0).
- No test script and no test files.
- `package.json` name is still **`abs-challenge-28`**, which does not match the 45-day app name. Cosmetic only; it does not block a build.

### 2. iOS config
- Display name: **45 Days Abs Challenge** (22 characters, under the 30-character App Store limit)
- Version: `1.0.0`. **No `ios.buildNumber`.** Android already has `versionCode` 2 (same as the failed EAS build's `appBuildVersion`).
- `ios.bundleIdentifier`: **present** — `com.momentum.abscore45`. Android package is the same.
- Icon: **referenced but missing.** `app.json` points at `./assets/icon.png`, `./assets/android-icon-foreground.png`, and `./assets/favicon.png`. There is **no `assets/` directory**. Splash is a background colour only (`#0A0E17`), no splash image. An EAS iOS build will fail without the icon.
- `eas.json` exists with generic `development`, `preview`, and `production` (`autoIncrement: true`) profiles. Production has an **Android-only** `buildType: "app-bundle"` block. **There is no iOS-specific production profile**, no `node` pin, no `ascAppId`, and no `expo.owner` (the project is already linked by `extra.eas.projectId`).
- No `ios.infoPlist` usage strings. Current code does not use camera, HealthKit, notifications, or tracking, so none are required for a first TestFlight build.

### 3. App Store Connect
- **No ASC app exists** for `com.momentum.abscore45`, or for the name "45 Days Abs Challenge". Re-checked 12 Nov 2026, about 8:29 PM Asia/Dhaka. The account still has the same 10 apps, none of them this one.
- Samay must create the App Store Connect record in the web UI. `POST /v1/apps` returns 403.

### 4. IAP / paywall
- **No paywall and no IAP library.** No RevenueCat, no `react-native-purchases`, no expo-iap, no product IDs, no prices in code.
- No matching ASC products (no app record).
- No pricing decision is required for a first TestFlight build unless Samay wants a paid tier later.

### 5. Completeness
The app is a single dark-themed home screen with a 45-day calendar, streak/progress, four named phases (Foundation, Build, Intensify, Peak), and a "Mark Complete" button that saves progress in AsyncStorage. That core loop works in code, and typecheck passes.

Gaps that do not have to block a first binary, but do limit QA:
- Only **three unique workouts** are defined (`SAMPLE_WORKOUTS` for days 1, 2, and 12). Every other day falls back to the same generic four-exercise "Core Training" session. This is not a real 45-day progressive plan.
- There is no workout player, timer, or set tracking. "Mark Complete" just ticks the day.
- Copy says "5 workout days + 2 recovery days each week," but there is no recovery-day logic.
- Streak increments on every completion with no calendar-date check, so several days can be marked in one sitting.
- Calendar day cells are not tappable.
- No privacy policy URL, no ads SDKs, no AI wording, no typographic ellipsis characters, no TODO/placeholder lorem text. Phase ranges use an en-dash (`1–10`), which is fine.
- Public GitHub repo (FYI).

### 6. Work to get a TestFlight-installable build
Closer than the other two workout repos, but **not trivial**. Queue after Klenzer 25 and Twist 21 unless Samay wants this one first.

1. Add a 1024×1024 icon at `./assets/icon.png` (required; EAS will fail without it).
2. On Node 22.13+ or 24.3+, run `npm install` and **commit the new `package-lock.json`**.
3. Pin Node in every `eas.json` build profile, for example `"node": "22.14.0"`, so EAS does not use Node 18 again (this is the minimal fix for the failed build; see below).
4. Add an iOS production or internal profile (or reuse `production` for `eas build -p ios`). Set `ITSAppUsesNonExemptEncryption` to false. Optionally set `expo.owner` to `krosz`.
5. Samay creates the ASC app in the web UI for `com.momentum.abscore45` (or a different bundle ID if he wants to change it before the record exists).
6. EAS iOS build, then Internal and Team (Expo) groups only, labelled **NOT RUN** unless a device run actually happens.
7. Keep the Google Drive backup updated after meaningful code changes.

Recommended before a useful QA pass, but not required just to land a binary: write unique workouts for all 45 days (and real recovery days), add a workout timer, fix streak to be date-based, and add a privacy policy URL.

### 7. Decisions for Samay
- **App Store name:** "45 Days Abs Challenge" is already set and is 22 characters. No new name is required unless he wants a different listing name.
- **Bundle ID:** already `com.momentum.abscore45`. He should confirm that, or choose `com.samayvashsht.abs-challenge-45` to match the other apps. Confirm before the ASC record is created; this cannot be changed later.
- **Pricing:** none in the app today. No price to set for TestFlight unless he wants a paywall.
- **ASC record:** he must create it in the App Store Connect web UI. No record exists yet.

### Relation to errored EAS build 351a9351, and the minimal fix

Live EAS record `351a9351-aebf-41b6-9be3-c668cc9cc4f6`, read on 12 Nov 2026, about 8:29 PM Asia/Dhaka, plus its Install dependencies log:

- **Platform was Android**, not iOS. Profile `production`, distribution `STORE`, identifier `com.momentum.abscore45`, version 1.0.0 (2).
- Created and failed on 11 Nov 2026, 11:51 PM Asia/Dhaka (started 11:51:41, finished 11:51:58). Error: `UNKNOWN_ERROR` in the Install dependencies phase.
- Git commit **`ea2a0c8f57528633de9c7a4bc54e6f10ca538498`**, message "Initial commit for 45 Days Abs Challenge". **That commit is not in this GitHub repo.** Today's tree is a new upload of similar config and new `App.tsx` source.
- The `package.json` and `eas.json` that EAS read on 11 Nov are the same as the files in today's repo (name `abs-challenge-28`, Expo `~58.0.23`, RN `0.88.1`, no Node pin, Android-only `buildType` under production).
- Builder image: `ubuntu-22.04-jdk-11-ndk-r21e` with **Node.js 18.18.0** and npm 9.8.1. EAS ran `npm ci --include=dev`.
- **Warn (not the hard fail):** many `EBADENGINE` warnings. React Native 0.88.1 and related packages require `^22.13.0 || ^24.3.0 || >= 26.0.0`; the image had `v18.18.0`.
- **Hard fail:** `npm ERR! code EUSAGE` — "`npm ci` can only install packages when your package.json and package-lock.json … are in sync." Examples: `Invalid: lock file's @babel/core@ does not satisfy @babel/core@7.29.13`, plus many "Missing: … from lock file" lines (`expo-server@58.1.0`, `negotiator`, and others). So the 11 Nov tree **did** have a lockfile, but it was out of date. Today's GitHub repo has **no lockfile at all**, so a rebuild of this tree would fail `npm ci` for a different reason unless a fresh lockfile is committed.

**Minimal fix** so the next EAS build does not repeat 351a9351:

1. On Node 22.13+ or 24.3+, run `npm install` and commit the resulting `package-lock.json` so it stays in sync with `package.json`.
2. Pin Node in `eas.json` build profiles, for example `"node": "22.14.0"`, so the builder is not left on the default image's Node 18.18.0.

Do both. A lockfile alone would still be installed under Node 18 if the image is not pinned, and a Node pin alone would still fail `npm ci` because this repo currently has no lockfile. After that, the next likely failure is the **missing icon**, which was not what stopped 351a9351 (that build never got past install).

### Backup
Private Google Drive folder named exactly **45 Days Abs Challenge** (owner only, Samay's account; not shared):

[private recording link redacted]

Contents: `45-days-abs-challenge-source-71a3b3b-2026-11-12.zip` (git-tracked source only; no `node_modules`, `.git`, or `.env`). A local `package-lock.json` was generated on the box for the install and typecheck only and was not uploaded or committed.
