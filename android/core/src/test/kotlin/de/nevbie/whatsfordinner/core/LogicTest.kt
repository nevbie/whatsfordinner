package de.nevbie.whatsfordinner.core

import de.nevbie.whatsfordinner.core.TestData.TODAY
import de.nevbie.whatsfordinner.core.TestData.builtin
import de.nevbie.whatsfordinner.core.TestData.byId
import de.nevbie.whatsfordinner.core.TestData.seeded
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

/** Port of src/__tests__/logic.test.ts. */
class LogicTest {
    private fun opts(type: String = "chinese", adults: Int = 2, kids: Int = 2, diet: String = "any", drink: Boolean = false, counts: Map<String, Int>? = null) =
        ComboOptions(type = type, adults = adults, kids = kids, diet = diet, drink = drink, counts = counts)

    private fun ctx(o: ComboOptions) = PickContext(o, emptySet())
    private fun dishesOf(entries: List<ComboEntry>) = entries.map { byId.getValue(it.dishId!!) }
    private fun f(block: Filters.() -> Filters) = DEFAULT_FILTERS.block()

    // ---- dates ----
    @Test fun computesTheMondayOfAWeek() {
        assertEquals("2026-10-05", Dates.weekStart("2026-10-06"))
        assertEquals("2026-10-05", Dates.weekStart("2026-10-11"))
        assertEquals("2027-01-01", Dates.addDays("2026-12-31", 1))
        assertEquals("2026-10-10", Dates.nextSaturday("2026-10-06"))
        assertEquals("2026-10-10", Dates.nextSaturday("2026-10-10"))
    }

    // ---- suggest ----
    @Test fun neverSuggestsSidesRecentlyEatenOrPlannedDishes() {
        val state = emptyState().copy(plan = mapOf(Dates.addDays(TODAY, -3) to DayEntry(listOf("lasagne")), Dates.addDays(TODAY, 2) to DayEntry(listOf("pizza"))))
        for (seed in 1L until 30) {
            val out = Suggest.suggest(builtin, SuggestContext(state, DEFAULT_FILTERS, TODAY), 5, emptySet(), seeded(seed))
            assertEquals(5, out.size)
            for (d in out) {
                assertNotEquals(Kind.SIDE, d.kind)
                assertNotEquals(Kind.EATOUT, d.kind)
                assertFalse(d.id in listOf("lasagne", "pizza"))
            }
        }
    }

    @Test fun respectsDietFilters() {
        val out = Suggest.suggest(builtin, SuggestContext(emptyState(), f { copy(diet = "vegan") }, TODAY), 20, emptySet(), seeded(3))
        for (d in out) if (d.kind == Kind.DISH) assertTrue(d.has("vegan"), d.id)
    }

    @Test fun onlySuggestsRestaurantsWhenEatingOut() {
        val out = Suggest.suggest(builtin, SuggestContext(emptyState(), f { copy(eatOut = true) }, TODAY), 300, emptySet(), seeded(5))
        assertTrue(out.any { it.kind == Kind.EATOUT })
    }

    // ---- combos ----
    @Test fun scalesChineseMeals() {
        assertEquals(3, Combos.chineseDishCount(2, 2))
        assertEquals(4, Combos.chineseDishCount(3, 2))
        assertEquals(2, Combos.chineseDishCount(1, 0))
    }

