package de.nevbie.whatsfordinner.core

import java.time.format.DateTimeFormatter
import java.util.Locale

/** Date labels like the web's Intl.DateTimeFormat calls (de-DE / en-GB). */
object Format {
    enum class Style(val de: String, val en: String) {
        /** "Di., 6.10." / "Tue 6/10" (default formatDay) */
        SHORT("EE, d.M.", "EEE d/M"),
        /** "Dienstag, 6. Oktober" */
        LONG("EEEE, d. MMMM", "EEEE d MMMM"),
        WEEKDAY("EE", "EEE"),
        DAY_MONTH("d.M.", "d/M"),
        DAY_MON("d. MMM", "d MMM"),
        WEEKDAY_LONG_DAY_MONTH("EEEE, d.M.", "EEEE d/M"),
        DAY_MON_YEAR("d. MMM yyyy", "d MMM yyyy"),
        WEEKDAY_DAY_MON("EE, d. MMM", "EEE d MMM"),
        WEEKDAY_DAY_MON_YEAR("EE, d. MMM yyyy", "EEE d MMM yyyy"),
    }

    fun day(iso: String, lang: Lang, style: Style = Style.SHORT): String = try {
        val locale = if (lang == "de") Locale.GERMANY else Locale.UK
        DateTimeFormatter.ofPattern(if (lang == "de") style.de else style.en, locale).format(Dates.fromISO(iso))
    } catch (e: Exception) {
        iso
    }
}

/** Dish form helpers (DishForm.tsx). */
object DishFormLogic {
    val TAGS = listOf("meat", "fish", "veggie", "vegan", "kids", "spicy", "oven", "sweet", "social", "winter", "summer")
    val KINDS = listOf("dish", "side", "bake", "eatout")
    private val CHINESE_COURSES = listOf("meat", "fish", "tofu", "egg", "veg", "cold", "soup", "staple", "meal")
    private val INDIAN_COURSES = listOf("curry", "dal", "sabzi", "raita", "chutney", "salad", "side", "bread", "rice", "drink", "dessert", "snack", "meal")
    /** Builder roles that work for any cuisine. */
    private val OTHER_BUILDERS = listOf(
        "tapas" to listOf("tapaVeg", "tapaMeat", "tapaFish", "tapaBread"),
        "abendbrot" to listOf("abBread", "abCheese", "abMeat", "abFish", "abSpread", "abVeg", "abExtra"),
        "teller" to listOf("plMain", "plStarch", "plVeg"),
        "salad" to listOf("slBase", "slExtra", "slTopping", "slDressing"),
    )
    private val BAKE_COURSES = listOf("bkCake", "bkDessert", "bkPastry", "bkSweets")

    /** Course groups for the builder role select: (group title key, courses). */
    fun courseGroups(kind: String, cuisine: String): List<Pair<String, List<String>>> {
        if (kind == Kind.BAKE) return listOf("form.kind.bake" to BAKE_COURSES)
        val own = when (cuisine) {
            "chinese" -> listOf("combo.chinese" to CHINESE_COURSES)
            "indian" -> listOf("combo.indian" to INDIAN_COURSES)
            else -> emptyList()
        }
        return own + OTHER_BUILDERS.map { (c, cs) -> "combo.$c" to cs }
    }

    /** Map typed ingredient names back to dictionary keys where possible; keep the rest as free text. */
    fun parseIngredients(text: String, catalog: Catalog): List<String> {
        val lookup = HashMap<String, String>()
        for ((key, names) in catalog.ingredients) {
            lookup[key] = key
            names.getOrNull(0)?.let { lookup[it.lowercase()] = key }
            names.getOrNull(1)?.let { lookup[it.lowercase()] = key }
        }
        return text.split(Regex("[,;\\n]")).map { it.trim() }.filter { it.isNotEmpty() }.map { lookup[it.lowercase()] ?: it }
    }

    fun newId(): String = "c-${System.currentTimeMillis().toString(36)}${PartyLogic.uid().take(4)}"

    data class Input(
        val orig: String, val origLang: String, val roman: String, val de: String, val en: String,
        val cuisine: String, val kind: String, val course: String, val tags: List<String>, val effort: Int,
        val staples: List<String>, val ingredients: String, val note: String, val url: String, val takeaway: Boolean,
        val place: String, val address: String, val rating: Int,
    )

    /** Build the dish to save (null when the original name is missing). */
    fun build(existing: Dish?, i: Input, lang: Lang, catalog: Catalog): Dish? {
        val orig = i.orig.trim()
        if (orig.isEmpty()) return null
        val tags = i.tags.toMutableList()
        if ("vegan" in tags && "veggie" !in tags) tags.add("veggie")
        val courses = courseGroups(i.kind, i.cuisine).flatMap { it.second }
        val note = i.note.trim()
        val eatout = i.kind == Kind.EATOUT
        val base = existing ?: Dish(id = newId())
        return base.copy(
            name = DishName(orig = orig, lang = i.origLang, roman = i.roman.trim().ifEmpty { null }, de = i.de.trim().ifEmpty { orig }, en = i.en.trim().ifEmpty { orig }),
            cuisine = if (eatout) "restaurant" else i.cuisine,
            kind = i.kind,
            course = i.course.takeIf { it in courses },
            tags = tags,
            effort = i.effort,
            staples = i.staples,
            ingredients = parseIngredients(i.ingredients, catalog),
            // the note is entered once; keep the other language's text if it existed
            note = if (note.isNotEmpty()) I18nText(
                de = if (lang == "de") note else existing?.note?.de ?: note,
                en = if (lang == "en") note else existing?.note?.en ?: note,
            ) else null,
            custom = true,
            url = if (eatout) i.url.trim().ifEmpty { null } else base.url,
            takeaway = if (eatout) i.takeaway else base.takeaway,
            place = if (eatout) i.place.trim().ifEmpty { null } else base.place,
            address = if (eatout) i.address.trim().ifEmpty { null } else base.address,
            rating = if (eatout) i.rating.takeIf { it > 0 } else base.rating,
        )
    }
}
