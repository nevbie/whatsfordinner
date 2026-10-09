package de.nevbie.whatsfordinner.core

import kotlin.math.max
import kotlin.math.min

class PartySuggestCtx(val pool: List<Dish>, val favorites: Set<String>, val today: String, val rng: Rng = defaultRng)

data class ShoppingEntry(val key: String, val dishIds: List<String>)

/** Port of src/logic/party.ts – party templates, menu suggestions, shopping list and checklist. */
object PartyLogic {
    val PARTY_COURSES = listOf("starter", "salad", "main", "side", "snack", "dip", "dessert", "cake", "drink")
    val PARTY_FORMATS = listOf("menu", "buffet", "finger", "interactive")
    val TODO_PHASES = listOf("week", "daybefore", "morning", "before")

    /** Last day of each to-do phase relative to the party date. */
    val PHASE_OFFSET = mapOf("week" to -7, "daybefore" to -1, "morning" to 0, "before" to 0)

    /** Courses where vegetarian/vegan guests need at least one option. */
    private val CORE = listOf("starter", "salad", "main", "snack")

    /** Party roles of a dish – explicit for party dishes, derived for the everyday ones. */
    fun partyCoursesOf(d: Dish): List<String> {
        d.party?.let { return it }
        if (d.kind == Kind.EATOUT || d.kind == Kind.COMBO) return emptyList()
        if (d.kind == Kind.BAKE) return when {
            d.course == "bkCake" || d.course == "bkPastry" -> listOf("cake")
            d.course == "bkDessert" -> listOf("dessert")
            d.course != null -> emptyList()
            else -> listOf("cake", "dessert")
        }
        if (d.kind == Kind.DISH) return if (d.has("sweet")) listOf("dessert") else listOf("main")
        return when (d.course) {
            "raita", "chutney" -> listOf("dip")
            "salad", "cold" -> listOf("salad")
            "snack" -> listOf("snack")
            "dessert" -> listOf("dessert")
            "drink" -> listOf("drink")
            "soup" -> listOf("starter")
            "bread", "rice", "staple", "side" -> listOf("side")
            else -> emptyList()
        }
    }

    /** Raclette, fondue, BBQ, hot pot, tacos … */
    fun isInteractive(d: Dish): Boolean = d.kind == Kind.DISH && d.has("social") && !d.has("sweet")

    fun guestTotal(p: Party) = p.adults + p.kids

    private fun r(x: Double): Int = kotlin.math.floor(x + 0.5).toInt()

    /** How many dishes of each course a format needs for the number of guests. */
    fun partyTemplate(format: String, total: Int): Map<String, Int> = when (format) {
        "buffet" -> mapOf(
            "main" to max(2, r(total / 6.0)), "salad" to max(2, r(total / 8.0)), "side" to 1, "dip" to 1,
            "dessert" to max(1, r(total / 10.0)), "cake" to if (total >= 10) 1 else 0, "drink" to 1,
        )
        "finger" -> mapOf("snack" to min(10, max(4, r(total / 3.0))), "dip" to 2, "dessert" to 1, "cake" to 1, "drink" to 1)
        "interactive" -> mapOf("main" to 1, "salad" to 2, "side" to 1, "dip" to 2, "dessert" to 1, "drink" to 1)
        else -> mapOf("starter" to 1, "main" to 1, "side" to 1, "dessert" to 1, "drink" to 1)
    }

    private const val ALPHANUM = "0123456789abcdefghijklmnopqrstuvwxyz"
    fun uid(): String = (1..8).map { ALPHANUM[(Math.random() * 36).toInt()] }.joinToString("")

    private fun weightFor(d: Dish, course: String, party: Party, ctx: PartySuggestCtx): Double {
        var w = 1.0
        if (d.id in ctx.favorites) w *= 2
        if (party.kids > 0 && d.has("kids")) w *= 1.5
        if (party.kids > 0 && d.has("spicy")) w *= 0.3
        // prefer real party food over everyday desserts
        if (course != "main") w *= if (d.kind == Kind.PARTY || d.kind == Kind.BAKE) 1.5 else 0.4
        if (party.format == "buffet" && d.effort == 3) w *= 0.5
        if (course == "main") {
            if (party.format == "buffet" && d.has("oven")) w *= 2.5
            if (d.cuisine == "chinese" || d.cuisine == "indian") w *= 0.3
            if (party.format == "menu" && d.effort == 1) w *= 0.5
        }
        val s = Suggest.season(party.date.ifEmpty { ctx.today })
        if (s == "summer" && d.has("winter")) w *= 0.2
        if (s == "winter" && d.has("summer")) w *= 0.2
        return w
    }

