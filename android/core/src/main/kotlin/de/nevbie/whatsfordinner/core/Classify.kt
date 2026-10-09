package de.nevbie.whatsfordinner.core

/** Port of src/data/classify.ts – region and staples of a dish. */
object Classify {
    private val EUROPE = setOf("german", "austrian", "swiss", "french", "italian", "spanish", "greek", "eastern", "georgian")
    private val ASIA = setOf("chinese", "indian", "thai", "vietnamese", "japanese", "korean", "fusion")

    val REGIONS = listOf("europe", "asia", "other")
    val STAPLES = listOf("bread", "pasta", "rice", "potatoes", "dough")
    val STAPLE_ICONS = mapOf("bread" to "🥖", "pasta" to "🍝", "rice" to "🍚", "potatoes" to "🥔", "dough" to "🥟")

    fun regionOf(dish: Dish): String? {
        if (dish.cuisine == "restaurant") return null
        if (dish.cuisine in EUROPE) return "europe"
        if (dish.cuisine in ASIA) return "asia"
        return "other"
    }

    /** Ingredient → staple. Gnocchi and Schupfnudeln count as both pasta and potatoes. */
    private val STAPLE_INGREDIENTS = mapOf(
        "rice" to listOf("rice", "basmati", "risotto_rice", "paella_rice", "sushi_rice", "pudding_rice"),
        "pasta" to listOf("pasta", "spaghetti", "tagliatelle", "lasagna_sheets", "tortellini", "spaetzle", "maultaschen", "wheat_noodles", "glass_noodles", "rice_noodles", "gnocchi", "schupfnudeln"),
        "potatoes" to listOf("potatoes", "sweet_potato", "potato_salad", "gnocchi", "schupfnudeln"),
        "bread" to listOf("bread", "baguette", "bread_roll", "flatbread", "burger_buns", "tortillas", "pretzels", "atta"),
        "dough" to emptyList(),
    )

    /** Chinese and Indian main dishes are eaten with rice (and roti / naan). */
    private val EATEN_WITH = mapOf(
        "meat" to listOf("rice"), "fish" to listOf("rice"), "tofu" to listOf("rice"), "egg" to listOf("rice"), "veg" to listOf("rice"),
        "curry" to listOf("rice", "bread"), "dal" to listOf("rice", "bread"), "sabzi" to listOf("rice", "bread"),
    )

    private val BY_COMBO = mapOf(
        "chinese" to listOf("rice"), "indian" to listOf("bread", "rice"), "tapas" to listOf("bread", "potatoes"),
        "abendbrot" to listOf("bread"), "teller" to listOf("potatoes"), "salad" to emptyList(),
    )

    fun staplesOf(dish: Dish): List<String> {
        dish.staples?.let { return it }
        if (dish.kind == Kind.COMBO) return dish.combo?.let { BY_COMBO[it] } ?: emptyList()
        val found = HashSet<String>()
        for (s in STAPLES) if (STAPLE_INGREDIENTS.getValue(s).any { it in dish.ingredients }) found.add(s)
        if ((dish.cuisine == "chinese" || dish.cuisine == "indian") && dish.course != null) EATEN_WITH[dish.course]?.let { found.addAll(it) }
        return STAPLES.filter { it in found }
    }
}
