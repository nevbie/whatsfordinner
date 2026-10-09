package de.nevbie.whatsfordinner.core

import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.serializer

/** One field operation of a Firestore update (independent of the Firebase SDK). */
sealed interface FieldOp {
    data class Set(val value: Any) : FieldOp
    data object Delete : FieldOp
    data class ArrayUnion(val value: String) : FieldOp
    data class ArrayRemove(val value: String) : FieldOp
}

/** Field path segments (like `new FieldPath('plan', date)`) and the operation. */
data class FieldUpdate(val path: List<String>, val op: FieldOp)

/**
 * Field-level updates exactly like src/store/firebase.ts: plan.<date>, favorites array ops,
 * customDishes.<id>, parties.<id>, labels (whole array), labelFavorites.<id> / labelDislikes.<id>
 * array ops, hiddenDishes array ops, settings.<key>. Never writes null values.
 */
object RemoteOps {
    private fun plain(value: Any?): Any = value ?: emptyMap<String, Any>()

    fun updatesFor(c: Change): List<FieldUpdate> = when (c) {
        is Change.SetDay -> listOf(
            FieldUpdate(listOf("plan", c.date), if (StateOps.keepEntry(c.entry)) FieldOp.Set(plain(toPlain(DayEntry.serializer(), c.entry!!))) else FieldOp.Delete),
        )
        is Change.SetFavorite -> listOf(FieldUpdate(listOf("favorites"), if (c.on) FieldOp.ArrayUnion(c.id) else FieldOp.ArrayRemove(c.id)))
        is Change.SaveDish -> listOf(FieldUpdate(listOf("customDishes", c.dish.id), FieldOp.Set(plain(toPlain(Dish.serializer(), c.dish)))))
        is Change.DeleteDish -> listOf(FieldUpdate(listOf("customDishes", c.id), FieldOp.Delete))
        is Change.SaveParty -> listOf(FieldUpdate(listOf("parties", c.party.id), FieldOp.Set(plain(toPlain(Party.serializer(), c.party)))))
        is Change.DeleteParty -> listOf(FieldUpdate(listOf("parties", c.id), FieldOp.Delete))
        is Change.SaveLabels -> listOf(FieldUpdate(listOf("labels"), FieldOp.Set(plain(toPlain(ListSerializer(FavLabel.serializer()), c.labels)))))
        is Change.DeleteLabel -> listOf(
            FieldUpdate(listOf("labels"), FieldOp.Set(plain(toPlain(ListSerializer(FavLabel.serializer()), c.remaining)))),
            FieldUpdate(listOf("labelFavorites", c.id), FieldOp.Delete),
            FieldUpdate(listOf("labelDislikes", c.id), FieldOp.Delete),
        )
        is Change.SetLabelFavorite -> listOf(FieldUpdate(listOf("labelFavorites", c.labelId), if (c.on) FieldOp.ArrayUnion(c.dishId) else FieldOp.ArrayRemove(c.dishId)))
        is Change.SetLabelDislike -> listOf(FieldUpdate(listOf("labelDislikes", c.labelId), if (c.on) FieldOp.ArrayUnion(c.dishId) else FieldOp.ArrayRemove(c.dishId)))
        is Change.SetHidden -> listOf(FieldUpdate(listOf("hiddenDishes"), if (c.on) FieldOp.ArrayUnion(c.dishId) else FieldOp.ArrayRemove(c.dishId)))
        is Change.UpdateSettings -> buildList {
            c.patch.adults?.let { add(FieldUpdate(listOf("settings", "adults"), FieldOp.Set(it.toLong()))) }
            c.patch.kids?.let { add(FieldUpdate(listOf("settings", "kids"), FieldOp.Set(it.toLong()))) }
            c.patch.avoidDays?.let { add(FieldUpdate(listOf("settings", "avoidDays"), FieldOp.Set(it.toLong()))) }
            c.patch.builderCounts?.let {
                val ser = MapSerializer(String.serializer(), MapSerializer(String.serializer(), Int.serializer()))
                add(FieldUpdate(listOf("settings", "builderCounts"), FieldOp.Set(plain(toPlain(ser, it)))))
            }
        }
    }

    /** Whole document for a new family (setDoc(initial)). */
    @Suppress("UNCHECKED_CAST")
    fun documentFor(state: FamilyState): Map<String, Any> = toPlain(FamilyState.serializer(), state) as Map<String, Any>

    /** Snapshot data → state. */
    fun stateFrom(data: Map<String, Any?>?): FamilyState = StateOps.normalize(data?.let { anyToJson(it) })
}
