package de.nevbie.whatsfordinner.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

/** State mutations, normalisation and the Firestore field mapping. */
class StateTest {
    @Test fun normalizesPartialAndBrokenState() {
        val s = StateOps.parseState("""{"favorites":"oops","plan":{"2026-10-01":{"dishes":["pizza"]},"bad":5},"settings":{"kids":3},"unknown":1}""")
        assertEquals(emptyList(), s.favorites)
        assertEquals(listOf("pizza"), s.plan["2026-10-01"]?.dishes)
        assertEquals(1, s.plan.size)
        assertEquals(FamilySettings(adults = 2, kids = 3, avoidDays = 10), s.settings)
        assertEquals(emptyState(), StateOps.parseState(null))
        assertEquals(emptyState(), StateOps.parseState("garbage"))
    }

    @Test fun roundTripsTheLocalJson() {
        var s = emptyState()
        s = StateOps.apply(s, Change.SetDay("2026-10-06", DayEntry(listOf("pizza"), meals = mapOf("coffee" to listOf("kaesekuchen")))))
        s = StateOps.apply(s, Change.SaveParty(PartyLogic.newParty("2026-10-10", s.settings, "de")))
        s = StateOps.apply(s, Change.UpdateSettings(SettingsPatch(builderCounts = mapOf("salad" to mapOf("slBase" to 2)))))
        assertEquals(s, StateOps.parseState(StateOps.encodeState(s)))
    }

    @Test fun appliesChangesLikeTheWebLocalBackend() {
        var s = emptyState()
        s = StateOps.apply(s, Change.SetFavorite("pizza", true))
        s = StateOps.apply(s, Change.SetFavorite("pizza", true))
        assertEquals(listOf("pizza"), s.favorites)
        s = StateOps.apply(s, Change.SetDay("2026-10-06", DayEntry()))
        assertTrue(s.plan.isEmpty())
        s = StateOps.apply(s, Change.SetDay("2026-10-06", DayEntry(done = true)))
        assertTrue(s.plan.containsKey("2026-10-06"))
        val label = StateOps.newLabel(s, "Eric")
        s = StateOps.apply(s, Change.SaveLabels(listOf(label)))
        for (c in StateOps.toggleLabelFavorite(s, label.id, "pizza")) s = StateOps.apply(s, c)
        assertEquals(listOf("pizza"), s.labelFavorites[label.id])
        // disliking clears the favourite
        for (c in StateOps.toggleLabelDislike(s, label.id, "pizza")) s = StateOps.apply(s, c)
        assertEquals(emptyList(), s.labelFavorites[label.id])
        assertEquals(listOf("pizza"), s.labelDislikes[label.id])
        s = StateOps.apply(s, Change.DeleteLabel(label.id, emptyList()))
        assertFalse(s.labelDislikes.containsKey(label.id))
        s = StateOps.apply(s, Change.SetHidden("pizza", true))
        assertEquals(listOf("pizza"), s.hiddenDishes)
    }

    @Test fun setsAndRemovesMeals() {
        var s = emptyState()
        s = StateOps.apply(s, Change.SetDay("d", StateOps.withMeal(s, "d", "lunch", listOf("a"))))
        s = StateOps.apply(s, Change.SetDay("d", StateOps.withMeal(s, "d", "dinner", listOf("b", "c"))))
        assertEquals(listOf("b", "c", "a"), dayDishIds(s.plan["d"]))
        assertEquals(listOf("b"), StateOps.removeDish(s, "d", "dinner", 1)?.dishes)
        val single = emptyState().copy(plan = mapOf("d" to DayEntry(listOf("x"))))
        assertNull(StateOps.removeDish(single, "d", "dinner", 0))
        val withLabel = StateOps.toggleDayLabel(s, "d", "out")
        assertEquals(listOf("out"), withLabel.labels)
        assertNull(StateOps.toggleDayLabel(s.copy(plan = mapOf("d" to withLabel)), "d", "out").labels)
    }

