package de.nevbie.whatsfordinner.core

import java.text.Collator
import java.util.Locale

/** Last-eaten dates, eat counts and upcoming plan dates (useDishStats.ts). */
class DishStats(plan: Map<String, DayEntry>, val today: String) {
    val last: Map<String, String> = Suggest.lastEaten(plan, today)
    val counts: Map<String, Int>
    val next: Map<String, String>

    init {
        val c = HashMap<String, Int>()
        val n = HashMap<String, String>()
        for ((date, entry) in plan) for (id in dayDishIds(entry)) {
            if (date <= today) c[id] = (c[id] ?: 0) + 1
            else if (n[id] == null || n.getValue(id) > date) n[id] = date
        }
        counts = c
        next = n
    }
}

/** Search, sorting and list sections of the dish list (DishesView.tsx). */
object DishLists {
    val AREAS = listOf("all", "food", "eatout", "side", "party", "bake", "drink")

    fun searchText(d: Dish, catalog: Catalog): String {
        val ings = d.ingredients.flatMap { listOf(catalog.ingredientName(it, "de"), catalog.ingredientName(it, "en")) }
        return (listOf(d.name.orig, d.name.roman ?: "", d.name.de, d.name.en) + ings).joinToString(" ").lowercase()
    }

    fun matchesQuery(d: Dish, q: String, catalog: Catalog): Boolean {
        val text = searchText(d, catalog)
        return q.lowercase().split(Regex("\\s+")).filter { it.isNotEmpty() }.all { it in text }
    }

    fun collator(lang: Lang): Collator = Collator.getInstance(Locale.forLanguageTag(lang)).apply { strength = Collator.SECONDARY }

    fun nameComparator(lang: Lang): Comparator<Dish> {
        val c = collator(lang)
        return Comparator { a, b -> c.compare(a.label(lang), b.label(lang)) }
    }

    /** Which section of the list a dish belongs to. */
    fun areaOf(d: Dish): String = when {
        d.kind == Kind.EATOUT -> "eatout"
        d.course == "drink" || d.party?.contains("drink") == true -> "drink"
        d.kind == Kind.BAKE -> "bake"
        d.kind == Kind.PARTY -> "party"
        d.kind == Kind.SIDE -> "side"
        else -> "food"
    }

    /** The filtered and sorted dish list of the Gerichte tab. */
    fun dishList(
        dishes: List<Dish>, state: FamilyState, filters: Filters, query: String, area: String, sort: String,
        last: Map<String, String>, lang: Lang, catalog: Catalog,
    ): List<Dish> {
        val favs = state.favorites.toSet()
        val out = dishes.filter { d ->
            if (area != "all" && areaOf(d) != area) return@filter false
            if (d.kind == Kind.EATOUT) {
                if (filters.favoritesOnly && d.id !in favs) return@filter false
            } else if (!FilterLogic.matchesFilters(d, filters, favs, state.labelFavorites, state.labelDislikes)) return@filter false
            query.isBlank() || matchesQuery(d, query, catalog)
        }
        val byName = nameComparator(lang)
        return if (sort == "recent") out.sortedWith(compareBy<Dish> { last[it.id] ?: "" }.then(byName)) else out.sortedWith(byName)
    }

    private fun isExtra(d: Dish) = d.kind == Kind.SIDE || d.kind == Kind.PARTY || d.kind == Kind.BAKE

    /** Dish picker order: favourites first, then dinners before sides/party/baking, then A–Z. */
    fun pickerList(dishes: List<Dish>, state: FamilyState, filter: ((Dish) -> Boolean)?, query: String, lang: Lang, catalog: Catalog): List<Dish> {
        val favs = state.favorites.toSet()
        return dishes
            .filter { (filter?.invoke(it) ?: true) && (query.isBlank() || matchesQuery(it, query, catalog)) }
            .sortedWith(compareBy<Dish>({ if (it.id in favs) 0 else 1 }, { if (isExtra(it)) 1 else 0 }).then(nameComparator(lang)))
    }

    /** Past days with dinner dishes, newest first (HistoryView). */
    fun pastDays(plan: Map<String, DayEntry>, today: String): List<Pair<String, DayEntry>> =
        plan.entries.filter { it.key <= today && it.value.dishes.isNotEmpty() }.sortedByDescending { it.key }.map { it.key to it.value }

    /** Most often eaten dishes (no sides), top 10. */
    fun topDishes(counts: Map<String, Int>, byId: Map<String, Dish>): List<Pair<String, Int>> =
        counts.entries.filter { byId[it.key]?.kind != Kind.SIDE }.sortedByDescending { it.value }.take(10).map { it.key to it.value }

    /** Map search link for a restaurant (DishDetail.tsx). */
    fun mapsUrl(d: Dish): String {
        val q = if (d.address != null) "${d.name.orig}, ${d.address}" else "${d.name.orig} ${d.place ?: ""}".trim()
        return "https://www.google.com/maps/search/${java.net.URLEncoder.encode(q, "UTF-8").replace("+", "%20")}/@49.075,8.39,13z"
    }
}