    private fun pickWeighted(cands: List<Dish>, course: String, party: Party, ctx: PartySuggestCtx): Dish? {
        if (cands.isEmpty()) return null
        val ws = cands.map { weightFor(it, course, party, ctx) }
        var rr = ctx.rng() * ws.sum()
        for (i in cands.indices) {
            rr -= ws[i]
            if (rr < 0) return cands[i]
        }
        return cands.last()
    }

    /**
     * Suggest a menu for the party. Items chosen by hand, typed in, or brought by a guest are kept;
     * the rest is (re-)filled according to the format and the guests' diets.
     */
    fun suggestPartyItems(party: Party, ctx: PartySuggestCtx): List<PartyItem> {
        val total = guestTotal(party)
        val kept = party.items.filter { it.locked == true || it.text != null || it.broughtBy != null }
        val used = kept.mapNotNull { it.dishId }.toMutableSet()
        val byId = ctx.pool.associateBy { it.id }
        val tpl = partyTemplate(party.format, total)
        val vegNeed = party.veggie + party.vegan
        val everyoneVeg = total > 0 && vegNeed >= total
        val everyoneVegan = total > 0 && party.vegan >= total
        val out = kept.toMutableList()

        for (course in PARTY_COURSES) {
            var count = tpl[course] ?: 0
            val keptHere = kept.filter { it.course == course }.map { i -> i.dishId?.let { byId[it] } }
            // a menu with one main gets a vegetarian alternative when some guests need it
            if (party.format == "menu" && course == "main" && vegNeed > 0 && !everyoneVeg) count = 2
            count -= keptHere.size
            if (count <= 0) continue

            var cands = ctx.pool.filter { it.id !in used && course in partyCoursesOf(it) }
            if (party.format == "interactive" && course == "main") cands = cands.filter { isInteractive(it) }
            else if (course == "main") cands = cands.filter { !isInteractive(it) }
            if (everyoneVegan) cands = cands.filter { it.has("vegan") }
            else if (everyoneVeg) cands = cands.filter { it.has("veggie") }

            val keptVegan = keptHere.any { it?.has("vegan") == true }
            val keptVeggie = keptHere.any { it?.has("veggie") == true }
            val needVegan = party.vegan > 0 && course in CORE && !keptVegan
            val needVeggie = vegNeed > 0 && course in CORE && !keptVeggie && !needVegan

            for (n in 0 until count) {
                val free = cands.filter { it.id !in used }
                var pool = free
                if (n == 0 && needVegan) pool = free.filter { it.has("vegan") }
                else if (n == 0 && needVeggie) pool = free.filter { it.has("veggie") }
                val dish = pickWeighted(pool.ifEmpty { free }, course, party, ctx) ?: break
                used.add(dish.id)
                out.add(PartyItem(id = uid(), course = course, dishId = dish.id))
            }
        }
        return out
    }

    /** Replace one item's dish by another fitting dish of the same course. */
    fun rerollPartyItem(party: Party, itemId: String, ctx: PartySuggestCtx): List<PartyItem> {
        val item = party.items.find { it.id == itemId } ?: return party.items
        val used = party.items.mapNotNull { it.dishId }.toSet()
        val total = guestTotal(party)
        var cands = ctx.pool.filter { it.id !in used && item.course in partyCoursesOf(it) }
        if (party.format == "interactive" && item.course == "main") cands = cands.filter { isInteractive(it) }
        if (total > 0 && party.vegan >= total) cands = cands.filter { it.has("vegan") }
        else if (total > 0 && party.veggie + party.vegan >= total) cands = cands.filter { it.has("veggie") }
        // keep the vegetarian/vegan character of the item it replaces
        val old = item.dishId?.let { id -> ctx.pool.find { it.id == id } }
        if (old?.has("vegan") == true && party.vegan > 0) cands = cands.filter { it.has("vegan") }
        else if (old?.has("veggie") == true && party.veggie + party.vegan > 0) cands = cands.filter { it.has("veggie") }
        val next = pickWeighted(cands, item.course, party, ctx) ?: return party.items
        return party.items.map { if (it.id == itemId) it.copy(dishId = next.id, text = null, locked = null) else it }
    }