    @Test fun mapsChangesToFieldLevelUpdates() {
        val day = RemoteOps.updatesFor(Change.SetDay("2026-10-06", DayEntry(listOf("pizza"))))
        assertEquals(listOf("plan", "2026-10-06"), day.single().path)
        assertEquals(mapOf("dishes" to listOf("pizza")), (day.single().op as FieldOp.Set).value)
        assertEquals(FieldOp.Delete, RemoteOps.updatesFor(Change.SetDay("2026-10-06", null)).single().op)
        assertEquals(FieldOp.ArrayUnion("x"), RemoteOps.updatesFor(Change.SetFavorite("x", true)).single().op)
        val del = RemoteOps.updatesFor(Change.DeleteLabel("l1", emptyList()))
        assertEquals(listOf(listOf("labels"), listOf("labelFavorites", "l1"), listOf("labelDislikes", "l1")), del.map { it.path })
        val settings = RemoteOps.updatesFor(Change.UpdateSettings(SettingsPatch(kids = 3)))
        assertEquals(listOf(FieldUpdate(listOf("settings", "kids"), FieldOp.Set(3L))), settings)
        // never writes nulls
        val party = RemoteOps.updatesFor(Change.SaveParty(PartyLogic.newParty("2026-10-10", FamilySettings(), "en"))).single().op as FieldOp.Set
        assertFalse((party.value as Map<*, *>).containsKey("time"))
        val doc = RemoteOps.documentFor(emptyState())
        assertEquals(setOf("favorites", "plan", "customDishes", "settings", "parties", "labels", "labelFavorites", "labelDislikes", "hiddenDishes"), doc.keys)
    }

    @Test fun readsFirestoreSnapshots() {
        val data = mapOf<String, Any?>(
            "favorites" to listOf("pizza"),
            "settings" to mapOf("adults" to 3L, "kids" to 1L, "avoidDays" to 7.0),
            "customDishes" to mapOf("c-1" to mapOf("id" to "c-1", "name" to mapOf("orig" to "Omas Suppe", "lang" to "de", "de" to "Omas Suppe", "en" to "Grandma's soup"), "cuisine" to "german", "kind" to "dish", "tags" to listOf("veggie"), "effort" to 2L, "ingredients" to listOf("carrots"), "rating" to 4.0)),
        )
        val s = RemoteOps.stateFrom(data)
        assertEquals(listOf("pizza"), s.favorites)
        assertEquals(7, s.settings.avoidDays)
        assertEquals(4, s.customDishes["c-1"]?.rating)
    }

    @Test fun cleansFamilyCodes() {
        assertEquals("ABCD-EFGH-JKMN", FamilyCode.clean("abcd efgh-jkmn"))
        assertEquals("ABCDEFGHJKMN", FamilyCode.docId("abcd-efgh-jkmn"))
        val code = FamilyCode.newCode()
        assertTrue(Regex("^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$").matches(code), code)
    }

    @Test fun buildsDishesFromTheForm() {
        val c = TestData.catalog
        val input = DishFormLogic.Input(
            orig = " Omas Suppe ", origLang = "de", roman = "", de = "", en = "Grandma's soup", cuisine = "german", kind = "dish", course = "plMain",
            tags = listOf("vegan"), effort = 1, staples = emptyList(), ingredients = "Karotten, Geheimzutat", note = "lecker", url = "x", takeaway = true,
            place = "", address = "", rating = 0,
        )
        val d = DishFormLogic.build(null, input, "de", c)!!
        assertEquals("Omas Suppe", d.name.de)
        assertEquals(listOf("vegan", "veggie"), d.tags)
        assertEquals("plMain", d.course)
        assertNull(d.url)
        assertEquals(true, d.custom)
        assertEquals("Geheimzutat", d.ingredients.last())
        assertNull(DishFormLogic.build(null, input.copy(orig = " "), "de", c))
    }

    @Test fun formatsDays() {
        assertEquals("Di., 6.10.", Format.day("2026-10-06", "de"))
        assertEquals("Tue 6/10", Format.day("2026-10-06", "en"))
    }
}
