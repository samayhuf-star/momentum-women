# Guideline 2.1 notes — Momentum – Women's Workout (build 2)

Draft for App Review. The binary to review is the one with `ios.buildNumber` 2 and `supportsTablet` false. No account password is required. Do not paste until that binary is the one under review.

## 1. What the app is

Momentum – Women's Workout is a training app for guided sessions on iPhone. A session uses a timer or a rep counter. Each move has a short form cue and a still. It is a general training tool. It does not diagnose, treat, or prevent any condition, and it does not give medical, diet, or weight-loss advice. Download is free (US $0.00).

## 2. How to move through the app

No account and no login. There is no email field, no password, and no demo account.

1. Launch the app. On first open, tap **Continue as Guest**. Progress stays on the device.
2. **Today** shows a Day card for Beginner Strength, with the length and the exercise count. **Start** is the main button. Under it are this week and the last 30 days, from sessions finished on this iPhone.
3. **Pro** is the small pill at the top of Today. It opens the paywall. It is not required to start the beginner session.
4. **Plans** lists Beginner Strength (free, one session), Full Body, and Upper Body. The two paid plans show a Pro badge. Tapping a locked plan opens the paywall. Tapping the free plan opens the workout.
5. **Workouts** is the exercise library. Tap a row to open that move.
6. The workout player shows "Exercise X of Y", time left in the session, a progress bar, the form cue, the still, and the next move. **Start** and **Pause** are the large control. **Previous** and **Next** sit beside it. **Finish** on the last move saves the session on the device. **Close** leaves without that save.
7. **Progress** shows the day streak, workout count, minutes from finished sessions, this week, and recent dates. The line under the title is "Track your strength and consistency".
8. **Profile** shows Guest mode. **Log Out** only clears the on-device guest flag and returns to Continue as Guest. It is not an account.

## 3. Where the paywall and Restore are

The app is not a hard paywall. Beginner Strength, the workout player, the library, and Progress stay available without a purchase.

Open the paywall from any of these:

- The **Pro** pill on Today
- **Unlock Momentum Pro** on Profile
- **Full Body** or **Upper Body** on Plans, while Pro is not active

The paywall has **Close**. Offers load from StoreKit. **Restore purchases** is under the offers. **Terms**, **Privacy**, and the Apple standard EULA are links at the bottom.

## 4. Products

Sold only through Apple In-App Purchase (StoreKit 2). US prices:

- `com.samayvashsht.momentumwomen.monthly` — $2.99 per month, 7-day free trial for an eligible new subscriber. Display name: Momentum Women Monthly.
- `com.samayvashsht.momentumwomen.yearly` — $19.99 per year, 7-day free trial for an eligible new subscriber. Display name: Momentum Women Yearly.
- `com.samayvashsht.momentumwomen.lifetime` — $39.99 one-time, no trial. Display name: Momentum Women Lifetime.

After a trial, the subscription starts unless it is cancelled at least 24 hours before the trial ends. Lifetime does not renew. The price on screen is the storefront price. When the store reports a trial, the subscription line includes the trial. Lifetime never shows a trial.

Pro unlocks the Full Body and Upper Body plans.

Review images of this paywall, with those US prices filled in for a machine that cannot load StoreKit, are in `docs/store/screenshots/iap-review/`.

## 5. What leaves the device

Purchases go through Apple. Workout history is stored on the device and is not uploaded to a server of ours. There is no account service of ours. Privacy and Terms open in the browser. This version does not read or write Apple Health.

Privacy: https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html

Terms: https://samayhuf-star.github.io/app-legal/momentum-women/terms.html

Support: https://samayhuf-star.github.io/app-legal/momentum-women/support.html

Contact: Samay Vashsht, samayhuf@gmail.com.
