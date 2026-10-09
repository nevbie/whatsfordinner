# Was gibt's heute? – Android

Native Android version of the family dinner planner (Kotlin, Jetpack Compose / Material 3).
It shares the dish data with the web app (`../shared/*.json`) and syncs through the **same
Firestore document** (`families/{CODE}`) with the same field-level updates, so web and Android
phones of one family can be mixed.

## Layout

```
android/
├── settings.gradle.kts   includes :core always, :app only when an Android SDK is found
├── build.gradle.kts      plugin versions (AGP 8.9.1, Kotlin 2.1.21) via buildscript classpath
├── core/                 pure Kotlin/JVM – no Android dependencies
│   └── src/main/kotlin/de/nevbie/whatsfordinner/core/
│       Model.kt          data model = src/data/types.ts (kotlinx.serialization)
│       Json.kt           JSON settings, JSON ⇄ plain Map/List (for Firestore)
│       SharedData.kt     loading shared/dishes.json + strings.json, i18n lookup ({n} placeholders)
│       Dates.kt Classify.kt Filters.kt Suggest.kt Combos.kt Party.kt   ports of src/logic/* and classify.ts
│       State.kt          normalize, Change (all writes), local apply, store helpers, family codes
│       Remote.kt         Change → Firestore field updates (plan.<date>, arrayUnion …)
│       Lists.kt Format.kt   dish list search/sort/areas, stats, date labels, dish form logic
│   └── src/test/…        JUnit tests ported from src/__tests__ (+ state / Firestore mapping tests)
└── app/                  Android app (package de.nevbie.whatsfordinner)
    ├── data/             AppStore (ViewModel = StoreContext), LocalBackend (filesDir/state.json),
    │                     FirebaseSync / FirebaseBackend
    └── ui/               Compose UI: App (6 tabs + sheet stack), Suggest, Plan (Woche), Dishes,
                          DishDetail, DishForm, ComboBuilder, Party list/planner, History, Settings, pickers
```

## Build & run

Requirements: JDK 17+ and (for the app) the Android SDK with platform 35.

```bash
cd android
./gradlew :core:test        # logic tests, needs no Android SDK
./gradlew assembleDebug     # APK → app/build/outputs/apk/debug/app-debug.apk
./gradlew installDebug      # install on a connected device / emulator
```

`:app` is only part of the build when `ANDROID_HOME` / `ANDROID_SDK_ROOT` is set or
`local.properties` contains `sdk.dir=…`. Without an SDK only `:core` is configured (and Google's
Maven repository is not contacted), so `gradle :core:test` works anywhere. Force core-only with
`-PskipApp=true`. Open the `android/` folder in Android Studio to develop the app.

## Shared data (`../shared`)

`shared/dishes.json` (built-in dishes incl. recipes, ingredient names) and `shared/strings.json`
(all UI texts in German/English plus label tables) are exported from the web app with
`npm run export:native`. They are **not copied**: `app/build.gradle.kts` adds `../shared` as an
assets source directory, and the app parses both files at startup. The core tests read the same
files from the repository (system property `sharedDir`). After changing dishes or texts in the web
app, re-export and rebuild – nothing to do on the Android side.

## Firebase (family sync)

The app is initialised by hand from build config – there is **no google-services.json** and no
google-services plugin. Set these four values (the web app's Firebase config) as Gradle properties
(`~/.gradle/gradle.properties`, `-PFIREBASE_API_KEY=…`) or environment variables:

| name                   | example                          |
|------------------------|----------------------------------|
| `FIREBASE_API_KEY`     | `AIza…`                          |
| `FIREBASE_PROJECT_ID`  | `whatsfordinner-1234`            |
| `FIREBASE_APP_ID`      | `1:123456789:web:abc…` (or an Android app id `1:…:android:…`) |
| `FIREBASE_AUTH_DOMAIN` | `whatsfordinner-1234.firebaseapp.com` (stored, not needed on Android) |

They end up in `BuildConfig`. If they are empty, the app runs in local-only mode (exactly like
the web app without config) and Settings shows "sharing not set up". With a config:
Settings → create a family (uploads this phone's data, shows the code `XXXX-XXXX-XXXX`) or join
with a code; anonymous sign-in, offline persistence and a live snapshot listener are used. If your
API key is restricted to web referrers, allow the Android app (or use an unrestricted/Android key).

In CI, pass them e.g. as `env:` from repository variables before `./gradlew assembleDebug`.

## Notes / differences to the web app

- Language follows the device (German → German, otherwise English), switchable in Settings.
- Filters, language and the family code are stored per device (SharedPreferences); the family
  state is cached in `filesDir/state.json`.
- Invite links (`?join=CODE`) are a web feature; on Android the code is shared as text and typed in.
