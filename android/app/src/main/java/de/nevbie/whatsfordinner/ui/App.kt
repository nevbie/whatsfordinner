package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import de.nevbie.whatsfordinner.data.AppStore

private data class TabDef(val route: String, val icon: String, val label: String)

private val TABS = listOf(
    TabDef("suggest", "🎲", "nav.suggest"),
    TabDef("plan", "📅", "nav.plan"),
    TabDef("dishes", "📖", "nav.dishes"),
    TabDef("party", "🎉", "nav.party"),
    TabDef("history", "🕘", "nav.history"),
    TabDef("settings", "⚙️", "nav.settingsShort"),
)

/** App shell (App.tsx): bottom navigation with the six tabs, sheets stacked on top. */
@Composable
fun WfdApp(store: AppStore) {
    val scope = rememberCoroutineScope()
    val ui = remember { UiController(scope) }
    val nav = rememberNavController()
    val snackbar = remember { SnackbarHostState() }
    val c = Wfd.colors

    ui.goToTab = { route ->
        nav.navigate(route) {
            popUpTo(nav.graph.findStartDestination().id) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    val msg = ui.message
    LaunchedEffect(msg) {
        if (msg != null) {
            snackbar.showSnackbar(msg)
            ui.message = null
        }
    }

    CompositionLocalProvider(LocalStore provides store, LocalUi provides ui) {
        val i = store.i18n
        val backStack by nav.currentBackStackEntryAsState()
        val current = backStack?.destination?.route ?: "suggest"
        Scaffold(
            containerColor = c.bg,
            snackbarHost = { SnackbarHost(snackbar) },
            bottomBar = {
                NavigationBar(containerColor = c.surface, tonalElevation = 0.dp) {
                    TABS.forEach { tab ->
                        NavigationBarItem(
                            selected = current == tab.route,
                            onClick = { ui.goToTab(tab.route) },
                            icon = { Text(tab.icon, fontSize = 20.sp) },
                            label = { Text(i.t(tab.label), fontSize = 10.sp, maxLines = 1, overflow = TextOverflow.Clip) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedTextColor = c.accent, indicatorColor = c.accentSoft, unselectedTextColor = c.muted,
                            ),
                        )
                    }
                }
            },
        ) { padding ->
            Box(Modifier.fillMaxSize().padding(padding)) {
                NavHost(nav, startDestination = "suggest") {
                    composable("suggest") { SuggestScreen() }
                    composable("plan") { PlanScreen() }
                    composable("dishes") { DishesScreen() }
                    composable("party") { PartyListScreen() }
                    composable("history") { HistoryScreen() }
                    composable("settings") { SettingsScreen() }
                }
            }
        }

        OverlayHost(ui)

        ui.confirmRequest?.let { req ->
            AlertDialog(
                onDismissRequest = { ui.confirmRequest = null },
                text = { Text(req.text) },
                confirmButton = {
                    TextButton(onClick = { ui.confirmRequest = null; req.onYes() }) { Text("OK") }
                },
                dismissButton = {
                    TextButton(onClick = { ui.confirmRequest = null }) { Text(i.t("cancel")) }
                },
            )
        }
    }
}

/** Renders every overlay as a bottom sheet; the back button / swipe closes the top one. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun OverlayHost(ui: UiController) {
    val c = Wfd.colors
    ui.overlays.toList().forEach { o ->
        key(o) {
            val state = rememberModalBottomSheetState(skipPartiallyExpanded = true)
            ModalBottomSheet(
                onDismissRequest = { ui.remove(o) },
                sheetState = state,
                containerColor = c.bg,
            ) {
                when (o) {
                    is Overlay.DishDetail -> DishDetailSheet(o)
                    is Overlay.Combo -> ComboBuilderSheet(o)
                    is Overlay.Form -> DishFormSheet(o)
                    is Overlay.PartyPlanner -> PartySheet(o)
                    is Overlay.PickDish -> DishPickerSheet(o)
                    is Overlay.PickDay -> DayPickerSheet(o)
                }
            }
        }
    }
}
