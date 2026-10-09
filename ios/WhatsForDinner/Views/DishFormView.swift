import SwiftUI
import WFDCore

/// Add / edit a dish or restaurant (web: DishForm).
@MainActor
struct DishFormView: View {
    @Environment(FamilyStore.self) private var store
    @Environment(LangModel.self) private var lang
    @Environment(Router.self) private var router

    private let existing: Dish?
    private let uiLang: Lang

    @State private var orig: String
    @State private var origLang: String
    @State private var roman: String
    @State private var de: String
    @State private var en: String
    @State private var cuisine: String
    @State private var kind: String
    @State private var course: String
    @State private var tags: [String]
    @State private var effort: Int
    @State private var staples: [String]
    @State private var ingredients: String
    @State private var note: String
    @State private var url: String
    @State private var takeaway: Bool
    @State private var place: String
    @State private var address: String
    @State private var phone: String
    @State private var rating: Int
    @State private var error = ""

    init(store: FamilyStore, lang: Lang, id: String?, kind initialKind: String?) {
        let d = id.flatMap { store.dishById[$0] }
        existing = d
        uiLang = lang
        _orig = State(initialValue: d?.name.orig ?? "")
        _origLang = State(initialValue: d?.name.lang ?? lang.rawValue)
        _roman = State(initialValue: d?.name.roman ?? "")
        _de = State(initialValue: d?.name.de ?? "")
        _en = State(initialValue: d?.name.en ?? "")
        _cuisine = State(initialValue: (d?.cuisine).flatMap { $0 == "restaurant" ? nil : $0 } ?? "german")
        _kind = State(initialValue: d?.kind ?? initialKind ?? "dish")
        _course = State(initialValue: d?.course ?? "")
        _tags = State(initialValue: d?.tags ?? [])
        _effort = State(initialValue: d?.effort ?? 2)
        _staples = State(initialValue: d.map { staplesOf($0) } ?? [])
        _ingredients = State(initialValue: (d?.ingredients ?? []).map { store.catalog.ingredientName($0, lang) }.joined(separator: ", "))
        _note = State(initialValue: d?.note?[lang] ?? "")
        _url = State(initialValue: d?.url ?? "")
        _takeaway = State(initialValue: d?.takeaway ?? false)
        _place = State(initialValue: d?.place ?? "")
        _address = State(initialValue: d?.address ?? "")
        _phone = State(initialValue: d?.phone ?? "")
        _rating = State(initialValue: d?.rating ?? 0)
    }

    /// Builder roles offered for the current kind / cuisine, grouped like the web's optgroups.
    private struct CourseGroup {
        let title: String
        let courses: [String]
    }

    private var courseGroups: [CourseGroup] {
        if kind == "bake" { return [CourseGroup(title: lang.t("form.kind.bake"), courses: BAKE_COURSES)] }
        var groups: [CourseGroup] = []
        if cuisine == "chinese" { groups.append(CourseGroup(title: lang.t("combo.chinese"), courses: CHINESE_COURSES)) }
        if cuisine == "indian" { groups.append(CourseGroup(title: lang.t("combo.indian"), courses: INDIAN_COURSES)) }
        for (combo, courses) in OTHER_BUILDERS {
            groups.append(CourseGroup(title: lang.t("combo.\(combo)"), courses: courses))
        }
        return groups
    }

    var body: some View {
        SheetScaffold(title: lang.t(existing == nil ? "form.titleNew" : "form.titleEdit")) {
            Form {
                Section {
                    TextField("\(lang.t("form.orig")) *", text: $orig)
                    Picker(lang.t("form.lang"), selection: $origLang) {
                        ForEach(lang.l.langCodes + (lang.l.langCodes.contains(origLang) ? [] : [origLang]), id: \.self) { code in
                            Text(lang.l.langName(code)).tag(code)
                        }
                    }
                    TextField(lang.t("form.roman"), text: $roman)
                    TextField(lang.t("form.de"), text: $de)
                    TextField(lang.t("form.en"), text: $en)
                }
                Section {
                    Picker(lang.t("form.kind"), selection: $kind) {
                        ForEach(["dish", "side", "bake", "eatout"], id: \.self) { k in
                            Text(lang.t("form.kind.\(k)")).tag(k)
                        }
                        if !["dish", "side", "bake", "eatout"].contains(kind) {
                            Text(lang.t("form.kind.\(kind)")).tag(kind)
                        }
                    }
                    if kind != "eatout" {
                        Picker(lang.t("form.cuisine"), selection: $cuisine) {
                            ForEach(CUISINE_ORDER.filter { $0 != "restaurant" }, id: \.self) { c in
                                Text(lang.l.cuisine(c)).tag(c)
                            }
                        }
                        Picker(kind == "bake" ? lang.t("form.kind.bake") : lang.t("form.builderRole"), selection: $course) {
                            Text(lang.t("form.none")).tag("")
                            ForEach(courseGroups, id: \.title) { group in
                                Section(group.title) {
                                    ForEach(group.courses, id: \.self) { c in
                                        Text(lang.l.course(c)).tag(c)
                                    }
                                }
                            }
                        }
                    }
                }
                if kind == "eatout" { restaurantSection } else { detailSections }
                Section(lang.t("form.note")) {
                    TextField(lang.t("form.note"), text: $note, axis: .vertical).lineLimit(2...6)
                }
                if !error.isEmpty {
                    Text(error).foregroundStyle(Theme.danger)
                }
            }
            .scrollContentBackground(.hidden)
            .toolbar {
                ToolbarItem(placement: .bottomBar) {
                    HStack {
                        Button(lang.t("form.cancel")) { router.close() }
                        Spacer()
                        Button(lang.t("form.save")) { save() }
                            .buttonStyle(PillButtonStyle(primary: true))
                    }
                }
            }
        }
    }

