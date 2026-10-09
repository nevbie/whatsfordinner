package de.nevbie.whatsfordinner.data

import android.app.Application
import android.content.Context
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import de.nevbie.whatsfordinner.core.Catalog
import de.nevbie.whatsfordinner.core.Change
import de.nevbie.whatsfordinner.core.DayEntry
import de.nevbie.whatsfordinner.core.Dish
import de.nevbie.whatsfordinner.core.DishStats
import de.nevbie.whatsfordinner.core.FamilyCode
import de.nevbie.whatsfordinner.core.FamilyState
import de.nevbie.whatsfordinner.core.FilterLogic
import de.nevbie.whatsfordinner.core.Filters
import de.nevbie.whatsfordinner.core.I18n
import de.nevbie.whatsfordinner.core.Party
import de.nevbie.whatsfordinner.core.SettingsPatch
import de.nevbie.whatsfordinner.core.StateOps
import de.nevbie.whatsfordinner.core.Strings
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.AppJson
import kotlinx.coroutines.launch
import java.util.Locale

/**
 * App-wide store (port of StoreContext.tsx): holds the family state, picks the local or the
 * Firebase backend and offers the same operations as the web app's useStore().
 */
class AppStore(app: Application) : AndroidViewModel(app) {
    private val prefs = app.getSharedPreferences("wfd", Context.MODE_PRIVATE)
    private val localFile = LocalStateFile(app.filesDir)

    val catalog: Catalog = Catalog.parse(app.assets.open("dishes.json").bufferedReader().use { it.readText() })
    val strings: Strings = Strings.parse(app.assets.open("strings.json").bufferedReader().use { it.readText() })

    val syncAvailable: Boolean = FirebaseSync.available

    var state by mutableStateOf(localFile.read())
        private set
    var familyCode by mutableStateOf(if (syncAvailable) prefs.getString(FAMILY_KEY, null) else null)
        private set
    var syncError by mutableStateOf<String?>(null)
        private set

    /** UI language: stored choice, else the device language (de → German, otherwise English). */
    var lang by mutableStateOf(prefs.getString(LANG_KEY, null) ?: if (Locale.getDefault().language == "de") "de" else "en")
        private set
    val i18n by derivedStateOf { I18n(strings, lang) }

    /** Built-in dishes with the family's edits plus their own dishes (incl. hidden ones – for the history). */
    val allDishes by derivedStateOf { catalog.allDishes(state) }
    /** What lists and suggestions use: without the dishes the family removed. */
    val dishes by derivedStateOf { catalog.visibleDishes(allDishes, state) }
    val dishById by derivedStateOf { allDishes.associateBy { it.id } }
    val stats by derivedStateOf { DishStats(state.plan, Dates.todayISO()) }

    private var backend: Backend? = null
    private var unsubscribe: (() -> Unit)? = null

    init {
        connect()
    }

    private fun connect() {
        unsubscribe?.invoke()
        syncError = null
        val code = familyCode
        val b: Backend = if (code != null && syncAvailable) FirebaseBackend(getApplication(), code) else LocalBackend(localFile)
        backend = b
        unsubscribe = b.subscribe(
            { s ->
                state = s
                // keep a local copy so the app opens instantly and works if the family is left
                if (familyCode != null) localFile.write(s)
            },
            { e -> syncError = e.message ?: e.toString() },
        )
    }

    override fun onCleared() {
        unsubscribe?.invoke()
    }

    fun send(change: Change) {
        val b = backend ?: return
        viewModelScope.launch {
            try {
                b.apply(change)
            } catch (e: Exception) {
                syncError = e.message ?: e.toString()
            }
        }
    }

    // ---- operations (same names as the web store) ----
    fun setDay(date: String, entry: DayEntry?) = send(Change.SetDay(date, entry))
    fun setMeal(date: String, meal: String, ids: List<String>) = setDay(date, StateOps.withMeal(state, date, meal, ids))
    fun toggleFavorite(id: String) = send(Change.SetFavorite(id, id !in state.favorites))
    fun saveDish(dish: Dish) = send(Change.SaveDish(dish))
    fun deleteDish(id: String) = send(Change.DeleteDish(id))
    fun updateSettings(patch: SettingsPatch) = send(Change.UpdateSettings(patch))
    fun saveParty(party: Party) = send(Change.SaveParty(party))
    fun deleteParty(id: String) = send(Change.DeleteParty(id))
    fun addLabel(name: String) = send(Change.SaveLabels(state.labels + StateOps.newLabel(state, name)))
    fun renameLabel(id: String, name: String) = send(Change.SaveLabels(state.labels.map { if (it.id == id) it.copy(name = name) else it }))
    fun deleteLabel(id: String) = send(Change.DeleteLabel(id, state.labels.filter { it.id != id }))
    fun toggleLabelFavorite(labelId: String, dishId: String) = StateOps.toggleLabelFavorite(state, labelId, dishId).forEach(::send)
    fun toggleLabelDislike(labelId: String, dishId: String) = StateOps.toggleLabelDislike(state, labelId, dishId).forEach(::send)
    fun setHidden(dishId: String, on: Boolean) = send(Change.SetHidden(dishId, on))

    /** Uploads this device's data as a new family document and switches to it. */
    suspend fun createFamily(): String {
        val code = FamilyCode.newCode()
        FirebaseSync.createFamily(getApplication(), code, state)
        setFamily(code)
        return code
    }

    suspend fun joinFamily(input: String): Boolean {
        val code = FamilyCode.clean(input)
        if (!FirebaseSync.familyExists(getApplication(), code)) return false
        setFamily(code)
        return true
    }

    fun leaveFamily() {
        localFile.write(state)
        setFamily(null)
    }

    private fun setFamily(code: String?) {
        prefs.edit().apply { if (code != null) putString(FAMILY_KEY, code) else remove(FAMILY_KEY) }.apply()
        familyCode = code
        connect()
    }

    fun changeLang(l: String) {
        lang = l
        prefs.edit().putString(LANG_KEY, l).apply()
    }

    // ---- per-device filters (like localStorage 'wfd:filters:*') ----
    fun loadFilters(key: String): Filters = FilterLogic.normalizeFilters(prefs.getString("filters:$key", null))

    fun saveFilters(key: String, f: Filters) {
        prefs.edit().putString("filters:$key", AppJson.encodeToString(Filters.serializer(), f)).apply()
    }

    fun t(key: String, vararg vars: Pair<String, Any>) = i18n.t(key, *vars)

    companion object {
        private const val FAMILY_KEY = "family"
        private const val LANG_KEY = "lang"
    }
}
