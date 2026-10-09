package de.nevbie.whatsfordinner.core

import kotlinx.serialization.KSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.doubleOrNull
import kotlinx.serialization.json.longOrNull

/**
 * JSON settings shared by data loading, local persistence and the Firestore mapping:
 * unknown fields are ignored (newer web versions), defaults are written (required fields like
 * `tags: []` are always present) and null fields are never written (Firestore must not get nulls).
 */
val AppJson = Json {
    ignoreUnknownKeys = true
    encodeDefaults = true
    explicitNulls = false
    coerceInputValues = true
    isLenient = true
}

/** Plain Kotlin value (Map / List / String / Long / Double / Boolean) → JsonElement. */
fun anyToJson(value: Any?): JsonElement = when (value) {
    null -> JsonNull
    is JsonElement -> value
    is String -> JsonPrimitive(value)
    is Boolean -> JsonPrimitive(value)
    is Int -> JsonPrimitive(value)
    is Long -> JsonPrimitive(value)
    is Double -> if (value % 1.0 == 0.0 && !value.isInfinite() && kotlin.math.abs(value) < 9.0e15) JsonPrimitive(value.toLong()) else JsonPrimitive(value)
    is Float -> anyToJson(value.toDouble())
    is Number -> JsonPrimitive(value)
    is Map<*, *> -> JsonObject(value.entries.associate { (k, v) -> k.toString() to anyToJson(v) })
    is Iterable<*> -> JsonArray(value.map { anyToJson(it) })
    is Array<*> -> JsonArray(value.map { anyToJson(it) })
    else -> JsonPrimitive(value.toString())
}

/** JsonElement → plain Kotlin value for Firestore. Null values in objects are dropped. */
fun jsonToAny(e: JsonElement): Any? = when (e) {
    is JsonNull -> null
    is JsonPrimitive -> when {
        e.isString -> e.content
        e.booleanOrNull != null -> e.booleanOrNull
        e.longOrNull != null -> e.longOrNull
        else -> e.doubleOrNull
    }
    is JsonObject -> e.entries.mapNotNull { (k, v) -> jsonToAny(v)?.let { k to it } }.toMap()
    is JsonArray -> e.mapNotNull { jsonToAny(it) }
}

/** Encode a model object as a plain map/list tree (for Firestore writes). */
fun <T> toPlain(serializer: KSerializer<T>, value: T): Any? = jsonToAny(AppJson.encodeToJsonElement(serializer, value))

/** Decode a model object from a plain map/list tree (Firestore reads). */
fun <T> fromPlain(serializer: KSerializer<T>, value: Any?): T = AppJson.decodeFromJsonElement(serializer, anyToJson(value))
