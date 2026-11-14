# App Store screenshots (iPhone 6.9")

Draft set for Momentum – Women's Workout. Do not upload until Samay accepts this set. These are not a substitute for a device pass of safe areas or StoreKit (see `docs/store/qa-checklist-build1.md`).

Pixel size for every file: **1290 × 2796** (portrait, the 6.9" slot). No caption band: the whole frame is the app screen.

| File | Screen | What it shows |
| --- | --- | --- |
| `ios-6.9/01-home.png` | Today | Beginner Strength, Start, on-device stats (1 workout, 1 streak), quick actions, Unlock Pro |
| `ios-6.9/02-workout.png` | Workout player | Beginner session, exercise 1 of 6, Goblet Squat still, form cue, timer at 00:40 |
| `ios-6.9/03-exercise-detail.png` | Exercise detail | Push-Up opened from the library (1 of 1), still, form cue, timer |
| `ios-6.9/04-progress.png` | Progress | Day streak 1, workouts 1, Saturday marked, recent day "Nov 14" |
| `ios-6.9/05-plans.png` | Plans | Beginner Strength (free), Full Body · Pro, Upper Body · Pro |

Not included, on purpose: permission prompts, Profile, Credits, the paywall, and Restore.

## How they were made

Captured 14 Nov 2026 on Linux. There is no iOS Simulator here, so the screens are the real React Native screens running under Expo web.

1. `npm ci`, then `npx tsc --noEmit` (exit 0).
2. `npx expo start --web --port 8081` (Expo SDK 58, Metro).
3. Headless Chrome, viewport 430 × 932 CSS pixels at `deviceScaleFactor` 3, which is 1290 × 2796.
4. Continue as Guest, then drive the same controls the app ships (`continue-as-guest`, `start-workout`, `close-workout`, and the Plans / Workouts / Progress tabs).
5. Finish the beginner session so Today and Progress show the values `completeWorkout` wrote (`@momentum_women_progress`: streak 1, total 1, day `2026-11-14`). That date is the UTC day the session was finished. The week row highlights Saturday because 14 Nov 2026 is a Saturday.
6. On the workout shot, the capture waited until the in-app crossfade had moved to the end pose of Goblet Squat.

The stills are the files the app already requires. Goblet Squat and Push-Up are Open Exercise Illustrations (CC0 1.0), from the pin in `assets/exercise-media/LICENSE-SOURCES.md`. No stock art and no generated imagery.

The one CC BY-SA 4.0 still that ships is Pilates Hundred (`pilates-hundred-hold.jpg`, Helisusa, Wikimedia Commons). It is credited on the Credits screen and is not in this set.

`04-progress.png` was recaptured from the build 2 date formatting (`formatProgressDay`: short month, numeric day, year only when it is not the current year). The other four frames were left as they were. The tab bar already uses Ionicons, and build 2 does not change those icons, so frames that only show the tab bar were not regenerated.

## Web-only limits

- `react-native-web` is not a dependency of this repo. It was installed in the local `node_modules` for this capture and was not committed.
- `expo-iap` has no web native module. The dev client showed "Cannot find native module 'ExpoIap'". That overlay was removed in the browser before each shot. It is a web limitation. The iOS binary uses StoreKit.
- Web safe-area insets are 0, so these frames have no iOS status bar or home indicator. On a phone the same screens sit below the status bar (`SafeAreaView` is already in the screens).
- `Alert.alert` in react-native-web is a no-op, so the "Workout complete" alert did not appear and the player did not dismiss itself. Progress was still saved. The player was closed with the app's Close control.
