package de.nevbie.whatsfordinner.core

import kotlinx.serialization.Serializable

/*
 * Data model – mirrors src/data/types.ts of the web app field by field, so the same Firestore
 * document can be read and written by both apps. Enum-like values (cuisine, tag, course, kind …)
 * are plain strings: unknown values written by a newer web version survive a round trip.
 * Optional fields are nullable and never written when null (see AppJson.explicitNulls = false).
 */

typealias Lang = String // "de" | "en"

@Serializable
data class I18nText(val de: String = "", val en: String = "") {
    operator fun get(lang: Lang): String = if (lang == "de") de else en
}

@Serializable
data class I18nList(val de: List<String> = emptyList(), val en: List<String> = emptyList()) {
    operator fun get(lang: Lang): List<String> = if (lang == "de") de else en
}

@Serializable
data class DishName(
    val orig: String = "",
    val lang: String = "de",
    val roman: String? = null,
    val de: String = "",
    val en: String = "",
) {
    operator fun get(l: Lang): String = if (l == "de") de else en
}

@Serializable
data class Recipe(
    val serves: I18nText = I18nText(),
    val time: I18nText = I18nText(),
    val ingredients: I18nList = I18nList(),
    val steps: I18nList = I18nList(),
    val vegan: I18nText? = null,
    val tip: I18nText? = null,
    val kids: I18nText? = null,
    val source: String? = null,
    val family: Boolean? = null,
)

@Serializable
data class Dish(
    val id: String,
    val name: DishName = DishName(),
    val cuisine: String = "german",
    /** dish | side | combo | eatout | party | bake */
    val kind: String = "dish",
    val course: String? = null,
    val tags: List<String> = emptyList(),
    /** 1 = quick, 2 = normal, 3 = elaborate */
    val effort: Int = 2,
    val ingredients: List<String> = emptyList(),
    val note: I18nText? = null,
    val pairsWith: List<String>? = null,
    val staples: List<String>? = null,
    val party: List<String>? = null,
    val group: String? = null,
    val combo: String? = null,
    val recipe: Recipe? = null,
    val custom: Boolean? = null,
    val takeaway: Boolean? = null,
    val url: String? = null,
    val place: String? = null,
    val address: String? = null,
    val phone: String? = null,
    val rating: Int? = null,
) {
    fun label(lang: Lang): String = name[lang].ifEmpty { name.orig }
    fun has(tag: String) = tag in tags
}

object Kind {
    const val DISH = "dish"
    const val SIDE = "side"
    const val COMBO = "combo"
    const val EATOUT = "eatout"
    const val PARTY = "party"
    const val BAKE = "bake"
}

val EXTRA_MEALS = listOf("breakfast", "lunch", "coffee")
/** "dinner" plus the extra meals */
val ALL_MEALS = listOf("dinner") + EXTRA_MEALS

@Serializable
data class DayEntry(
    val dishes: List<String> = emptyList(),
    val meals: Map<String, List<String>>? = null,
    val labels: List<String>? = null,
    val note: String? = null,
    val done: Boolean? = null,
) {
    val isDone get() = done == true
}

@Serializable
data class PartyGuest(val id: String, val name: String = "", val note: String? = null)

@Serializable
data class PartyItem(
    val id: String,
    val course: String = "main",
    val dishId: String? = null,
    val text: String? = null,
    val locked: Boolean? = null,
    val broughtBy: String? = null,
)

@Serializable
data class PartyTodo(val id: String, val phase: String = "week", val text: String = "", val done: Boolean? = null)

@Serializable
data class Party(
    val id: String,
    val title: String = "",
    val date: String = "",
    val time: String? = null,
    val format: String = "menu",
    val adults: Int = 0,
    val kids: Int = 0,
    val veggie: Int = 0,
    val vegan: Int = 0,
    val allergies: String? = null,
    val guests: List<PartyGuest> = emptyList(),
    val items: List<PartyItem> = emptyList(),
    val shopping: Map<String, Boolean> = emptyMap(),
    val extraShopping: List<String> = emptyList(),
    val todos: List<PartyTodo> = emptyList(),
    val note: String? = null,
)

@Serializable
data class FavLabel(val id: String, val name: String = "", val color: Int = 0)

@Serializable
data class FamilySettings(
    val adults: Int = 2,
    val kids: Int = 2,
    val avoidDays: Int = 10,
    val builderCounts: Map<String, Map<String, Int>>? = null,
)

@Serializable
data class FamilyState(
    val favorites: List<String> = emptyList(),
    val plan: Map<String, DayEntry> = emptyMap(),
    val customDishes: Map<String, Dish> = emptyMap(),
    val settings: FamilySettings = FamilySettings(),
    val parties: Map<String, Party> = emptyMap(),
    val labels: List<FavLabel> = emptyList(),
    val labelFavorites: Map<String, List<String>> = emptyMap(),
    val labelDislikes: Map<String, List<String>> = emptyMap(),
    val hiddenDishes: List<String> = emptyList(),
)

fun emptyState() = FamilyState()

/** All dish ids of a day, dinner and the other meals. */
fun dayDishIds(entry: DayEntry?): List<String> {
    if (entry == null) return emptyList()
    return entry.dishes + EXTRA_MEALS.flatMap { entry.meals?.get(it) ?: emptyList() }
}

/** Dish ids of one meal ("dinner" = entry.dishes). */
fun mealIds(entry: DayEntry?, meal: String): List<String> =
    if (meal == "dinner") entry?.dishes ?: emptyList() else entry?.meals?.get(meal) ?: emptyList()
