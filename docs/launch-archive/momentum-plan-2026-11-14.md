# Momentum apps — state and plan to App Review

- Date: 14 Nov 2026, 10:30 AM Asia/Dhaka
- Scope: read-only on App Store Connect and on existing Git remotes. No ASC writes, no force-push, no merge to main, no history rewrite. `samayhuf-star/men-workout` was **not** made public.
- Pricing (confirmed): free download; auto-renewable $2.99/month and $19.99/year, each with a 7-day trial; $39.99 lifetime non-consumable, no trial. Paywall copy: "7 days free, then $2.99/month, cancel anytime", with the store's localised price, and trial wording only when the store reports a trial.
- Product IDs (use these, not the short `momentum_men_*` / `momentum_women_*` names in `PRICING.md`):
  - `com.samayvashsht.momentummen.monthly` / `.yearly` / `.lifetime`
  - `com.samayvashsht.momentumwomen.monthly` / `.yearly` / `.lifetime`
- Roles: this bot owns code through launch; dev 3 coordinates and tests; dev 1 does ASC writes; Samay creates the ASC app records (none exist yet). Bundle IDs are already on the team: men `com.samayvashsht.momentummen` (G7H2PS26GM), women `com.samayvashsht.momentumwomen` (Y83667KDMM).

## Visibility decision (do not flip men-workout to public)

Samay approved making `samayhuf-star/men-workout` public only after a full-history secret scan and a GIF source/licence check, and only if both were clean. **The repo stays private.** Deleting files at HEAD would not remove them from history. History was not rewritten and nothing was force-pushed.

### Secret scan (men-workout, all branches)

Only `main` / `origin/main` exists (160 commits, tip `36ce7f7`, 14 Nov 2026, 10:19 AM Asia/Dhaka, "Document lifetime pricing as differentiator"). No tags. No `.gitignore` or `package-lock.json` on origin.

- Filenames in history: no `.p8`, `.p12`, `.pem`, `.key`, `.env`, `google-services.json`, `GoogleService-Info.plist`, keystores, or EAS credential files. The only name hit was `eas.json`, and every version of it is a bare profile file with no tokens.
- Content grep across all 160 commits: no private-key blocks, Expo/ASC/GitHub/Slack tokens, or `EXPO_TOKEN` / `ASC_` material.
- gitleaks 8.24.3: no leaks. It reported 23 commits / ~60 KB because it skipped the binary-only GIF commits (there are 23 non-GIF commits on `origin/main`).
- trufflehog 3.88.29 on `origin/main` (`36ce7f7`): 0 verified, 0 unverified.

**Secrets: clean.** This alone would have allowed a public flip. The GIFs block it.

### GIF source and licence (blocking)

