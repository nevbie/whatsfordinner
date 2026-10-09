import SwiftUI
import WFDCore

private let PAGE = 30

/// Past dinners, adding to a past day, top dishes.
@MainActor
struct HistoryView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    @State private var limit = PAGE
    @State private var pastDate = Calendar.current.date(byAdding: .day, value: -1, to: Date()) ?? Date()

    var body: some View {
        let today = store.stats.today
        let past = store.state.plan.filter { $0.key <= today && !$0.value.dishes.isEmpty }.sorted { $0.key > $1.key }
        let top = store.stats.counts
            .filter { store.dishById[$0.key]?.kind != "side" }
            .sorted { $0.value != $1.value ? $0.value > $1.value : $0.key < $1.key }
            .prefix(10)
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text(lang.t("history.title")).font(.title2.weight(.bold)).foregroundStyle(Theme.brand)
                VStack(alignment: .leading, spacing: 6) {
                    Text(lang.t("history.addPast")).font(.caption).foregroundStyle(Theme.muted)
                    HStack {
                        DatePicker("", selection: $pastDate, in: ...Date(), displayedComponents: .date)
                            .labelsHidden()
                            .environment(\.locale, lang.locale)
                        Spacer()
                        Button("＋ \(lang.t("plan.add"))") { Task { await addPast() } }
                            .buttonStyle(PillButtonStyle(small: true))
                    }
                }
                .card()

                if past.isEmpty {
                    Text(lang.t("history.empty")).foregroundStyle(Theme.muted)
                } else {
                    if !top.isEmpty {
                        Text(lang.t("history.top")).font(.headline)
                        VStack(spacing: 0) {
                            ForEach(Array(top), id: \.key) { id, n in
                                if let d = store.dishById[id] {
                                    Button {
                                        router.openDish(id)
                                    } label: {
                                        HStack {
                                            DishNameView(dish: d, size: .sm)
                                            Spacer()
                                            Text("\(n)×").font(.subheadline.weight(.bold)).foregroundStyle(Theme.accent)
                                        }
                                        .padding(.vertical, 6)
                                        .contentShape(Rectangle())
                                    }
                                    .buttonStyle(.plain)
                                    Divider()
                                }
                            }
                        }
                        .card()
                    }
                    Text(lang.t("history.recent")).font(.headline)
                    VStack(spacing: 0) {
                        ForEach(past.prefix(limit), id: \.key) { date, entry in
                            HStack(alignment: .top, spacing: 10) {
                                Text(lang.day(date, date.prefix(4) == today.prefix(4) ? "EEEdMMM" : "EEEdMMMy"))
                                    .font(.caption.weight(.semibold))
                                    .foregroundStyle(Theme.muted)
                                    .frame(width: 92, alignment: .leading)
                                VStack(alignment: .leading, spacing: 4) {
                                    ForEach(Array(entry.dishes.enumerated()), id: \.offset) { _, id in
                                        if let d = store.dishById[id] {
                                            Button {
                                                router.openDish(id)
                                            } label: {
                                                DishNameView(dish: d, size: .sm)
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                }
                                Spacer(minLength: 0)
                            }
                            .padding(.vertical, 6)
                            Divider()
                        }
                    }
                    .card()
                    if past.count > limit {
                        Button("…") { limit += PAGE }
                            .buttonStyle(PillButtonStyle())
                            .frame(maxWidth: .infinity)
                    }
                }
            }
            .padding(16)
        }
        .background(Theme.bg)
    }

    private func addPast() async {
        let date = toISO(pastDate)
        guard date <= store.stats.today else { return }
        guard let id = await router.pickDish(lang.t("plan.pickDish")) else { return }
        let existing = store.state.plan[date]?.dishes ?? []
        // like the web app: the past day gets a plain entry with the dinner dishes
        store.setDay(date, DayEntry(dishes: existing + [id]))
    }
}
