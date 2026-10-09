# Was gibt's heute? – notes for working on this repo

Three apps share one data set and one Firebase family document (`families/{CODE}`):

- `src/` – web app (React + TypeScript, PWA on GitHub Pages). **Reference implementation.**
- `android/` – native Android app (Kotlin, Jetpack Compose); APK built by `.github/workflows/android.yml`.
- `ios/` – native iOS app (SwiftUI, XcodeGen); checked by `.github/workflows/ios.yml`.

## Rules
- Dishes, recipes, ingredients and UI texts live in `src/data/**` and `src/i18n.tsx`.
  After changing them run `npm run export:native` and commit `shared/` (CI fails otherwise).
- New features: implement in the web app first, then port to `android/` and `ios/`
  with the same Firestore field names and field-level updates (see `src/store/firebase.ts`).
- Before pushing: `npx tsc -b && npx vitest run && npx vite build`; Android core: `cd android && gradle :core:test`.
- Recipe photos are prepared with the skill in `.claude/skills/rezepte-digitalisieren/`; printed recipes
  get their steps rewritten in own words, handwritten family recipes are marked `family: true`.
