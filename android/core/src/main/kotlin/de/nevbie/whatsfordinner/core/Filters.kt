package de.nevbie.whatsfordinner.core

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonPrimitive

/** Port of src/logic/filters.ts. */
@Serializable
data class Filters(
    /** any | veggie | vegan */
    val diet: String = "any",
    val kids: Boolean = false,
    val noSpicy: Boolean = false,
    val maxEffort: Int = 3,
    val favoritesOnly: Boolean = false,
    val favLabels: List<String> = emptyList(),
    val sweetOnly: Boolean = false,
    val noDislikes: Boolean = false,
    val eatOut: Boolean = false,
    val cuisines: List<String> = emptyList(),
    val regions: List<String> = emptyList(),
    val staples: List<String> = emptyList(),
)

val DEFAULT_FILTERS = Filters()

object FilterLogic {
    /** Finer cuisine choice on top of the region chips (several can be picked). */
    val CUISINE_GROUPS = listOf("german", "italian", "french", "spanish", "oriental", "american", "chinese", "indian", "eastasia")

    private val GROUP_CUISINES = mapOf(
        "german" to listOf("german", "austrian", "swiss"),
        "italian" to listOf("italian"),
        "french" to listOf("french"),
        "spanish" to listOf("spanish"),
        "oriental" to listOf("greek", "turkish", "mideast", "persian", "northafrican", "georgian", "eastern"),
        "american" to listOf("american", "mexican"),
        "chinese" to listOf("chinese"),
        "indian" to listOf("indian"),
        "eastasia" to listOf("thai", "vietnamese", "japanese", "korean", "fusion"),
    )

    /** Merge stored filters (possibly from an older app version) with the defaults. */
    fun normalizeFilters(raw: String?): Filters {
        if (raw.isNullOrBlank()) return DEFAULT_FILTERS
        return try {
            val obj = AppJson.parseToJsonElement(raw) as? JsonObject ?: return DEFAULT_FILTERS
            var f = AppJson.decodeFromJsonElement(Filters.serializer(), obj)
            // older versions stored a single cuisine
            val cuisine = runCatching { obj["cuisine"]?.jsonPrimitive?.content }.getOrNull()
            if (cuisine != null && cuisine in CUISINE_GROUPS && f.cuisines.isEmpty()) f = f.copy(cuisines = listOf(cuisine))
            f.copy(cuisines = f.cuisines.filter { it in CUISINE_GROUPS })
        } catch (e: Exception) {
            DEFAULT_FILTERS
        }
    }

    fun inCuisineGroups(dish: Dish, groups: List<String>): Boolean =
        groups.isEmpty() || groups.any { g -> GROUP_CUISINES[g]?.contains(dish.cuisine) == true }

    /** Diet / kids / spice / effort checks shared by suggestions, the dish list and the meal builder. */
    fun matchesDiet(dish: Dish, diet: String, kids: Boolean, noSpicy: Boolean, maxEffort: Int, sweetOnly: Boolean = false): Boolean {
        if (dish.kind == Kind.EATOUT || dish.kind == Kind.COMBO) return true
        if (diet == "veggie" && !dish.has("veggie")) return false
        if (diet == "vegan" && !dish.has("vegan")) return false
        if (kids && !dish.has("kids")) return false
        if (noSpicy && dish.has("spicy")) return false
        if (sweetOnly && !dish.has("sweet")) return false
        if (dish.effort > maxEffort) return false
        return true
    }

    fun isLabelFavorite(dishId: String, labelIds: List<String>, labelFavorites: Map<String, List<String>>): Boolean =
        labelIds.any { labelFavorites[it]?.contains(dishId) == true }

    /** Labels (people) that don't like the dish. */
    fun dislikersOf(dishId: String, labelDislikes: Map<String, List<String>>): List<String> =
        labelDislikes.filter { (_, ids) -> dishId in ids }.map { it.key }

    fun matchesFilters(
        dish: Dish,
        f: Filters,
        favorites: Set<String>,
        labelFavorites: Map<String, List<String>> = emptyMap(),
        labelDislikes: Map<String, List<String>> = emptyMap(),
    ): Boolean {
        val dislikers = dislikersOf(dish.id, labelDislikes)
        if (f.noDislikes && dislikers.isNotEmpty()) return false
        // cooking for someone: skip what they don't like
        if (f.favLabels.any { it in dislikers }) return false
        val favLabelsOk = f.favLabels.isEmpty() || isLabelFavorite(dish.id, f.favLabels, labelFavorites)
        if (dish.kind == Kind.EATOUT) return f.eatOut && (!f.favoritesOnly || dish.id in favorites) && favLabelsOk
        if (f.favoritesOnly && dish.id !in favorites) return false
        if (!favLabelsOk) return false
        if (f.sweetOnly && dish.kind == Kind.COMBO) return false
        if (f.regions.isNotEmpty()) {
            val region = Classify.regionOf(dish)
            if (region == null || region !in f.regions) return false
        }
        if (f.staples.isNotEmpty() && Classify.staplesOf(dish).none { it in f.staples }) return false
        if (!inCuisineGroups(dish, f.cuisines)) return false
        return matchesDiet(dish, f.diet, f.kids, f.noSpicy, f.maxEffort, f.sweetOnly)
    }

    /** Number of filters that differ from the defaults (badge on the filter button). */
    fun activeFilterCount(f: Filters): Int =
        (if (f.diet != "any") 1 else 0) + f.regions.size + f.staples.size + f.cuisines.size +
            (if (f.kids) 1 else 0) + (if (f.noSpicy) 1 else 0) + (if (f.maxEffort < 3) 1 else 0) +
            (if (f.favoritesOnly) 1 else 0) + (if (f.sweetOnly) 1 else 0) + (if (f.noDislikes) 1 else 0) +
            f.favLabels.size + (if (f.eatOut) 1 else 0)

    fun <T> toggleIn(list: List<T>, item: T): List<T> = if (item in list) list - item else list + item
}