Both apps pulled form GIFs from [JahelCuadrado/ExerciseGymGifsDB](https://github.com/JahelCuadrado/ExerciseGymGifsDB). Men's history says so in `ede575c` ("Add exercise GIF URLs from public ExerciseGymGifsDB", base `https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/abs/`). Women's history has the same base URL in earlier `data/exercises.ts` commits, then local files.

That repository has **no licence** (`license: null`). Its README states the GIFs were collected from the internet, the author does **not** own copyright and **cannot grant rights to third parties**, and "the GIFs belong to their respective authors."

Hash checks (SHA-256 exact matches against `raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/...`):

- Men `assets/gifs/air-bike.gif` = DB `abs/air-bike.gif`
- Men `barbell-bench-press.gif` = DB `pectorals/barbell-bench-press.gif`
- Men `barbell-deadlift.gif` = DB `glutes/barbell-deadlift.gif`
- Men `band-v-up.gif` = DB `abs/band-v-up.gif`
- Women `assets/gifs/air-bike.gif` = the same DB `abs/air-bike.gif`

File counts at HEAD:

| Repo | GIF files | Real binaries | Stubs (`404: Not Found`, 14 bytes) |
|---|---|---|---|
| men-workout (private) | 137 | 135 | 2 (`dumbbell-curl.gif`, `band-triceps-pushdown.gif`) |
| women-workout (**already public**) | 29 | 21 | 8 (including `dumbbell-curl.gif`, `band-v-up.gif`, `barbell-thruster.gif`, several band GIFs) |

Women also references four GIF filenames that are not in the repo at all (`band-close-grip-pulldown.gif`, `band-reverse-fly.gif`, `band-side-triceps-extension.gif`, `dumbbell-incline-bench-press.gif`). Those `require()` calls will fail a bundle.

**GIFs are not original and are not licensed for redistribution.** They remain in git history, so the men repo must not be made public.

### Options (no history rewrite)

1. **Recommended:** keep `samayhuf-star/men-workout` private. Create a **new public repo** (for example `samayhuf-star/momentum-men`) with a clean history: current code minus third-party GIFs (and minus the 14-byte stubs), plus the iOS work on a feature branch. Point sim-qa at that public repo. Leave the private repo as the archive.
2. Replace every GIF with original or properly licensed media, then still use a **fresh public repo**. Putting new files on the existing `main` does not remove the old binaries from history, so a flip of this repo would still publish them.
3. Do not use ExerciseGymGifsDB at runtime either. Hot-linking is the same rights problem.

**Women-workout is already public** on `main` @ `e822015` with 21 real copies of the same unlicensed GIFs (and 8 stubs) in history. This plan does not change that repo's visibility. Flag for COO / Samay: take it private, or publish a clean replacement repo, and do not ship those GIFs in the App Store build (content rights).

App Review content rights is the same issue even if a repo stays private. v1 should ship **without** these third-party GIFs (text form cues and/or original stills). Original licensed motion media can come later.

---

## State table

Two separate repos, not one codebase with variants. Different Expo SDKs. Local clones under `/workspace/7apps/men-workout` and `/workspace/7apps/women-workout` are **behind** `origin/main` (stuck at 12 Nov commits `ba99ffd` / `cc36db3`). Use `origin/main` below. There are no Momentum entries in dev 3's QA checklist and no tester verdicts.

| | Momentum – Men's Workout | Momentum – Women's Workout |
|---|---|---|
| Store name (in `app.json`) | Momentum – Men's Workout (24 chars) | Momentum – Women's Workout (26 chars) |
| Repo | [samayhuf-star/men-workout](https://github.com/samayhuf-star/men-workout) **private** | [samayhuf-star/women-workout](https://github.com/samayhuf-star/women-workout) **public** |
| Branch / tip | `main` @ `36ce7f7` (10:19 AM Asia/Dhaka, 14 Nov) | `main` @ `e822015` (10:19 AM Asia/Dhaka, 14 Nov) |
| Bundle ID | `com.samayvashsht.momentummen` (G7H2PS26GM) | `com.samayvashsht.momentumwomen` (Y83667KDMM) |
| ASC app record | None (Samay will create) | None (Samay will create) |
| Expo | SDK **58** (`expo ~58.0.23`), RN 0.88.1, React 19.3.0, React Navigation | SDK **52** (`expo ~52.0.0`), RN 0.76.0, React 18.3.1, expo-router ~4 |
| Expo project / `projectId` / owner | Missing | Missing |
| `eas.json` | Present, bare (no Node pin, no encryption flag, no `ascAppId`) | Present, same gaps (added 14 Nov) |
| `ios.buildNumber` / lockfile / `.gitignore` | Missing / missing / missing | Missing / missing / missing |
| Icon / splash | `assets/icon.png` 1024x1024 RGB, no alpha; `splash.png` 1284x1913 RGB. Android adaptive icons referenced in men `app.json` are **not** in the tree. | Same sizes, RGB, no alpha. Adaptive icon path referenced, file not in the tree. |
| `supportsTablet` | true (iPad screenshot set required unless set false) | true (same) |
| Exercise library | **60** exercises (15 each chest, back, shoulders, core). No legs/arms group in the data, despite leftover leg GIFs. All 60 point at local GIFs. | **50** exercises (not 34; a later commit expanded past 34). Categories: Lower Body, Upper Body, Core, Full Body, Pilates, Mobility. 29 GIF files, 4 missing requires, many reused/mismatched GIFs, 1 `cycleNote`. |
| Today / home | Home = plan picker. UI logo still says **CoreForge**. | Today screen exists but Start and quick actions have **no navigation**. Stats are hardcoded **12 / 4 / 180** (placeholder). Plans screen is title + "Cycle-aware training programs" only. |
| Paywall | UI only. Prices hardcoded. CTA Alert, no StoreKit. Lifetime still uses the "Start free trial" alert title. No Restore, no terms/privacy, no store-loaded prices, no entitlement gate (Generator and all plans stay available). | Same pattern in `app/paywall.tsx`. Benefits mention a "Custom generator" the women app does not have. |
| `expo-iap` / `.storekit` | **None.** `package.json` has no IAP library. `IAP_SETUP.md` wrongly suggests `react-native-purchases` (RevenueCat), which is forbidden. | Same. |
| HealthKit | `react-native-health` plugin and Info.plist strings are in `app.json`, but the package is **not** in `package.json`. `healthSync.js` is never called. Default `energyBurned = 200` would be a made-up calorie figure if wired. | Same (`energyBurned = 180`). Prebuild will fail until the plugin or the package is fixed. |
| Auth | Guest plus a local "Continue with Email" that only writes to AsyncStorage (no backend, no account deletion). Auth and Home still say **CoreForge**. | Guest only, but login still says "Sign in later to save progress" (no sign-in exists) and "Personalized workouts that adapt to your cycle" (plans are empty). Layout references an `onboarding` screen that is not in the tree. |
| Legal URLs in app / site | None. No Momentum pages under `samayhuf-star.github.io/app-legal/`. | None. |
| Privacy label (intended) | **Data Not Collected** only if HealthKit is removed from the binary and nothing leaves the device (AsyncStorage + StoreKit). | Same. |
| AI / ellipsis in UI | No AI wording in the app UI. No U+2026 ellipsis. README still describes a "reverse engineering" of a competitor; that must not appear in UI, listing, or review notes. | No AI wording, no U+2026. Cycle-aware marketing is still in login, plans, README, and one exercise note. |
| Sim QA / TestFlight / listing | No sim run, no checklist, no TestFlight, no listing, no IAP products. | Same. Men is also ineligible for `AI-Samay/sim-qa-runner` `sim-qa.yml` until there is a **public** target repo (the workflow refuses private repos). Local iOS build can use `CHECKOUT_TOKEN` for a private repo, account `krosz`. |

---

## Plan to App Review

Work on feature branches only (suggested: `momentum/ios`). Do not merge to main and do not force-push. Builds: `AI-Samay/sim-qa-runner` workflow **iOS Local Build (free, eas --local)**, `expo_account: krosz`. Never EAS cloud. Sim QA: workflow `sim-qa.yml`, public repo only. $0 spend. StoreKit 2 via **expo-iap** only.

### 0. Decisions needed now (blocks the public men mirror and honest content rights)

- Approve v1 **without** ExerciseGymGifsDB GIFs (text form cues / original stills).
- Approve a **new public men repo** with clean history for sim QA (option 1 above).
- Decide what to do about **women-workout already being public** with 21 of the same GIFs.
- Set `supportsTablet: false` for v1 (recommended, avoids an iPad screenshot set) or commit to iPad shots.
- Samay creates both ASC app records in the web UI as soon as possible (name, bundle ID, SKU). API app-create has previously returned 403.

### 1. Code gaps (both apps), 10:30 AM – 4:00 PM Asia/Dhaka

- Strip third-party GIFs (and 14-byte stubs) from the feature branch. Replace dynamic `require(\`...${name}\`)` on men (Metro will not bundle that reliably) with text cues or a static map of **original** assets only.
- Women: remove the four missing `require()`s; wire or remove Today Start / quick actions; replace hardcoded 12/4/180 with real progress (or zeros); build a real Plans screen or drop "cycle-aware" copy; remove "Sign in later to save progress"; drop the missing `onboarding` route; fix guest-only wording.
- Men: rename remaining **CoreForge** strings (Auth, Home, `package.json`, README, `STORE_LISTING.md`). Make auth guest-only, or clearly local and without an "account", so Guideline 5.1.1 account deletion does not apply.
- Remove HealthKit for v1: drop the `react-native-health` plugin, plist keys, and `healthSync` files so prebuild works and App Privacy can stay Data Not Collected. Do not write guessed calorie values to Apple Health.
- Implement a soft paywall with **expo-iap** (StoreKit 2), a `.storekit` file for local/sim, store-loaded prices, Restore, terms + privacy links, auto-renew disclosure, trial text only when the store reports a trial, lifetime **without** trial wording, and a real entitlement gate (define Free vs Pro and enforce it). Rewrite `IAP_SETUP.md` so it never mentions RevenueCat. Align product IDs with the long identifiers above. Copy target: "7 days free, then $2.99/month, cancel anytime" (localised store price in the running app).
- Legal links, `ITSAppUsesNonExemptEncryption: false`, `ios.buildNumber`, Expo `owner` + `projectId` (create `@krosz/momentum-men` and `@krosz/momentum-women`), production profile usable with `eas build --local`, Node pin, `package-lock.json`, `.gitignore`.
- Strip competitor / medical / cycle-diagnosis wording from UI and repo docs. No ellipsis characters in UI. No AI mentions.
- Icons are already 1024x1024 RGB without alpha. Keep it that way.

### 2. Legal pages, overlap 3:30 – 4:30 PM

Add Momentum men/women privacy, terms, and support pages on `samayhuf-star.github.io/app-legal/`, same pattern as Playsz/ClearScan: grievance officer **Samay Vashsht**, contact **samayhuf@gmail.com only**, no phone on the legal pages. State that workout data and purchases stay on-device / with Apple, and that the app is not medical advice.

Intended URLs:

- https://samayhuf-star.github.io/app-legal/momentum-men/privacy.html
- https://samayhuf-star.github.io/app-legal/momentum-men/terms.html
- https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html
- https://samayhuf-star.github.io/app-legal/momentum-women/terms.html

### 3. Public men mirror + sim QA, 4:00 – 8:00 PM

- Publish the clean men tree (no third-party GIFs) to the new public repo; run women QA from a feature branch that also has the GIFs removed (history on women's `main` remains a separate cleanup decision).
- Add `qa/sim-qa/flow.sh` (and prepare script if needed) covering: launch, guest continue, home/Today, start a workout, paywall (store prices / `.storekit` trial copy, close control), Restore, progress. 4–5 **main** screens only for later listing shots (never permission, settings, or restore as listing art).
- Trigger `AI-Samay/sim-qa-runner` `sim-qa.yml` on the public repo + feature branch, free macOS runner, `$0`. Budget ~75–100 minutes each, sequential. Hand the artifact and commit SHA to dev 3. No store submit without a real run and a QA PASS.

### 4. Listing / ASO drafts (ready now for dev 1)

Paste-ready metadata is in `reports/review-notes/momentum-asc-metadata-for-dev1.md`. Category: Health & Fitness. Copyright: 2026 Samay Vashsht. No AI, no medical or slimming claims, no competitor names. Review notes drafts: `reports/review-notes/momentum-men.txt` and `momentum-women.txt` (do not paste into ASC until the paywall and media decisions are in the binary).

### 5. ASC writes (dev 1), once Samay has created the app records — can start mid-afternoon if the records exist

- App information: name, subtitle, privacy policy URL, subtitle/category, age rating (likely 4+ if no HealthKit and no user-generated content), content rights (no third-party GIFs in the build), encryption, Data Not Collected (re-check after HealthKit is removed).
- Pricing: free download, availability.
- Subscription group + the three products per app, US prices as confirmed, 7-day introductory offers on monthly and yearly only, lifetime as a non-consumable with no trial. Wait until products are Ready to Submit before asking for App Review.
- Version 1.0 metadata, keywords, description, promo text, 4–5 main-screen screenshots from the sim run (iPhone 6.7" / 6.5"; iPad only if `supportsTablet` stays true), review contact, review notes, demo account "not required" (guest).
- This bot will not write to ASC.

### 6. Local build + TestFlight, 8:00 PM – 12:30 AM Asia/Dhaka (15 Nov) if step 0–5 hold

- `eas build --local` via **iOS Local Build (free, eas --local)**, `expo_account: krosz`, feature-branch ref, `upload=true` only after signing and the ASC record exist. ~60–90 minutes per app, sequential on the free runner. No EAS cloud.
- Internal testing (`hasAccessToAllBuilds` if the usual group exists) and Family & Friends external group after the build is processed. Beta App Review if required. No App Review submission until dev 3 PASSes.

### 7. Submit to App Review

Target: **READY TO SUBMIT around 12:30–1:00 AM Asia/Dhaka on 15 Nov**, if Samay creates the app records today, the GIF-strip is approved, sim QA passes, and IAP products are ready. If any of those slip, submit on the morning of 15 Nov. Do not submit with unlicensed GIFs, a fake paywall, CoreForge leftovers, or placeholder Today stats.

---

## ETA summary (clock starts 10:25 AM Asia/Dhaka, 14 Nov 2026)

| Step | Window (Asia/Dhaka) |
|---|---|
| This inventory, secret/GIF verdict, drafts for dev 1 | 10:25–10:40 AM (done) |
| Samay: ASC records + GIF/mirror decisions | As soon as possible; needed before upload |
| Feature-branch code (both apps) + legal pages | 10:40 AM – 4:30 PM |
| Clean public men mirror | 4:00–4:30 PM |
| Sim QA (women, then men), screenshots | 4:30–8:00 PM |
| dev 1 metadata + IAP (parallel once records exist) | 3:00 PM onward |
| Local IPA builds + TestFlight processing | 8:00 PM – 12:30 AM (15 Nov) |
| App Review submit (after QA PASS) | ~12:30–1:00 AM 15 Nov optimistic; otherwise 15 Nov morning |

45 Days Abs Challenge (`samayhuf-star/45-days-abs-challenge`) is a separate app and is not in this launch pair.
