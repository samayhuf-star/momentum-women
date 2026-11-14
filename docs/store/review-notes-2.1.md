# Guideline 2.1 notes — Momentum – Women's Workout (build 1)

Draft for the App Review notes field. Do not paste until the binary under review is iOS build 1 (`ios.buildNumber` 1, app commit `1e48e20`). No account password is required.

## 1. What the app is

Momentum – Women's Workout is a training app for guided sessions on iPhone. A session uses a timer or a rep counter, and each move has a short form cue and a still. It is a general training tool. It does not diagnose, treat, or prevent any condition, and it does not give medical, diet, or weight-loss advice. Download is free (US $0.00).

## 2. How to move through the app

No account and no login. There is no email field, no password, and no demo account.

1. Launch the app. On first open, tap **Continue as Guest**. Progress stays on the device. There is no later sign-in.
2. **Today** shows Beginner Strength and the on-device workout count and streak (both 0 until a session is finished). Tap **Start** to open that session.
3. The workout player shows the move name, a form cue, and a still. **Timer** and **Reps** switch the counter. **NEXT** goes to the next move. **FINISH** on the last move saves the session on the device. **Close** leaves the player without that save.
4. **Plans** lists Beginner Strength (free), Full Body, and Upper Body. The two paid plans are labeled **Pro**.
5. **Workouts** is the exercise library. Tap a row to open that move in the same player.
6. **Progress** shows the streak, the workout count, the current week, and recent days. Those numbers come from sessions finished on this device.
7. **Profile** shows Guest mode. **Log Out** only clears the on-device guest flag and returns to Continue as Guest. It is not an account, and there is nothing to delete under an account.

## 3. Where the paywall and Restore are

The app is not a hard paywall. Beginner Strength, the workout player, the library, and Progress stay available without a purchase.

Open the paywall from any of these:

- **Unlock Pro** on Today
- **Unlock Momentum Pro** on Profile
- **Full Body** or **Upper Body** on Plans, while Pro is not active

The paywall has a **Close** control at the top. Offers load from StoreKit. **Restore purchases** is on the paywall, under the offers. Terms, Privacy, and the Apple standard EULA are links at the bottom of the paywall.

## 4. Products

Sold only through Apple In-App Purchase (StoreKit 2). US prices:

- `com.samayvashsht.momentumwomen.monthly` — $2.99 per month, 7-day free trial for an eligible new subscriber
- `com.samayvashsht.momentumwomen.yearly` — $19.99 per year, 7-day free trial for an eligible new subscriber
- `com.samayvashsht.momentumwomen.lifetime` — $39.99 one-time, no trial

After a trial, the subscription starts unless it is cancelled at least 24 hours before the trial ends. Lifetime does not renew. The price on screen is the storefront price. When the store reports a trial, the subscription line includes the trial. Lifetime never shows a trial.

Pro unlocks the Full Body and Upper Body plans. It does not lock the beginner session or the library.

## 5. What leaves the device

Purchases go through Apple. Workout history is stored on the device and is not uploaded to a server of ours. There is no account service of ours. Privacy and Terms open in the browser. This version does not read or write Apple Health.

Privacy: https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html

Terms: https://samayhuf-star.github.io/app-legal/momentum-women/terms.html

Support: https://samayhuf-star.github.io/app-legal/momentum-women/support.html

Contact: Samay Vashsht, samayhuf@gmail.com.