    @Test fun buildsACompleteChineseMeal() {
        for (seed in 1L until 50) {
            val o = opts(adults = 3, kids = 2)
            val ds = dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(seed)))
            assertEquals(5, ds.size)
            assertEquals("staple", ds.last().course)
            assertTrue(ds.count { it.has("spicy") } <= 1)
            val mains = ds.filter { it.course != "staple" }.map { it.ingredients[0] }
            assertEquals(mains.size, mains.toSet().size)
        }
    }

    @Test fun buildsAVegetarianThali() {
        for (seed in 1L until 30) {
            val o = opts(type = "indian", diet = "veggie", drink = true)
            val ds = dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(seed)))
            val courses = ds.map { it.course }
            assertEquals(listOf("dal", "curry", "sabzi", "raita"), courses.take(4))
            assertEquals(listOf("bread", "rice", "drink"), courses.takeLast(3))
            assertEquals(8, courses.size)
            for (d in ds) assertTrue(d.has("veggie"), d.id)
        }
    }

    @Test fun keepsASeedLockedAndRerollsOneEntry() {
        val o = opts()
        val seed = byId.getValue("gongbao-jiding")
        val filled = Combos.fillEntries(Combos.initialEntries(o, seed), builtin, ctx(o), seeded(7))
        assertEquals("gongbao-jiding", filled[0].dishId)
        val rerolled = Combos.rerollEntry(filled, 1, builtin, ctx(o), seeded(8))
        assertEquals("gongbao-jiding", rerolled[0].dishId)
        assertNotEquals(filled[1].dishId, rerolled[1].dishId)
        assertEquals(filled[2].dishId, rerolled[2].dishId)
    }

    @Test fun pairsOneDishMealsWithASide() {
        val o = opts()
        val filled = Combos.fillEntries(Combos.initialEntries(o, byId["jiaozi"]), builtin, ctx(o), seeded(2))
        assertEquals("jiaozi", filled[0].dishId)
        assertEquals(2, filled.size)
    }

    // ---- region & staples ----
    @Test fun classifiesStaples() {
        assertEquals(listOf("pasta"), Classify.staplesOf(byId.getValue("spaghetti-bolognese")))
        assertEquals(listOf("dough"), Classify.staplesOf(byId.getValue("pizza")))
        assertEquals(listOf("dough"), Classify.staplesOf(byId.getValue("jiaozi")))
        assertEquals(listOf("potatoes"), Classify.staplesOf(byId.getValue("raclette")))
        assertEquals(listOf("bread", "rice"), Classify.staplesOf(byId.getValue("palak-paneer")))
        assertEquals(listOf("rice"), Classify.staplesOf(byId.getValue("mapo-doufu")))
    }

    @Test fun filtersByRegion() {
        val favs = emptySet<String>()
        assertTrue(FilterLogic.matchesFilters(byId.getValue("lasagne"), f { copy(regions = listOf("europe")) }, favs))
        assertFalse(FilterLogic.matchesFilters(byId.getValue("lasagne"), f { copy(regions = listOf("asia")) }, favs))
        assertTrue(FilterLogic.matchesFilters(byId.getValue("chinesisch"), f { copy(regions = listOf("asia")) }, favs))
        assertTrue(FilterLogic.matchesFilters(byId.getValue("falafel"), f { copy(regions = listOf("europe", "other")) }, favs))
    }

    @Test fun filtersByStaple() {
        val favs = emptySet<String>()
        assertTrue(FilterLogic.matchesFilters(byId.getValue("lasagne"), f { copy(staples = listOf("rice", "pasta")) }, favs))
        assertFalse(FilterLogic.matchesFilters(byId.getValue("lasagne"), f { copy(staples = listOf("potatoes")) }, favs))
        val out = Suggest.suggest(builtin, SuggestContext(emptyState(), f { copy(staples = listOf("potatoes"), regions = listOf("europe")) }, TODAY), 30, emptySet(), seeded(4))
        assertTrue(out.size > 10)
        for (d in out) {
            assertTrue("potatoes" in Classify.staplesOf(d), d.id)
            assertEquals("europe", Classify.regionOf(d))
        }
    }

    @Test fun ignoresOutdatedStoredFilterValues() {
        assertEquals(emptyList(), FilterLogic.normalizeFilters("""{"cuisine":"european"}""").cuisines)
        assertEquals(listOf("italian"), FilterLogic.normalizeFilters("""{"cuisine":"italian"}""").cuisines)
        assertEquals(emptyList(), FilterLogic.normalizeFilters("{}").staples)
        assertEquals(DEFAULT_FILTERS, FilterLogic.normalizeFilters("not json"))
    }

    // ---- party ----
    private fun baseParty() = PartyLogic.newParty("2026-12-12", emptyState().settings, "de")
    private fun pctx(seed: Long) = PartySuggestCtx(builtin, emptySet(), TODAY, seeded(seed))
    private fun itemsDishes(items: List<PartyItem>) = items.map { byId.getValue(it.dishId!!) }

    @Test fun suggestsAFullMenuWithAVegetarianAlternative() {
        for (s in 1L until 20) {
            val p = baseParty().copy(veggie = 2)
            val items = PartyLogic.suggestPartyItems(p, pctx(s))
            val courses = items.map { it.course }
            assertEquals(2, courses.count { it == "main" })
            for (c in listOf("starter", "side", "dessert", "drink")) assertTrue(c in courses, c)
            assertTrue(itemsDishes(items.filter { it.course == "main" }).any { it.has("veggie") })
            assertEquals(items.size, items.map { it.dishId }.toSet().size)
        }
    }

    @Test fun makesEverythingVeganWhenAllGuestsAreVegan() {
        val p = baseParty().copy(format = "buffet", adults = 6, kids = 0, vegan = 6)
        for (d in itemsDishes(PartyLogic.suggestPartyItems(p, pctx(3)))) assertTrue(d.has("vegan"), d.id)
    }

    @Test fun usesInteractiveMains() {
        val p = baseParty().copy(format = "interactive")
        val main = PartyLogic.suggestPartyItems(p, pctx(5)).first { it.course == "main" }
        assertTrue(byId.getValue(main.dishId!!).has("social"))
    }

    @Test fun keepsHandPickedAndBroughtItems() {
        val p = baseParty().copy(items = listOf(PartyItem("x", "dessert", dishId = "tiramisu", locked = true), PartyItem("y", "drink", text = "Wein", broughtBy = "g1")))
        val items = PartyLogic.suggestPartyItems(p, pctx(9))
        assertEquals(listOf("tiramisu"), items.filter { it.course == "dessert" }.map { it.dishId })
        assertEquals(1, items.count { it.course == "drink" })
    }

    @Test fun buildsAShoppingListWithoutWhatGuestsBring() {
        val p = baseParty().copy(items = listOf(PartyItem("a", "dessert", dishId = "tiramisu"), PartyItem("b", "dip", dishId = "guacamole", broughtBy = "g1")))
        val keys = PartyLogic.shoppingList(p, byId).map { it.key }
        assertTrue("mascarpone" in keys)
        assertFalse("avocado" in keys)
    }

    @Test fun createsADefaultChecklist() {
        val text = PartyLogic.defaultTodos("interactive", 2, "en").joinToString { it.text }
        assertTrue(Regex("raclette", RegexOption.IGNORE_CASE).containsMatchIn(text))
    }

    // ---- sweet ----
    @Test fun sweetFilterShowsOnlySweetDishes() {
        val sf = f { copy(sweetOnly = true) }
        val sweet = builtin.filter { it.kind == Kind.DISH && FilterLogic.matchesFilters(it, sf, emptySet()) }.map { it.id }
        assertTrue(sweet.containsAll(listOf("griessbrei", "arme-ritter", "kaiserschmarrn", "milchreis")))
        for (id in sweet) assertTrue(byId.getValue(id).has("sweet"))
        assertFalse(FilterLogic.matchesFilters(byId.getValue("chinesisch"), sf, emptySet()))
    }

    // ---- labels & variants ----
    private fun withLabels() = emptyState().copy(
        labels = listOf(FavLabel("e", "Eric", 0), FavLabel("cj", "C&J", 1)),
        labelFavorites = mapOf("e" to listOf("lasagne", "pizza"), "cj" to listOf("kaesespaetzle")),
    )

    @Test fun filtersByLabelFavourites() {
        val s = withLabels()
        val lf = f { copy(favLabels = listOf("cj")) }
        assertTrue(FilterLogic.matchesFilters(byId.getValue("kaesespaetzle"), lf, emptySet(), s.labelFavorites))
        assertFalse(FilterLogic.matchesFilters(byId.getValue("lasagne"), lf, emptySet(), s.labelFavorites))
    }

    @Test fun boostsTheLabelThatWaitedLongest() {
        val s = withLabels().copy(plan = mapOf(Dates.addDays(TODAY, -2) to DayEntry(listOf("lasagne"))))
        assertEquals("cj", Suggest.waitingLabel(s, Suggest.lastEaten(s.plan, TODAY)))
    }

    @Test fun neverSuggestsTwoVariantsAtOnce() {
        val sf = f { copy(sweetOnly = true) }
        for (seed in 1L until 40) {
            val groups = Suggest.suggest(builtin, SuggestContext(emptyState(), sf, TODAY), 6, emptySet(), seeded(seed)).mapNotNull { it.group }
            assertEquals(groups.size, groups.toSet().size)
        }
    }

    @Test fun keepsVariantsInOneGroup() {
        assertEquals("schupfnudeln", byId.getValue("schupfnudeln").group)
        assertEquals("schupfnudeln", byId.getValue("schupfnudeln-apfelmus").group)
        assertTrue(byId.getValue("fischstaebchen-selbst").name.orig.contains("selbstgemacht"))
        assertNotNull(byId["haehnchen-pilz-mais"])
    }

    // ---- tapas / abendbrot / teller / salad ----
    @Test fun buildsATapasEvening() {
        for (seed in 1L until 30) {
            val o = opts(type = "tapas")
            val ds = dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(seed)))
            assertEquals(5, ds.size)
            for (c in listOf("tapaVeg", "tapaMeat", "tapaFish", "tapaBread")) assertTrue(c in ds.map { it.course })
            assertEquals(5, ds.map { it.id }.toSet().size)
        }
        assertEquals("tapas", byId.getValue("tapas").combo)
        assertEquals("Tortilla de patatas", byId.getValue("tortilla-espanola").name.orig)
    }

    @Test fun buildsAbendbrot() {
        for (seed in 1L until 30) {
            val o = opts(type = "abendbrot")
            val courses = dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(seed))).map { it.course }
            for (c in listOf("abBread", "abCheese", "abSpread", "abVeg", "abExtra")) assertTrue(c in courses)
            assertTrue(courses.any { it == "abMeat" || it == "abFish" })
        }
        val o = opts(type = "abendbrot", diet = "veggie")
        for (d in dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(3)))) assertTrue(d.has("veggie"))
        assertEquals("abendbrot", byId.getValue("brotzeit").combo)
    }

    @Test fun buildsAPlate() {
        val o = opts(type = "teller")
        for (seed in 1L until 20) {
            val ds = dishesOf(Combos.fillEntries(Combos.initialEntries(o, byId["schnitzel"]), builtin, ctx(o), seeded(seed)))
            assertEquals(listOf("plMain", "plStarch", "plVeg"), ds.map { it.course })
            assertEquals("schnitzel", ds[0].id)
        }
    }

    @Test fun buildsASalad() {
        val o = opts(type = "salad")
        val ds = dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(4)))
        assertEquals(listOf("slBase", "slExtra", "slExtra", "slTopping", "slDressing"), ds.map { it.course })
        assertNotEquals(ds[1].id, ds[2].id)
    }

    @Test fun neverSuggestsBakingForDinner() {
        val out = Suggest.suggest(builtin, SuggestContext(emptyState(), DEFAULT_FILTERS, TODAY), 400, emptySet(), seeded(9))
        assertFalse(out.any { it.kind == Kind.BAKE })
    }

    @Test fun offersCakesToThePartyPlanner() {
        val party = PartyLogic.newParty("2026-10-10", emptyState().settings, "de").copy(format = "buffet", adults = 12)
        val items = PartyLogic.suggestPartyItems(party, PartySuggestCtx(builtin, emptySet(), TODAY, seeded(2)))
        val cake = items.find { it.course == "cake" }
        assertEquals(Kind.BAKE, cake?.dishId?.let { byId[it]?.kind })
    }

    @Test fun attachesFamilyRecipes() {
        for (id in listOf("kaesekuchen", "kaiserschmarrn", "waffeln", "haehnchen-suesskartoffel")) assertNotNull(byId[id]?.recipe, id)
    }

    // ---- composition & meals ----
    @Test fun buildsSlotsFromAnOwnComposition() {
        val o = opts(type = "salad", counts = mapOf("slBase" to 1, "slExtra" to 3, "slTopping" to 0, "slDressing" to 1))
        val ds = dishesOf(Combos.fillEntries(Combos.initialEntries(o), builtin, ctx(o), seeded(3)))
        assertEquals(listOf("slBase", "slExtra", "slExtra", "slExtra", "slDressing"), ds.map { it.course })
    }

    @Test fun showsTheDefaultCompositionAsCounts() {
        assertEquals(mapOf("slBase" to 1, "slExtra" to 2, "slTopping" to 1, "slDressing" to 1), Combos.defaultCounts(opts(type = "salad")))
        assertEquals(mapOf("main" to 1, "veg" to 1, "soup" to 1, "staple" to 1), Combos.defaultCounts(opts()))
    }

    @Test fun countsLunchAndCoffeeAsEaten() {
        val plan = mapOf("2026-03-01" to DayEntry(listOf("lasagne"), meals = mapOf("lunch" to listOf("minestrone"), "coffee" to listOf("kaesekuchen"))))
        val last = Suggest.lastEaten(plan, TODAY)
        assertEquals("2026-03-01", last["minestrone"])
        assertEquals("2026-03-01", last["kaesekuchen"])
    }

    // ---- dislikes ----
    @Test fun suggestsDislikedDishesMuchLess() {
        val state = emptyState().copy(labels = listOf(FavLabel("j", "J", 0)), labelDislikes = mapOf("j" to listOf("lasagne")))
        val lasagne = byId.getValue("lasagne")
        val ctxS = SuggestContext(state, DEFAULT_FILTERS, TODAY)
        val ctxN = SuggestContext(emptyState(), DEFAULT_FILTERS, TODAY)
        assertTrue(Suggest.weight(lasagne, ctxS, emptyMap(), emptySet()) < Suggest.weight(lasagne, ctxN, emptyMap(), emptySet()) * 0.2)
        assertEquals(0.0, Suggest.weight(lasagne, SuggestContext(state, f { copy(favLabels = listOf("j")) }, TODAY), emptyMap(), emptySet()))
        assertEquals(0.0, Suggest.weight(lasagne, SuggestContext(state, f { copy(noDislikes = true) }, TODAY), emptyMap(), emptySet()))
        // the person is away today: no penalty
        val away = state.copy(plan = mapOf(TODAY to DayEntry(labels = listOf("away:j"))))
        assertEquals(Suggest.weight(lasagne, ctxN, emptyMap(), emptySet()), Suggest.weight(lasagne, SuggestContext(away, DEFAULT_FILTERS, TODAY), emptyMap(), emptySet()))
    }
}