    /** Combined ingredient list of everything the family makes themselves (not what guests bring). */
    fun shoppingList(party: Party, byId: Map<String, Dish>): List<ShoppingEntry> {
        val map = LinkedHashMap<String, MutableList<String>>()
        for (item in party.items) {
            if (item.broughtBy != null || item.dishId == null) continue
            val dish = byId[item.dishId]
            for (ing in dish?.ingredients ?: emptyList()) map.getOrPut(ing) { mutableListOf() }.add(item.dishId)
        }
        return map.map { (k, v) -> ShoppingEntry(k, v) }
    }

    private val TODO_TEXT = mapOf(
        "invite" to ("Gäste einladen und nach Allergien/Vorlieben fragen" to "Invite guests and ask about allergies/preferences"),
        "menu" to ("Menü festlegen und verteilen, wer was mitbringt" to "Fix the menu and who brings what"),
        "dry" to ("Getränke und haltbare Zutaten einkaufen" to "Buy drinks and non-perishables"),
        "fresh" to ("Frische Zutaten einkaufen" to "Buy fresh ingredients"),
        "dessert" to ("Nachtisch / Kuchen vorbereiten" to "Prepare dessert / cake"),
        "salads" to ("Dips und Salatdressings vorbereiten" to "Prepare dips and dressings"),
        "chill" to ("Getränke kalt stellen, Eiswürfel machen" to "Chill drinks, make ice cubes"),
        "dishes" to ("Geschirr, Gläser, Besteck und Stühle zählen" to "Count plates, glasses, cutlery and chairs"),
        "device" to ("Raclette-/Fondue-Gerät bzw. Grill und Brennstoff prüfen" to "Check raclette/fondue set or BBQ and fuel"),
        "table" to ("Tisch decken" to "Set the table"),
        "buffet" to ("Buffet aufbauen, Servierlöffel bereitlegen" to "Set up the buffet with serving spoons"),
        "labels" to ("Gerichte beschriften (vegetarisch, Allergene)" to "Label dishes (vegetarian, allergens)"),
        "chop" to ("Gemüse schneiden, Platten anrichten" to "Chop vegetables, arrange platters"),
        "kids" to ("Spielecke / Beschäftigung für Kinder vorbereiten" to "Prepare a play corner for kids"),
        "oven" to ("Ofen vorheizen, Brot aufbacken" to "Preheat oven, warm up bread"),
        "serve" to ("Snacks und Getränke hinstellen" to "Put out snacks and drinks"),
        "music" to ("Musik und Deko" to "Music and decoration"),
    )

    /** Default checklist for a party, in the current UI language. */
    fun defaultTodos(format: String, kids: Int, lang: Lang): List<PartyTodo> {
        val f = format
        val keys = buildList {
            add("week" to "invite"); add("week" to "menu"); add("week" to "dry")
            add("daybefore" to "fresh"); add("daybefore" to "dessert"); add("daybefore" to "salads"); add("daybefore" to "chill"); add("daybefore" to "dishes")
            if (f == "interactive") add("daybefore" to "device")
            add("morning" to if (f == "buffet" || f == "finger") "buffet" else "table")
            if (f == "buffet" || f == "finger") add("morning" to "labels")
            add("morning" to "chop")
            if (kids > 0) add("morning" to "kids")
            add("before" to "oven"); add("before" to "serve"); add("before" to "music")
        }
        return keys.map { (phase, k) ->
            val text = TODO_TEXT.getValue(k)
            PartyTodo(id = uid(), phase = phase, text = if (lang == "de") text.first else text.second)
        }
    }

    fun newParty(date: String, settings: FamilySettings, lang: Lang): Party {
        val base = Party(
            id = "p-${System.currentTimeMillis().toString(36)}${uid().take(4)}",
            title = if (lang == "de") "Einladung" else "Party",
            date = date,
            format = "menu",
            adults = settings.adults + 4,
            kids = settings.kids,
        )
        return base.copy(todos = defaultTodos(base.format, base.kids, lang))
    }
}
