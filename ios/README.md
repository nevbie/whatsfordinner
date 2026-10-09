# Was gibt's heute? – iOS app

Native SwiftUI version of the family dinner planner (iOS 17+). It shares its data with the web app
(`src/`) and the Android app: the same built-in dishes (`shared/dishes.json`), the same UI texts
(`shared/strings.json`) and the same Firebase family document `families/{CODE}`.

```
ios/
├── project.yml                 XcodeGen project (app target, unit-test target, SPM packages)
├── WFDCore/                    UI-free logic as a local Swift package (no Firebase, no UIKit)
│   ├── Sources/WFDCore/        model, filters, suggestions, meal builders, party planner, sync mapping
│   └── Tests/WFDCoreTests/     XCTest port of src/__tests__ – loads the real ../../shared JSON
├── WhatsForDinner/
│   ├── App/                    @main app, bundled-resource loading
│   ├── Store/                  FamilyStore (@Observable, @MainActor), local + Firestore backends
│   ├── UI/                     theme (Berry & Peach), language, sheet router, shared components
│   ├── Views/                  all screens and sheets
│   ├── Assets.xcassets         app icon
│   └── FirebaseConfig.example.plist
└── WhatsForDinnerTests/        app-hosted test: shared JSON is bundled, app-id mapping
```

## Build

You need a Mac with Xcode 15.4 or newer (Xcode 16 recommended) and [XcodeGen](https://github.com/yonaskolb/XcodeGen):

```sh
brew install xcodegen
cd ios
xcodegen generate            # creates WhatsForDinner.xcodeproj (not committed)
open WhatsForDinner.xcodeproj
```

Command line (what CI runs):

```sh
cd ios && xcodegen generate
xcodebuild -project WhatsForDinner.xcodeproj -scheme WhatsForDinner \
  -destination 'generic/platform=iOS Simulator' build CODE_SIGNING_ALLOWED=NO
```

The logic package builds and tests anywhere Swift runs, including Linux:

```sh
cd ios/WFDCore && swift test
```

### How `shared/` is bundled

`project.yml` adds `../shared/dishes.json` and `../shared/strings.json` to the app target as resources
**by reference** – they are not copied into `ios/`. At start the app reads them from the bundle
(`AppResources.load()`), so after `npm run export:native` the next iOS build picks up new dishes and texts
automatically. Built-in dishes come from `dishes.json`; the family's own and edited dishes
(`customDishes`, same id replaces a built-in dish) and removed dishes (`hiddenDishes`) come from the family
state, exactly like the web app.

## Firebase (sync between phones)

Without configuration the app works **local-only**: the state is stored as JSON in the app's
Application Support folder (like the web app's localStorage backend).

To sync with the family (the same Firebase project as the web app):

1. Copy `WhatsForDinner/FirebaseConfig.example.plist` to `WhatsForDinner/FirebaseConfig.plist`.
2. Fill in `API_KEY`, `PROJECT_ID`, `APP_ID`, `AUTH_DOMAIN` – the values of the web app's
   `VITE_FIREBASE_*` variables.
   - `APP_ID`: best is to register an **iOS app** in the Firebase console (Project settings → Add app → iOS,
     bundle id `de.nevbie.whatsfordinner`; you do not need to download `GoogleService-Info.plist`) and use
     its app id `1:<sender>:ios:<hash>`. The web app id `1:<sender>:web:<hash>` also works – the app maps it
     to the iOS form because FirebaseCore rejects non-iOS app ids.
   - If the API key is restricted to HTTP referrers (web only), allow iOS apps / the bundle id in the
     Google Cloud console, otherwise sign-in fails on the phone.
3. Build again. `FirebaseConfig.plist` is git-ignored; a build-phase script copies it into the app only if
   it exists, so builds without it still succeed. CI can write it from repository variables, e.g.

   ```sh
   /usr/libexec/PlistBuddy -c "Add :API_KEY string $FIREBASE_API_KEY" \
     -c "Add :PROJECT_ID string $FIREBASE_PROJECT_ID" -c "Add :APP_ID string $FIREBASE_APP_ID" \
     -c "Add :AUTH_DOMAIN string $FIREBASE_AUTH_DOMAIN" ios/WhatsForDinner/FirebaseConfig.plist
   ```

Firebase is initialised manually from these values (no `GoogleService-Info.plist`), signs in anonymously
and listens to `families/{CODE without dashes}` with offline persistence. All writes are field-level updates
with the same paths as `src/store/firebase.ts` (`plan.<date>`, `favorites` array union/remove,
`customDishes.<id>`, `parties.<id>`, `labels`, `labelFavorites.<id>`, `labelDislikes.<id>`, `hiddenDishes`,
`settings.<key>`); nil values are never written. The mapping lives in `WFDCore/FamilyOps.swift` and is unit-tested.

In the app: *Optionen → Mit der Familie teilen* – create a family (shows the code `XXXX-XXXX-XXXX` to share),
join with a code from the web app or another phone, or leave.

## Install on an iPhone with a free Apple ID

1. On the Mac: Xcode → Settings → Accounts → **+** → Apple ID, sign in with any Apple ID (free).
2. `cd ios && xcodegen generate && open WhatsForDinner.xcodeproj` (put `FirebaseConfig.plist` in place first
   if the phone should sync).
3. Select the project → target **WhatsForDinner** → *Signing & Capabilities*: tick *Automatically manage
   signing*, choose your *Personal Team*. If Xcode says the bundle id is taken, change it to something unique,
   e.g. `de.<yourname>.whatsfordinner`. (Setting `DEVELOPMENT_TEAM` in `project.yml` keeps this across
   `xcodegen generate` runs.)
4. Connect the iPhone by cable, unlock it, tap *Trust*. On iOS 16+ enable *Settings → Privacy & Security →
   Developer Mode* (the phone restarts).
5. Choose the iPhone as run destination in the Xcode toolbar and press **Run** (⌘R).
6. First start on the phone: *Settings → General → VPN & Device Management* → your Apple ID → *Trust*.

With a free Apple ID the app stays valid for **7 days**; then connect the phone and press Run again (the data
stays). A free account can have up to 3 apps installed this way. For longer-lived installs or TestFlight you
need the paid Apple Developer Program.

## Notes

- Language follows the device (German → Deutsch, everything else → English) and can be switched in Optionen.
- Light and dark mode use the Berry & Peach palette of the web app.
- Logic changes belong in the web app first (reference implementation), then in `WFDCore` with a test.
