# MindMosaic

MindMosaic is an accessible, adaptive cognitive training app crafted for older adults. Built with Expo + React Native + TypeScript, it delivers gentle daily exercises that respond to the user's progress while respecting privacy and accessibility.

## ✨ Features
- **Adaptive daily plan** balancing attention, memory, language, executive function, and processing speed tasks.
- **Accessible experience** featuring dynamic type, high-contrast palette, large controls, and voice guidance.
- **Offline-first** storage using AsyncStorage with optional local exports (CSV / text summary).
- **Reminders & voice** support through Expo Notifications and Speech APIs.
- **Internationalisation-ready** with English and Spanish scaffolding via `react-i18next`.
- **Clean architecture** with modular activities, adaptive engine, services, and Zustand-powered state.

## 🏗️ Project Structure
```
app/
 ├─ screens/        # Onboarding, Home, Activity, Results, Settings, Reports
 ├─ components/     # Reusable UI elements (LargeButton, ProgressRing, etc.)
 ├─ activities/     # Activity specs + interactive runners
 ├─ adaptive/       # Adaptive engine + daily plan scheduler
 ├─ state/          # Zustand stores for profile, session, scores, settings
 ├─ services/       # Storage, i18n, speech/notifications, export helpers
 ├─ a11y/           # Accessibility helpers
 ├─ theme/          # Tokens and initialisation
 └─ tests/          # Unit and e2e scaffolding
```

## 🚀 Getting Started
```bash
npm install
npm run start
```
Launch the Expo dev server and follow on-screen instructions to open the app on iOS, Android, or web.

### Running on devices
- **iOS (simulator)**: `npm run ios`
- **Android (emulator)**: `npm run android`

## ✅ Quality
- **Unit tests**: `npm test`
- **Type checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Detox e2e (Android example)**:
  ```bash
  npm run e2e:build
  npm run e2e:test
  ```

## 🧠 Adding a New Activity
1. Create a file in `app/activities/` that exports an `ActivitySpec`.
2. Implement the required metadata, difficulty levels, `run`, and `evaluate` functions.
3. Register the activity in `app/activities/registry.ts`.
4. Ensure the activity reports outcomes via the provided `ActivityRunner` to feed the adaptive engine.

## 🔄 Adaptive Engine
The adaptive engine keeps per-domain scores (baseline `100`). After each activity:
```
expected = clamp(result.score - |errorRate - targetError|)
delta    = K * (result.score - expected)
newScore = clamp(oldScore + delta, 0, 200)
```
The next difficulty level is adjusted using a thresholded comparison of the actual score versus expectation.

![Adaptive flow](docs/adaptive-flow.png)

*(Diagram placeholder – replace with your preferred visual when documenting further.)*

## ♿ Accessibility Checklist
- Text scales with OS settings up to 200%.
- Tap targets ≥ 48pt with generous `hitSlop`.
- WCAG AA-compliant colour palette (light & dark friendly).
- Voice guidance toggles and caption-friendly modes.
- Keyboard/switch-friendly navigation via large buttons and clear focus order.

## 📦 Building Distributables
- **iOS**: `expo run:ios --configuration Release`
- **Android**: `expo run:android --variant release`
- Follow Expo documentation to generate signed IPA / APK for store distribution.

## 🔐 Privacy & Disclaimer
MindMosaic stores data locally on-device only and offers manual export/delete controls. The app is not a medical device and does not provide healthcare advice.
