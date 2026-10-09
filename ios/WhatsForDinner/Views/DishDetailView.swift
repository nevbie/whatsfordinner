import SwiftUI
import WFDCore

/// Dish detail sheet: meta, chips, loved by / Mag nicht, variants, actions, ingredients, pairs,
/// recipe, restaurant info and edit/reset/delete.
@MainActor
struct DishDetailView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router
    let id: String

    @State private var visitDate = Date()
    @State private var confirm: ConfirmKind?

    enum ConfirmKind: Identifiable {
        case reset, delete, hide
        var id: Int { hashValue }
    }

    var body: some View {
        if let dish = store.dishById[id] {
            SheetScaffold(title: dishLabel(dish, lang.lang)) {
                ScrollView {
                    VStack(alignment: .leading, spacing: 14) {
                        DishNameView(dish: dish, size: .lg)
                        HStack(alignment: .top) {
                            DishMetaView(dish: dish)
                            Spacer()
                            if dish.kind != "combo" { FavButton(dish: dish) }
                        }
                        chips(dish)
                        if dish.kind != "combo" { lovedBy(dish) }
                        variants(dish)
                        mainActions(dish)
                        if let note = dish.note?[lang.lang], !note.isEmpty { Text(note) }
                        if dish.kind == "eatout" { restaurant(dish) }
                        if dish.kind != "combo" && dish.kind != "eatout" { ingredients(dish) }
                        pairs(dish)
                        if let r = dish.recipe { recipe(r) }
                        if dish.kind != "combo" { editActions(dish) }
                    }
                    .padding(16)
                }
            }
            .alert(confirmTitle, isPresented: Binding(get: { confirm != nil }, set: { if !$0 { confirm = nil } })) {
                Button(confirmButton, role: .destructive) { runConfirm(dish) }
                Button(lang.t("cancel"), role: .cancel) { confirm = nil }
            }
        } else {
            SheetScaffold(title: "") { Color.clear }
        }
    }

    // MARK: sections

    private func chips(_ dish: Dish) -> some View {
        let times = store.stats.counts[dish.id] ?? 0
        return FlowLayout(spacing: 6) {
            if let region = regionOf(dish) { StaticChip(label: lang.t("region.\(region)")) }
            ForEach(staplesOf(dish), id: \.self) { s in StaticChip(label: lang.t("staple.\(s)")) }
            if let course = dish.course { StaticChip(label: lang.l.course(course)) }
            ForEach(dish.tags, id: \.self) { t in StaticChip(label: lang.l.tag(t)) }
            if dish.recipe?.family ?? false { StaticChip(label: lang.t("dish.familyRecipe")) }
            if store.state.customDishes[dish.id] != nil {
                StaticChip(label: lang.t(store.isBuiltin(dish.id) ? "dish.edited" : "dish.custom"))
            }
            if times > 0 { StaticChip(label: lang.t("dish.timesEaten", n: times)) }
        }
    }

    private func lovedBy(_ dish: Dish) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Caption(text: lang.t("dish.lovedBy"))
            FlowLayout(spacing: 6) {
                Chip(label: "♥ \(lang.t("dish.family"))", on: store.isFavorite(dish.id)) { store.toggleFavorite(dish.id) }
                ForEach(store.state.labels) { l in
                    Chip(label: "★ \(l.name)", on: store.isLabelFavorite(l.id, dish.id), color: l.color) { store.toggleLabelFavorite(l.id, dish.id) }
                }
            }
            if store.state.labels.isEmpty {
                Text(lang.t("labels.none")).font(.caption).foregroundStyle(Theme.muted)
            } else {
                Caption(text: lang.t("dish.dislikedBy"))
                FlowLayout(spacing: 6) {
                    ForEach(store.state.labels) { l in
                        Chip(label: "👎 \(l.name)", on: store.isLabelDislike(l.id, dish.id), color: l.color) { store.toggleLabelDislike(l.id, dish.id) }
                    }
                }
            }
        }
    }

    @ViewBuilder private func variants(_ dish: Dish) -> some View {
        if let group = dish.group {
            let others = store.dishes.filter { $0.group == group && $0.id != dish.id }
            if !others.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    Caption(text: lang.t("dish.variants"))
                    FlowLayout(spacing: 6) {
                        ForEach(others) { v in
                            Chip(label: dishLabel(v, lang.lang)) { router.openDish(v.id) }
                        }
                    }
                }
            }
        }
    }

    private func mainActions(_ dish: Dish) -> some View {
        let combo = comboTypeOf(dish)
        return FlowLayout(spacing: 8) {
            if dish.kind != "combo" && dish.kind != "bake" {
                Button(todayLabel(dish)) { store.setMeal(store.stats.today, "dinner", [dish.id]) }
                    .buttonStyle(PillButtonStyle(primary: true))
                Button(lang.t("dish.planFor")) { Task { await planFor(dish) } }
                    .buttonStyle(PillButtonStyle())
            }
            if dish.kind == "bake" {
                Button("☕ \(lang.t("dish.planCoffee"))") { Task { await planFor(dish) } }
                    .buttonStyle(PillButtonStyle(primary: true))
            }
            if let combo {
                Button("\(comboIcon(combo)) \(lang.t("suggest.buildMeal"))") {
                    router.openCombo(combo, seedId: dish.kind == "combo" ? nil : dish.id)
                }
                .buttonStyle(PillButtonStyle(primary: dish.kind == "combo"))
            }
        }
    }

    private func todayLabel(_ dish: Dish) -> String {
        if dish.kind == "eatout" { return lang.t((dish.takeaway ?? false) ? "dish.orderToday" : "dish.goToday") }
        return lang.t("suggest.takeToday")
    }

    private func planFor(_ dish: Dish) async {
        guard let date = await router.pickDay() else { return }
        if dish.kind == "bake" {
            store.setMeal(date, "coffee", store.mealIds(date, "coffee") + [dish.id])
        } else {
            store.setMeal(date, "dinner", [dish.id])
        }
    }

    private func restaurant(_ dish: Dish) -> some View {
        let today = store.stats.today
        let visits = store.state.plan.filter { $0.key <= today && dayDishIds($0.value).contains(dish.id) }.map(\.key).sorted(by: >)
        return VStack(alignment: .leading, spacing: 10) {
            if let address = dish.address, !address.isEmpty {
                Label(address, systemImage: "mappin.and.ellipse").font(.subheadline)
            }
            if let phone = dish.phone, !phone.isEmpty,
               let url = URL(string: "tel:\(phone.filter { !$0.isWhitespace })") {
                Link(destination: url) { Label(phone, systemImage: "phone") }.font(.subheadline)
            }
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Caption(text: lang.t("dish.rating"))
                    Spacer()
                    StarsEditor(value: dish.rating ?? 0) { rating in
                        var d = dish
                        d.rating = rating > 0 ? rating : nil
                        d.custom = true
                        store.saveDish(d)
                    }
                }
                HStack {
                    DatePicker("", selection: $visitDate, in: ...Date(), displayedComponents: .date)
                        .labelsHidden()
                        .environment(\.locale, lang.locale)
                    Button("＋ \(lang.t("dish.addVisit"))") {
                        let date = toISO(visitDate)
                        store.setMeal(date, "dinner", (store.state.plan[date]?.dishes ?? []).filter { $0 != dish.id } + [dish.id])
                    }
                    .buttonStyle(PillButtonStyle(small: true))
                }
                if !visits.isEmpty {
                    Text("\(lang.t("dish.visits")): \(visits.map { lang.day($0, "dMMMy") }.joined(separator: " · "))")
                        .font(.caption)
                        .foregroundStyle(Theme.muted)
                }
            }
            .card()
            FlowLayout(spacing: 8) {
                if let s = dish.url, let url = URL(string: s), url.scheme != nil {
                    Link(destination: url) { Text(lang.t("dish.menuLink")) }
                        .buttonStyle(PillButtonStyle(primary: true))
                }
                if let url = mapsURL(dish) {
                    Link(destination: url) { Text(lang.t("dish.mapsLink")) }
                        .buttonStyle(PillButtonStyle())
                }
            }
        }
    }

    private func mapsURL(_ dish: Dish) -> URL? {
        let query: String
        if let address = dish.address, !address.isEmpty {
            query = "\(dish.name.orig), \(address)"
        } else {
            query = "\(dish.name.orig) \(dish.place ?? "")".trimmingCharacters(in: .whitespaces)
        }
        var comps = URLComponents(string: "https://maps.apple.com/")
        comps?.queryItems = [URLQueryItem(name: "q", value: query)]
        return comps?.url
    }

    private func ingredients(_ dish: Dish) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(lang.t("dish.ingredients")).font(.headline)
            if dish.ingredients.isEmpty {
                Text(lang.t("dish.noIngredients")).font(.caption).foregroundStyle(Theme.muted)
            } else {
                FlowLayout(spacing: 6) {
                    ForEach(Array(dish.ingredients.enumerated()), id: \.offset) { _, i in
                        StaticChip(label: store.catalog.ingredientName(i, lang.lang))
                    }
                }
            }
        }
    }

    @ViewBuilder private func pairs(_ dish: Dish) -> some View {
        let pairs = (dish.pairsWith ?? []).compactMap { store.dishById[$0] }
        if !pairs.isEmpty {
            VStack(alignment: .leading, spacing: 6) {
                Text(lang.t("dish.pairs")).font(.headline)
                ForEach(pairs) { p in
                    Button {
                        router.openDish(p.id)
                    } label: {
                        DishNameView(dish: p, size: .sm)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func recipe(_ r: Recipe) -> some View {
        let l = lang.lang
        return VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(lang.t("dish.recipe")).font(.headline)
                if r.family ?? false { StaticChip(label: lang.t("dish.familyRecipe")) }
            }
            Text([r.serves[l], r.time[l]].filter { !$0.isEmpty }.joined(separator: " · "))
                .font(.caption)
                .foregroundStyle(Theme.muted)
            VStack(alignment: .leading, spacing: 3) {
                ForEach(Array(r.ingredients[l].enumerated()), id: \.offset) { _, line in
                    Text("• \(line)").font(.subheadline)
                }
            }
            Text(lang.t("dish.steps")).font(.subheadline.weight(.bold))
            VStack(alignment: .leading, spacing: 6) {
                ForEach(Array(r.steps[l].enumerated()), id: \.offset) { i, line in
                    HStack(alignment: .firstTextBaseline, spacing: 6) {
                        Text("\(i + 1).").font(.subheadline.weight(.bold)).foregroundStyle(Theme.accent)
                        Text(line).font(.subheadline)
                    }
                }
            }
            if let v = r.vegan { callout("🌱 \(lang.t("dish.vegan"))", v[l]) }
            if let tip = r.tip { callout("💡 \(lang.t("dish.tip"))", tip[l]) }
            if let kids = r.kids { callout("🧒 \(lang.t("dish.kids"))", kids[l]) }
            if let source = r.source, !source.isEmpty {
                Text("\(lang.t("dish.source")): \(source)").font(.caption).foregroundStyle(Theme.muted)
            }
        }
    }

    private func callout(_ title: String, _ text: String) -> some View {
        (Text("\(title): ").bold() + Text(text))
            .font(.subheadline)
            .padding(10)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.surface2, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
    }

    private func editActions(_ dish: Dish) -> some View {
        FlowLayout(spacing: 8) {
            Button(lang.t("dish.edit")) { router.openForm(id: dish.id) }
                .buttonStyle(PillButtonStyle())
            if store.state.customDishes[dish.id] != nil {
                Button(lang.t(store.isBuiltin(dish.id) ? "dish.reset" : "dish.delete")) {
                    confirm = store.isBuiltin(dish.id) ? .reset : .delete
                }
                .buttonStyle(PillButtonStyle(danger: true))
            }
            if store.isBuiltin(dish.id) {
                Button("🗑 \(lang.t("dish.hide"))") { confirm = .hide }
                    .buttonStyle(PillButtonStyle(danger: true))
            }
        }
        .padding(.top, 8)
    }

    // MARK: confirmation

    private var confirmTitle: String {
        switch confirm {
        case .reset: return lang.t("dish.resetConfirm")
        case .delete: return lang.t("dish.deleteConfirm")
        case .hide: return lang.t("dish.hideConfirm")
        case nil: return ""
        }
    }

    private var confirmButton: String {
        switch confirm {
        case .reset: return lang.t("dish.reset")
        case .delete: return lang.t("dish.delete")
        case .hide: return lang.t("dish.hide")
        case nil: return "OK"
        }
    }

    private func runConfirm(_ dish: Dish) {
        let kind = confirm
        confirm = nil
        switch kind {
        case .reset:
            // an edited built-in dish falls back to the original
            store.deleteDish(dish.id)
        case .delete:
            store.deleteDish(dish.id)
            router.close()
        case .hide:
            store.setHidden(dish.id, true)
            router.close()
        case nil:
            break
        }
    }
}
