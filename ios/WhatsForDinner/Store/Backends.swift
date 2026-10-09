import FirebaseFirestore
import Foundation
import WFDCore

/// Storage for the shared family state: a JSON file on this device, or the family's Firestore document.
@MainActor
protocol FamilyBackend: AnyObject {
    func start(onState: @escaping (FamilyState) -> Void, onError: @escaping (String) -> Void)
    func stop()
    /// Apply a change. Calls are applied in order.
    func send(_ op: FamilyOp)
}

/// The state as JSON in Application Support (like the web app's localStorage backend).
enum LocalStorage {
    static var url: URL {
        let dir = (try? FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true))
            ?? FileManager.default.temporaryDirectory
        return dir.appendingPathComponent("wfd-state.json")
    }

    static func read() -> FamilyState {
        guard let data = try? Data(contentsOf: url), let state = try? JSONDecoder().decode(FamilyState.self, from: data) else {
            return .empty()
        }
        return state
    }

    static func write(_ state: FamilyState) {
        guard let data = try? JSONEncoder().encode(state) else { return }
        try? data.write(to: url, options: .atomic)
    }
}

/// Single-device storage.
@MainActor
final class LocalBackend: FamilyBackend {
    private var state = LocalStorage.read()
    private var onState: ((FamilyState) -> Void)?

    func start(onState: @escaping (FamilyState) -> Void, onError: @escaping (String) -> Void) {
        self.onState = onState
        onState(state)
    }

    func stop() {
        onState = nil
    }

    func send(_ op: FamilyOp) {
        state = apply(op, to: state)
        LocalStorage.write(state)
        onState?(state)
    }
}

/// One Firestore document per family: families/{CODE}. Field-level updates (plan.<date>, array unions …)
/// keep concurrent edits from different phones from overwriting each other – exactly like the web app.
@MainActor
final class FirebaseBackend: FamilyBackend {
    let code: String
    private var ref: DocumentReference?
    private var listener: ListenerRegistration?
    private var pending: [FamilyOp] = []
    private var onError: ((String) -> Void)?
    private var stopped = false

    init(code: String) {
        self.code = code
    }

    func start(onState: @escaping (FamilyState) -> Void, onError: @escaping (String) -> Void) {
        self.onError = onError
        let code = self.code
        Task { [weak self] in
            do {
                let ref = try await FirebaseService.familyRef(code)
                guard let self, !self.stopped else { return }
                self.ref = ref
                self.listener = ref.addSnapshotListener { snapshot, error in
                    Task { @MainActor in
                        if let error {
                            onError(error.localizedDescription)
                            return
                        }
                        guard let snapshot else { return }
                        onState(decodeFamilyState(snapshot.data()))
                    }
                }
                let queued = self.pending
                self.pending = []
                for op in queued { self.send(op) }
            } catch {
                onError(error.localizedDescription)
            }
        }
    }

    func stop() {
        stopped = true
        listener?.remove()
        listener = nil
        onError = nil
    }

    func send(_ op: FamilyOp) {
        guard let ref else {
            pending.append(op)
            return
        }
        do {
            let updates = try firestoreUpdates(op)
            guard !updates.isEmpty else { return }
            var fields: [AnyHashable: Any] = [:]
            for u in updates {
                fields[FieldPath(u.path)] = Self.firestoreValue(u.change)
            }
            ref.updateData(fields) { [weak self] error in
                guard let error else { return }
                let message = error.localizedDescription
                Task { @MainActor in self?.onError?(message) }
            }
        } catch {
            onError?(error.localizedDescription)
        }
    }

    private static func firestoreValue(_ change: FieldChange) -> Any {
        switch change {
        case let .set(value): return value
        case .delete: return FieldValue.delete()
        case let .arrayUnion(ids): return FieldValue.arrayUnion(ids)
        case let .arrayRemove(ids): return FieldValue.arrayRemove(ids)
        }
    }
}
