package de.nevbie.whatsfordinner.core

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

/** shared/dishes.json – built-in dishes (incl. recipes) and the ingredient dictionary. */
@Serializable
data class DishesFile(
    val version: Int = 1,
    val dishes: List<Dish> = emptyList(),
    /** key → [de, en] */
    val ingredients: Map<String, List<String>> = emptyMap(),
)

/** Built-in dishes and ingredient names, loaded once at startup from the bundled JSON. */
class Catalog(val builtin: List<Dish>, val ingredients: Map<String, List<String>>) {
    val builtinIds: Set<String> = builtin.mapTo(HashSet()) { it.id }
    val builtinById: Map<String, Dish> = builtin.associateBy { it.id }

    fun ingredientName(key: String, lang: Lang): String {
        val e = ingredients[key] ?: return key
        return e.getOrNull(if (lang == "de") 0 else 1) ?: key
    }

    fun isBuiltin(id: String) = id in builtinIds

    /** Custom dishes with a built-in id are the family's edits of that dish and replace it. */
    fun allDishes(state: FamilyState): List<Dish> {
        val custom = state.customDishes
        return builtin.map { custom[it.id] ?: it } + custom.values.filter { it.id !in builtinIds }
    }

    /** Removed dishes disappear from lists and suggestions but still show up in the history. */
    fun visibleDishes(all: List<Dish>, state: FamilyState): List<Dish> {
        val hidden = state.hiddenDishes.toSet()
        return all.filter { it.id !in hidden }
    }

    companion object {
        fun parse(json: String): Catalog {
            val file = AppJson.decodeFromString(DishesFile.serializer(), json)
            return Catalog(file.dishes, file.ingredients)
        }
    }
}

/**
 * shared/strings.json – UI texts in both languages plus the label tables.
 * Placeholders look like {n}, {name}, {d} and are replaced by [t].
 */
class Strings(
    private val de: Map<String, String>,
    private val en: Map<String, String>,
    /** table name (tags, cuisines, courses, partyFormats, partyCourses, todoPhases, langNames) → key → entries */
    private val tables: Map<String, Map<String, List<String>>>,
) {
    fun t(lang: Lang, key: String, vars: Map<String, Any> = emptyMap()): String {
        var s = (if (lang == "de") de[key] else en[key]) ?: de[key] ?: key
        for ((k, v) in vars) s = s.replaceFirst("{$k}", v.toString())
        return s
    }

    /** [de, en] table entry for the language; partyFormats have [icon, de, en]. */
    fun label(lang: Lang, table: String, key: String): String {
        val e = tables[table]?.get(key) ?: return key
        val offset = if (e.size == 3) 1 else 0
        return e.getOrNull(offset + if (lang == "de") 0 else 1) ?: key
    }

    fun icon(table: String, key: String): String = tables[table]?.get(key)?.takeIf { it.size == 3 }?.get(0) ?: ""

    fun keys(table: String): List<String> = tables[table]?.keys?.toList() ?: emptyList()

    fun has(key: String) = de.containsKey(key)

    companion object {
        fun parse(json: String): Strings {
            val root = AppJson.parseToJsonElement(json).jsonObject
            fun dict(name: String) = (root[name] as? JsonObject)?.mapValues { it.value.jsonPrimitive.content } ?: emptyMap()
            val tables = mutableMapOf<String, Map<String, List<String>>>()
            for ((name, value) in root) {
                if (name == "de" || name == "en" || value !is JsonObject) continue
                // keeps the key order of the JSON (LinkedHashMap)
                val table = LinkedHashMap<String, List<String>>()
                for ((k, v) in value) if (v is JsonArray) table[k] = v.jsonArray.map { it.jsonPrimitive.content }
                tables[name] = table
            }
            return Strings(dict("de"), dict("en"), tables)
        }
    }
}

/** Strings bound to one language – what the UI uses. */
class I18n(val strings: Strings, val lang: Lang) {
    fun t(key: String, vararg vars: Pair<String, Any>): String = strings.t(lang, key, vars.toMap())
    fun tag(key: String) = strings.label(lang, "tags", key)
    fun cuisine(key: String) = strings.label(lang, "cuisines", key)
    fun course(key: String) = strings.label(lang, "courses", key)
    fun partyFormat(key: String) = strings.label(lang, "partyFormats", key)
    fun partyFormatIcon(key: String) = strings.icon("partyFormats", key)
    fun partyCourse(key: String) = strings.label(lang, "partyCourses", key)
    fun todoPhase(key: String) = strings.label(lang, "todoPhases", key)
    fun langName(key: String) = strings.label(lang, "langNames", key)
}
