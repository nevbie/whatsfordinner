import SwiftUI
import UIKit
import WFDCore

/// Language, family size, people/labels, removed dishes and family sync.
@MainActor
struct SettingsView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    @State private var code = ""
    @State private var busy = false
    @State private var message: String?
    @State private var labelName = ""
    @State private var deleteLabel: FavLabel?
    @State private var confirmLeave = false

    var body: some View {
        @Bindable var lang = lang
        Form {
            Section(lang.t("settings.language")) {
                Picker("", selection: $lang.lang) {
                    Text("Deutsch").tag(Lang.de)
                    Text("English").tag(Lang.en)
                }
                .pickerStyle(.segmented)
            }

            Section(lang.t("settings.family")) {
                StepperRow(label: lang.t("combo.adults"), value: store.state.settings.adults, range: 1...8) { store.updateSettings(SettingsPatch(adults: $0)) }
                StepperRow(label: lang.t("combo.kids"), value: store.state.settings.kids, range: 0...8) { store.updateSettings(SettingsPatch(kids: $0)) }
                VStack(alignment: .leading, spacing: 4) {
                    Text(lang.t("settings.avoidDays")).font(.caption).foregroundStyle(Theme.muted)
                    StepperRow(label: "", value: store.state.settings.avoidDays, range: 0...60) { store.updateSettings(SettingsPatch(avoidDays: $0)) }
                }
            }

            labelsSection
            hiddenSection
            syncSection

            Section {
                Button("＋ \(lang.t("dishes.add"))") { router.openForm() }
            }

            Section(lang.t("settings.about")) {
                Text(lang.t("settings.aboutText")).font(.caption).foregroundStyle(Theme.muted)
                if let error = store.loadError {
                    Text(error).font(.caption).foregroundStyle(Theme.danger)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(Theme.bg)
        .alert(lang.t("labels.deleteConfirm", ["name": deleteLabel?.name ?? ""]), isPresented: Binding(get: { deleteLabel != nil }, set: { if !$0 { deleteLabel = nil } })) {
            Button(lang.t("combo.remove"), role: .destructive) {
                if let l = deleteLabel { store.deleteLabel(l.id) }
                deleteLabel = nil
            }
            Button(lang.t("cancel"), role: .cancel) { deleteLabel = nil }
        }
        .alert(lang.t("settings.leaveConfirm"), isPresented: $confirmLeave) {
            Button(lang.t("settings.leave"), role: .destructive) { store.leaveFamily() }
            Button(lang.t("cancel"), role: .cancel) {}
        }
    }

    private var labelsSection: some View {
        Section {
            Text(lang.t("labels.hint")).font(.caption).foregroundStyle(Theme.muted)
            ForEach(store.state.labels) { l in
                HStack {
                    LabelTag(text: "★", color: l.color)
                    CommitField(placeholder: lang.t("party.guestName"), value: l.name) { name in
                        let n = name.trimmingCharacters(in: .whitespaces)
                        if !n.isEmpty { store.renameLabel(l.id, n) }
                    }
                    Button {
                        deleteLabel = l
                    } label: {
                        Image(systemName: "xmark")
                    }
                    .buttonStyle(.borderless)
                    .accessibilityLabel(lang.t("combo.remove"))
                }
            }
            HStack {
                TextField(lang.t("labels.placeholder"), text: $labelName)
                    .onSubmit(addLabel)
                Button(lang.t("party.add"), action: addLabel)
                    .buttonStyle(.borderless)
                    .disabled(labelName.trimmingCharacters(in: .whitespaces).isEmpty)
            }
        } header: {
            Text(lang.t("labels.title"))
        }
    }

    private func addLabel() {
        let n = labelName.trimmingCharacters(in: .whitespaces)
        guard !n.isEmpty else { return }
        store.addLabel(n)
        labelName = ""
    }

    private var hiddenSection: some View {
        Section(lang.t("settings.hidden")) {
            if store.state.hiddenDishes.isEmpty {
                Text(lang.t("settings.hiddenNone")).font(.caption).foregroundStyle(Theme.muted)
            }
            ForEach(store.state.hiddenDishes, id: \.self) { id in
                HStack {
                    Text(store.dishById[id].map { dishLabel($0, lang.lang) } ?? id)
                    Spacer()
                    Button(lang.t("settings.restore")) { store.setHidden(id, false) }
                        .buttonStyle(.borderless)
                }
            }
        }
    }

    private var syncSection: some View {
        Section(lang.t("settings.sync")) {
            if !store.syncAvailable {
                Text(lang.t("settings.syncNotConfigured")).font(.caption).foregroundStyle(Theme.muted)
            } else if let familyCode = store.familyCode {
                (Text("\(lang.t("settings.syncOn")): ") + Text(familyCode).bold().font(.body.monospaced()))
                    .textSelection(.enabled)
                HStack {
                    ShareLink(item: "\(lang.t("appTitle")) – \(familyCode)") {
                        Label(lang.t("settings.share"), systemImage: "square.and.arrow.up")
                    }
                    .buttonStyle(.borderless)
                    Spacer()
                    Button {
                        UIPasteboard.general.string = familyCode
                        message = lang.t("settings.copied")
                    } label: {
                        Image(systemName: "doc.on.doc")
                    }
                    .buttonStyle(.borderless)
                }
                Button(lang.t("settings.leave"), role: .destructive) { confirmLeave = true }
            } else {
                Text(lang.t("settings.syncOff")).font(.caption).foregroundStyle(Theme.muted)
                Button(lang.t("settings.create")) {
                    act { _ = try await store.createFamily() }
                }
                .disabled(busy)
                Text(lang.t("settings.createHint")).font(.caption).foregroundStyle(Theme.muted)
                HStack {
                    TextField(lang.t("settings.joinPlaceholder"), text: $code)
                        .textInputAutocapitalization(.characters)
                        .autocorrectionDisabled()
                    Button(lang.t("settings.join")) {
                        act {
                            let ok = try await store.joinFamily(code)
                            if !ok { message = lang.t("settings.joinFail") }
                        }
                    }
                    .buttonStyle(.borderless)
                    .disabled(busy || code.trimmingCharacters(in: .whitespaces).count < 12)
                }
            }
            if let message {
                Text(message).font(.caption)
            }
            if let error = store.syncError {
                Text("\(lang.t("settings.error")): \(error)").font(.caption).foregroundStyle(Theme.danger)
            }
        }
    }

    private func act(_ work: @escaping @MainActor () async throws -> Void) {
        busy = true
        message = nil
        Task { @MainActor in
            do {
                try await work()
            } catch {
                message = error.localizedDescription
            }
            busy = false
        }
    }
}
