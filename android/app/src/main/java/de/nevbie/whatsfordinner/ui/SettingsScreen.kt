package de.nevbie.whatsfordinner.ui

import android.content.Intent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.SettingsPatch

/** Settings (SettingsView.tsx): language, family, people, deleted dishes, family sync. */
@Composable
fun SettingsScreen() {
    val store = LocalStore.current
    val ui = LocalUi.current
    val i = store.i18n
    val c = Wfd.colors
    val context = LocalContext.current
    val state = store.state
    var code by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var msg by remember { mutableStateOf<String?>(null) }
    var labelName by remember { mutableStateOf("") }

    fun addLabel() {
        if (labelName.isBlank()) return
        store.addLabel(labelName.trim())
        labelName = ""
    }

    fun act(block: suspend () -> Unit) {
        busy = true
        msg = null
        ui.launch {
            try {
                block()
            } catch (e: Exception) {
                msg = e.message ?: e.toString()
            } finally {
                busy = false
            }
        }
    }

    fun share() {
        val text = "${i.t("appTitle")} – ${i.t("settings.join")}: ${store.familyCode}"
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, text)
        }
        context.startActivity(Intent.createChooser(send, i.t("settings.share")))
    }

    Screen {
        item { TitleRow(i.t("nav.settings")) }
        item {
            Card {
                H(i.t("settings.language"))
                VSpace(6.dp)
                Segmented(listOf("de" to "Deutsch", "en" to "English"), i.lang) { store.changeLang(it) }
            }
        }
        item {
            Card {
                H(i.t("settings.family"))
                Stepper(i.t("combo.adults"), state.settings.adults, 1, 8) { store.updateSettings(SettingsPatch(adults = it)) }
                Stepper(i.t("combo.kids"), state.settings.kids, 0, 8) { store.updateSettings(SettingsPatch(kids = it)) }
                Muted(i.t("settings.avoidDays"))
                Stepper("", state.settings.avoidDays, 0, 60) { store.updateSettings(SettingsPatch(avoidDays = it)) }
            }
        }
        item {
            Card {
                H(i.t("labels.title"))
                Muted(i.t("labels.hint"))
                state.labels.forEach { l ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("★", color = c.label(l.color), fontSize = 18.sp)
                        HSpace(8.dp)
                        CommitField(l.name, { n -> if (n.isNotBlank()) store.renameLabel(l.id, n.trim()) }, Modifier.weight(1f))
                        IconText("✕") { ui.confirm(i.t("labels.deleteConfirm", "name" to l.name)) { store.deleteLabel(l.id) } }
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Input(labelName, { labelName = it }, Modifier.weight(1f), placeholder = i.t("labels.placeholder"), onDone = ::addLabel)
                    HSpace(8.dp)
                    SecondaryButton(i.t("party.add"), enabled = labelName.isNotBlank()) { addLabel() }
                }
            }
        }
        item {
            Card {
                H(i.t("settings.hidden"))
                if (state.hiddenDishes.isEmpty()) Muted(i.t("settings.hiddenNone"))
                state.hiddenDishes.forEach { id ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(store.dishById[id]?.label(i.lang) ?: id, modifier = Modifier.weight(1f))
                        SecondaryButton(i.t("settings.restore"), small = true) { store.setHidden(id, false) }
                    }
                }
            }
        }
        item {
            Card {
                H(i.t("settings.sync"))
                val familyCode = store.familyCode
                when {
                    !store.syncAvailable -> Muted(i.t("settings.syncNotConfigured"))
                    familyCode != null -> {
                        Text("${i.t("settings.syncOn")}: ", fontSize = 14.sp)
                        Text(familyCode, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = c.brand)
                        VSpace(6.dp)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            SecondaryButton(i.t("settings.share")) { share() }
                            SecondaryButton(i.t("settings.leave"), danger = true) { ui.confirm(i.t("settings.leaveConfirm")) { store.leaveFamily() } }
                        }
                    }
                    else -> {
                        Muted(i.t("settings.syncOff"))
                        VSpace(6.dp)
                        PrimaryButton(i.t("settings.create"), enabled = !busy) { act { store.createFamily() } }
                        Muted(i.t("settings.createHint"))
                        VSpace(6.dp)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Input(code, { code = it }, Modifier.weight(1f), placeholder = i.t("settings.joinPlaceholder"))
                            HSpace(8.dp)
                            SecondaryButton(i.t("settings.join"), enabled = !busy && code.trim().length >= 12) {
                                act { if (!store.joinFamily(code)) msg = i.t("settings.joinFail") }
                            }
                        }
                    }
                }
                msg?.let { Text(it, fontSize = 13.sp) }
                store.syncError?.let { Text("${i.t("settings.error")}: $it", fontSize = 13.sp, color = c.danger) }
            }
        }
        item {
            Card { SecondaryButton("＋ ${i.t("dishes.add")}") { ui.openForm() } }
        }
        item {
            Card {
                H(i.t("settings.about"))
                Muted(i.t("settings.aboutText"))
            }
        }
    }
}

@Composable
private fun H(text: String) = Text(text, style = MaterialTheme.typography.titleMedium)
