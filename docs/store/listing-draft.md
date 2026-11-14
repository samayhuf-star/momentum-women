# Listing draft — Momentum – Women's Workout

Draft for App Store Connect. Do not paste from this file by hand if App Publisher Bot is loading `docs/store/asc-fields.json`. No App Store Connect writes were made.

Checked 14 Nov 2026. Character counts are JavaScript string lengths. The en dash in the name is one character.

## Identity

| Field | Value | Length |
| --- | --- | --- |
| Name | Momentum – Women's Workout | 26 (limit 30) |
| Bundle ID | `com.samayvashsht.momentumwomen` | |
| ASC app | `6834676214` in `eas.json`. This draft does not change it. | |
| Subtitle | Home and gym workout plans | 26 (limit 30) |
| Primary category | Health & Fitness | |
| Secondary category | Lifestyle | |
| Copyright | 2026 Samay Vashsht | |
| Age rating | 4+ | |

`ios.buildNumber` is 2. `ios.supportsTablet` is false.

## Promo text

Limit 170. This draft is 153 characters.

Guided sessions for home or the gym, with a timer or a rep counter and form cues. The beginner plan is free. Pro adds the Full Body and Upper Body plans.

## Description

Momentum – Women's Workout is a training app for guided sessions on iPhone, at home or in the gym.

Today opens on the next session, with the length and the exercise count, and a week view of workouts saved on this iPhone. Each move has a short form cue and a still. Train with a timer or a rep counter, and see the next move before you continue.

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

Checked with `curl -L` on 14 Nov 2026.

| Role | URL | Status |
| --- | --- | --- |
| Privacy policy | https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html | 200 |
| Support | https://samayhuf-star.github.io/app-legal/momentum-women/support.html | 200 |
| Terms | https://samayhuf-star.github.io/app-legal/momentum-women/terms.html | 200 |
| Marketing | Same as support. No separate marketing page is published (`/momentum-women/` returned 404). | 200 |

## What's New (1.0)

First release. Today view, guided workouts with a timer or reps, on-device progress, and optional Momentum Pro.

## Pricing

Free download. Then $2.99 a month or $19.99 a year, each with a 7-day free trial, or $39.99 lifetime with no trial.

| Product | ID | StoreKit file |
| --- | --- | --- |
| Monthly | `com.samayvashsht.momentumwomen.monthly` | $2.99, P1M, free intro P1W |
| Yearly | `com.samayvashsht.momentumwomen.yearly` | $19.99, P1Y, free intro P1W |
| Lifetime | `com.samayvashsht.momentumwomen.lifetime` | $39.99 non-consumable, no intro |

The paywall shows the store price. It does not hardcode the dollar amount. Trial wording is added only when the store reports a trial. Lifetime never shows a trial.

## Screenshots

- 6.9 inch, 1290 × 2796: `docs/store/screenshots/ios-6.9/`
- 6.5 inch, 1284 × 2778: `docs/store/screenshots/ios-6.5/`
- IAP review, 1290 × 2796: `docs/store/screenshots/iap-review/`

See `docs/store/screenshots/README.md`.
