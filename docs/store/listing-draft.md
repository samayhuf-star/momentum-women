# Listing draft — Momentum – Women's Workout

Draft for App Store Connect. Do not paste yet. No App Store Connect writes were made for this draft.

Checked 14 Nov 2026. Character counts are JavaScript string lengths (the en dash in the name counts as one character).

## Identity

| Field | Value | Length |
| --- | --- | --- |
| Name | Momentum – Women's Workout | 26 (limit 30) |
| Bundle ID | `com.samayvashsht.momentumwomen` | |
| SKU / ASC | Already on the team. `eas.json` records `ascAppId` `6834676214`. This draft does not change it. | |
| Subtitle | Home and gym workout plans | 26 (limit 30) |
| Primary category | Health & Fitness | |
| Secondary category (optional) | Lifestyle | |
| Copyright | 2026 Samay Vashsht | |
| Age rating to confirm | 4+. No unrestricted web content, no user-generated content, no HealthKit in this version. | |

## Promo text

Limit 170. This draft is 153 characters.

Guided sessions for home or the gym, with a timer or a rep counter and form cues. The beginner plan is free. Pro adds the Full Body and Upper Body plans.

## Description

Momentum – Women's Workout is a training app for guided sessions on iPhone, at home or in the gym.

Open Today for the beginner session, or browse the exercise library. Each move has a short form cue and a still. Train with a timer or a rep counter. Your streak and completed workouts stay on this iPhone.

The beginner plan, the workout player, the library, and progress are free. Momentum Pro adds the Full Body and Upper Body plans.

Download is free. Momentum Pro is optional:

- $2.99 per month, with a 7-day free trial
- $19.99 per year, with a 7-day free trial
- $39.99 for lifetime access, a one-time purchase with no trial

Prices in the app are the App Store price for your storefront. Cancel a subscription at least 24 hours before the trial or the period ends if you do not want it to renew. Manage or cancel in your Apple ID settings.

The app is a general training tool. It does not offer medical, diet, or weight-loss advice.

## Keywords

Limit 100. Comma-separated, no spaces. This draft is 67 characters. The name already contains Momentum, Women, and Workout, so those words are left out.

```
fitness,gym,training,exercise,strength,timer,reps,home,plans,glutes
```

## URLs

Checked with `curl -sS -o /dev/null -w "%{http_code}" -L` on 14 Nov 2026. Each returned **200**.

| Role | URL | Status |
| --- | --- | --- |
| Privacy policy | https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html | 200 |
| Support | https://samayhuf-star.github.io/app-legal/momentum-women/support.html | 200 |
| Terms (also linked in the app) | https://samayhuf-star.github.io/app-legal/momentum-women/terms.html | 200 |

The same privacy, terms, and support URLs are in `app/credits.tsx`. The paywall links terms, privacy, and the Apple standard EULA (`https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`, also 200).

## What's New (1.0)

First release. Today view, guided workouts with a timer or reps, on-device progress, and optional Momentum Pro.

## Pricing check (no code change)

Locked price: free download, 7-day free trial, then $2.99 a month, $19.99 a year, or $39.99 lifetime.

| Product | ID in `lib/pro.ts` and `qa/MomentumWomen.storekit` | StoreKit config |
| --- | --- | --- |
| Monthly | `com.samayvashsht.momentumwomen.monthly` | $2.99, period P1M, introductory offer free for P1W |
| Yearly | `com.samayvashsht.momentumwomen.yearly` | $19.99, period P1Y, introductory offer free for P1W |
| Lifetime | `com.samayvashsht.momentumwomen.lifetime` | $39.99 non-consumable, no introductory offer |

No mismatch. The paywall does not hardcode dollar amounts. It shows the store `displayPrice`. Trial wording is added only when the store reports an eligible trial. Lifetime never gets trial wording (`lib/introOffer.ts`).

One copy detail, not a price mismatch: `ctaText` says "7 days free" whenever `trialDays` is greater than 0, while `planLine` uses the day count the store returns. The StoreKit file's intro offer is one week, so both lines say 7 days. If the App Store intro offer were ever a different length, the button line would still say 7. Pricing logic was not changed.

## Screenshots

Five frames at 1290 × 2796 in `docs/store/screenshots/ios-6.9/`. See `docs/store/screenshots/README.md`.

`ios.supportsTablet` is still `true` in `app.json`. This set is iPhone 6.9" only. An iPad set is still required unless tablet support is turned off before submission. That choice is Samay's. This draft does not change `app.json`.
