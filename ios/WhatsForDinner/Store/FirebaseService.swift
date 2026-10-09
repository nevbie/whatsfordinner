import FirebaseAuth
import FirebaseCore
import FirebaseFirestore
import Foundation
import WFDCore

/// Firebase settings from FirebaseConfig.plist (keys API_KEY, PROJECT_ID, APP_ID, AUTH_DOMAIN).
/// The plist is optional: without it (or with placeholder values) the app runs in local-only mode.
struct FirebaseSettings {
    var apiKey: String
    var projectId: String
    var appId: String
    var authDomain: String?

    static func load(bundle: Bundle = .main) -> FirebaseSettings? {
        guard let url = bundle.url(forResource: "FirebaseConfig", withExtension: "plist"),
              let data = try? Data(contentsOf: url),
              let plist = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any]
        else { return nil }
        func value(_ key: String) -> String? {
            guard let s = (plist[key] as? String)?.trimmingCharacters(in: .whitespacesAndNewlines), !s.isEmpty,
                  !s.hasPrefix("YOUR_"), !s.hasPrefix("$(")
            else { return nil }
            return s
        }
        guard let apiKey = value("API_KEY"), let projectId = value("PROJECT_ID"), let appId = value("APP_ID") else { return nil }
        return FirebaseSettings(apiKey: apiKey, projectId: projectId, appId: appId, authDomain: value("AUTH_DOMAIN"))
    }

    /// Sender id = second segment of the app id (1:<senderId>:ios|web:<hash>).
    var gcmSenderID: String {
        let parts = appId.split(separator: ":")
        return parts.count > 1 ? String(parts[1]) : ""
    }

    /// App id handed to FirebaseCore. FirebaseCore raises an exception for app ids whose platform segment
    /// is not "ios", so the web app id (1:<sender>:web:<hash>) is mapped to the iOS form. Firestore and Auth
    /// only use the API key and project id; registering an iOS app in the Firebase console and using its
    /// app id is still the cleaner option (see README).
    var iosAppID: String {
        var parts = appId.split(separator: ":", omittingEmptySubsequences: false).map(String.init)
        guard parts.count == 4, parts[2] != "ios" else { return appId }
        parts[2] = "ios"
        return parts.joined(separator: ":")
    }
}

/// Firebase is initialised manually from FirebaseConfig.plist – no GoogleService-Info.plist needed.
@MainActor
enum FirebaseService {
    private(set) static var isConfigured = false

    static func configureIfAvailable() {
        guard !isConfigured, let s = FirebaseSettings.load() else { return }
        // an app id FirebaseCore cannot parse would raise an exception – stay local-only instead
        guard s.iosAppID.range(of: #"^1:[0-9]+:ios:[0-9a-fA-F]+$"#, options: .regularExpression) != nil else { return }
        if FirebaseApp.app() == nil {
            let options = FirebaseOptions(googleAppID: s.iosAppID, gcmSenderID: s.gcmSenderID)
            options.apiKey = s.apiKey
            options.projectID = s.projectId
            FirebaseApp.configure(options: options)
        }
        // configure() refuses app ids it considers invalid; then stay local-only instead of crashing later
        guard FirebaseApp.app() != nil else { return }
        let settings = FirestoreSettings()
        settings.cacheSettings = PersistentCacheSettings()
        Firestore.firestore().settings = settings
        isConfigured = true
    }

    /// Firestore after anonymous sign-in (the security rules require an authenticated user).
    static func firestore() async throws -> Firestore {
        guard isConfigured else { throw SyncError.notConfigured }
        if Auth.auth().currentUser == nil {
            _ = try await Auth.auth().signInAnonymously()
        }
        return Firestore.firestore()
    }

    static func familyRef(_ code: String) async throws -> DocumentReference {
        try await firestore().collection("families").document(familyDocId(code))
    }

    static func createFamily(code: String, initial: FamilyState) async throws {
        guard let data = try jsonValue(initial) as? [String: Any] else { throw SyncError.encoding }
        try await familyRef(code).setData(data)
    }

    static func familyExists(code: String) async throws -> Bool {
        try await familyRef(code).getDocument().exists
    }
}

enum SyncError: LocalizedError {
    case notConfigured
    case encoding

    var errorDescription: String? {
        switch self {
        case .notConfigured: return "Firebase is not configured"
        case .encoding: return "Could not encode data"
        }
    }
}
