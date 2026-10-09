package de.nevbie.whatsfordinner.core

import de.nevbie.whatsfordinner.core.TestData.builtin
import de.nevbie.whatsfordinner.core.TestData.catalog
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/** Port of src/__tests__/data.test.ts against shared/dishes.json. */
class DataTest {
    @Test fun hasUniqueIds() {
        val ids = builtin.map { it.id }
        assertEquals(ids.size, ids.toSet().size)
        assertTrue(ids.size > 400, "expected the full dish list, got ${ids.size}")
    }

    @Test fun usesOnlyKnownIngredientKeys() {
        val unknown = builtin.flatMap { d -> d.ingredients.filter { it !in catalog.ingredients }.map { "${d.id}: $it" } }
        assertEquals(emptyList(), unknown)
    }

    @Test fun hasNamesInBothLanguagesAndTheOriginalName() {
        for (d in builtin) {
            assertTrue(d.name.orig.isNotBlank(), d.id)
            assertTrue(d.name.de.isNotBlank(), d.id)
            assertTrue(d.name.en.isNotBlank(), d.id)
        }
    }

    @Test fun hasARomanisationForEveryNonLatinName() {
        val nonLatin = Regex("[^\\u0000-\\u024F\\u1E00-\\u1EFF\\u2018-\\u201E\\s.,()/'’–-]")
        for (d in builtin) if (nonLatin.containsMatchIn(d.name.orig)) assertFalse(d.name.roman.isNullOrBlank(), d.id)
    }

    @Test fun givesEveryChineseAndIndianDishACourse() {
        for (d in builtin) {
            if ((d.cuisine == "chinese" || d.cuisine == "indian") && d.kind != Kind.COMBO && d.kind != Kind.PARTY) assertTrue(d.course != null, d.id)
        }
    }

    @Test fun onlyPointsPairsWithAtExistingDishes() {
        val ids = builtin.map { it.id }.toSet()
        for (d in builtin) for (p in d.pairsWith ?: emptyList()) assertTrue(p in ids, "${d.id} → $p")
    }

    @Test fun keepsVeganSubsetOfVeggie() {
        for (d in builtin) {
            if (d.has("vegan")) assertTrue(d.has("veggie"), d.id)
            if (d.has("veggie")) {
                assertFalse(d.has("meat"), d.id)
                assertFalse(d.has("fish"), d.id)
            }
        }
    }

    @Test fun hasBilingualRecipesWithMatchingStepCounts() {
        for (d in builtin) {
            val r = d.recipe ?: continue
            assertEquals(r.steps.de.size, r.steps.en.size, d.id)
            assertEquals(r.ingredients.de.size, r.ingredients.en.size, d.id)
        }
    }

    @Test fun kidsTagIsNotOnTheRemovedDinners() {
        val tagged = builtin.filter { it.kind == Kind.DISH && it.has("kids") }.map { it.id }
        assertTrue(tagged.isNotEmpty())
        for (removed in listOf("arme-ritter", "dampfnudeln", "raclette", "dan-chaofan", "butter-chicken", "pasta-pesto")) assertFalse(removed in tagged, removed)
    }

    @Test fun loadsStringsInBothLanguages() {
        val s = TestData.strings
        assertEquals("Vorschlag", s.t("de", "nav.suggest"))
        assertEquals("Suggest", s.t("en", "nav.suggest"))
        assertEquals("Zuletzt vor 3 Tagen", s.t("de", "dish.lastEaten", mapOf("n" to 3)))
        assertEquals("Vegetarisch", s.label("de", "tags", "veggie"))
        assertEquals("Buffet", s.label("en", "partyFormats", "buffet"))
        assertEquals("🥗", s.icon("partyFormats", "buffet"))
        // every slot key used by the builders has a text
        for (k in Combos.SLOT_KEYS) assertTrue(s.has("slot.$k"), k)
    }

    @Test fun dishJsonRoundTripsWithoutNulls() {
        val d = TestData.byId.getValue("lasagne")
        val plain = toPlain(Dish.serializer(), d) as Map<*, *>
        assertFalse(plain.values.any { it == null })
        assertFalse("roman" in plain)
        assertEquals(d, fromPlain(Dish.serializer(), plain))
    }
}
