package de.nevbie.whatsfordinner.ui

import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import de.nevbie.whatsfordinner.core.Dish
import de.nevbie.whatsfordinner.data.AppStore
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

/**
 * Sheets stacked on top of the current tab (port of src/ui.tsx). Plain classes on purpose:
 * every opened overlay is its own instance (identity), even for the same dish.
 */
sealed class Overlay {
    class DishDetail(val id: String) : Overlay()
    class Combo(val combo: String, val seedId: String? = null, val date: String? = null, val meal: String? = null) : Overlay()
    class Form(val id: String? = null, val kind: String? = null) : Overlay()
    class PartyPlanner(val id: String) : Overlay()
    class PickDish(val title: String, val filter: ((Dish) -> Boolean)?, val result: CompletableDeferred<String?>) : Overlay()
    class PickDay(val result: CompletableDeferred<String?>) : Overlay()
}

class ConfirmRequest(val text: String, val onYes: () -> Unit)

class UiController(private val scope: CoroutineScope) {
    val overlays = mutableStateListOf<Overlay>()
    var confirmRequest by mutableStateOf<ConfirmRequest?>(null)
    var message by mutableStateOf<String?>(null)
    /** set by the app scaffold: switch the bottom tab */
    var goToTab: (String) -> Unit = {}

    fun open(o: Overlay) {
        overlays.add(o)
    }

    /** Remove an overlay (closing a picker resolves it with null). */
    fun remove(o: Overlay) {
        when (o) {
            is Overlay.PickDish -> o.result.complete(null)
            is Overlay.PickDay -> o.result.complete(null)
            else -> {}
        }
        overlays.remove(o)
    }

    fun close() {
        overlays.lastOrNull()?.let { remove(it) }
    }

    fun finish(o: Overlay, result: String?) {
        when (o) {
            is Overlay.PickDish -> o.result.complete(result)
            is Overlay.PickDay -> o.result.complete(result)
            else -> {}
        }
        overlays.remove(o)
    }

    fun openDish(id: String) = open(Overlay.DishDetail(id))
    fun openCombo(combo: String, seedId: String? = null, date: String? = null, meal: String? = null) = open(Overlay.Combo(combo, seedId, date, meal))
    fun openForm(id: String? = null, kind: String? = null) = open(Overlay.Form(id, kind))
    fun openParty(id: String) = open(Overlay.PartyPlanner(id))

    suspend fun pickDish(title: String, filter: ((Dish) -> Boolean)? = null): String? {
        val d = CompletableDeferred<String?>()
        open(Overlay.PickDish(title, filter, d))
        return d.await()
    }

    suspend fun pickDay(): String? {
        val d = CompletableDeferred<String?>()
        open(Overlay.PickDay(d))
        return d.await()
    }

    /** App-lifetime coroutine (survives sheets closing). */
    fun launch(block: suspend CoroutineScope.() -> Unit): Job = scope.launch(block = block)

    fun confirm(text: String, onYes: () -> Unit) {
        confirmRequest = ConfirmRequest(text, onYes)
    }

    fun toast(text: String) {
        message = text
    }
}

val LocalStore = compositionLocalOf<AppStore> { error("no store") }
val LocalUi = compositionLocalOf<UiController> { error("no ui") }