    @ViewBuilder private var restaurantSection: some View {
        Section {
            TextField("\(lang.t("form.url")) (https://…)", text: $url)
                .keyboardType(.URL)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
            TextField(lang.t("form.place"), text: $place, prompt: Text(lang.t("form.placeHint")))
            TextField(lang.t("form.address"), text: $address)
            TextField("☎︎", text: $phone).keyboardType(.phonePad)
            HStack {
                Text(lang.t("dish.rating"))
                Spacer()
                StarsEditor(value: rating) { rating = $0 }
            }
            Toggle(lang.t("dish.takeaway"), isOn: $takeaway)
        }
    }

    @ViewBuilder private var detailSections: some View {
        Section(lang.t("form.tags")) {
            FlowLayout(spacing: 6) {
                ForEach(TAG_ORDER, id: \.self) { tag in
                    Chip(label: lang.l.tag(tag), on: tags.contains(tag)) { tags = toggled(tags, tag) }
                }
            }
        }
        Section(lang.t("filter.staple")) {
            FlowLayout(spacing: 6) {
                ForEach(STAPLES, id: \.self) { s in
                    Chip(label: lang.t("staple.\(s)"), on: staples.contains(s)) { staples = toggled(staples, s) }
                }
            }
        }
        Section(lang.t("form.effort")) {
            Picker("", selection: $effort) {
                ForEach(1...3, id: \.self) { e in Text(lang.t("dish.effort\(e)")).tag(e) }
            }
            .pickerStyle(.segmented)
        }
        Section(lang.t("form.ingredients")) {
            TextField(lang.t("form.ingredients"), text: $ingredients, axis: .vertical).lineLimit(3...8)
        }
    }

    private func trimmed(_ s: String) -> String { s.trimmingCharacters(in: .whitespacesAndNewlines) }

    private func save() {
        let o = trimmed(orig)
        guard !o.isEmpty else {
            error = lang.t("form.required")
            return
        }
        var finalTags = tags
        if finalTags.contains("vegan") && !finalTags.contains("veggie") { finalTags.append("veggie") }
        let id = existing?.id ?? "c-\(base36Now())\(String(uid().prefix(4)))"
        let name = DishName(orig: o, lang: origLang, roman: trimmed(roman).isEmpty ? nil : trimmed(roman), de: trimmed(de).isEmpty ? o : trimmed(de), en: trimmed(en).isEmpty ? o : trimmed(en))
        var dish = existing ?? Dish(id: id, name: name, cuisine: cuisine, kind: kind)
        dish.id = id
        dish.name = name
        dish.cuisine = kind == "eatout" ? "restaurant" : cuisine
        dish.kind = kind
        let allowed = courseGroups.flatMap(\.courses)
        dish.course = allowed.contains(course) ? course : nil
        dish.tags = finalTags
        dish.effort = effort
        dish.staples = staples
        dish.ingredients = store.catalog.parseIngredients(ingredients)
        // the note is entered once; keep the other language's text if it existed
        let n = trimmed(note)
        if n.isEmpty {
            dish.note = nil
        } else {
            dish.note = I18nText(
                de: uiLang == .de ? n : (existing?.note?.de ?? n),
                en: uiLang == .en ? n : (existing?.note?.en ?? n)
            )
        }
        dish.custom = true
        if kind == "eatout" {
            dish.url = trimmed(url).isEmpty ? nil : trimmed(url)
            dish.takeaway = takeaway
            dish.place = trimmed(place).isEmpty ? nil : trimmed(place)
            dish.address = trimmed(address).isEmpty ? nil : trimmed(address)
            dish.phone = trimmed(phone).isEmpty ? nil : trimmed(phone)
            dish.rating = rating > 0 ? rating : nil
        }
        store.saveDish(dish)
        router.close()
    }
}
