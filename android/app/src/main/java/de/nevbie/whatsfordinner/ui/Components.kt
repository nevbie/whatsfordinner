package de.nevbie.whatsfordinner.ui

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.FlowRowScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.nevbie.whatsfordinner.core.Classify
import de.nevbie.whatsfordinner.core.Dates
import de.nevbie.whatsfordinner.core.Dish
import de.nevbie.whatsfordinner.core.FilterLogic
import de.nevbie.whatsfordinner.core.Filters
import de.nevbie.whatsfordinner.core.Format
import de.nevbie.whatsfordinner.core.Kind
import java.time.LocalDate
import java.time.ZoneId

// ---------------------------------------------------------------- basics

/** Pill-shaped toggle chip like the web's .chip / .chip.on. */
@Composable
fun Pill(
    text: String,
    selected: Boolean = false,
    modifier: Modifier = Modifier,
    color: Color? = null,
    dashed: Boolean = false,
    enabled: Boolean = true,
    onClick: (() -> Unit)? = null,
) {
    val c = Wfd.colors
    val bg = when {
        selected && color != null -> color
        selected -> c.accent
        else -> c.surface
    }
    val fg = when {
        selected && color != null -> Color.White
        selected -> c.accentText
        color != null -> color
        else -> c.text
    }
    val borderColor = when {
        selected -> bg
        color != null -> color.copy(alpha = if (dashed) 0.5f else 0.8f)
        else -> c.line
    }
    Box(
        modifier
            .clip(CircleShape)
            .background(bg)
            .border(1.dp, borderColor, CircleShape)
            .then(if (onClick != null && enabled) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 11.dp, vertical = 5.dp),
    ) {
        Text(text, color = if (enabled) fg else fg.copy(alpha = 0.4f), fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

/** Small coloured tag (★ Eric / 👎 J). */
@Composable
fun Tag(text: String, color: Color, faded: Boolean = false) {
    Box(
        Modifier
            .border(1.dp, color.copy(alpha = if (faded) 0.5f else 1f), CircleShape)
            .padding(horizontal = 7.dp, vertical = 1.dp),
    ) {
        Text(text, color = color.copy(alpha = if (faded) 0.75f else 1f), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun Chips(modifier: Modifier = Modifier, content: @Composable FlowRowScope.() -> Unit) {
    FlowRow(modifier, horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp), content = content)
}

@Composable
fun ScrollRow(modifier: Modifier = Modifier, content: @Composable RowScope.() -> Unit) {
    Row(modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically, content = content)
}

@Composable
fun Card(modifier: Modifier = Modifier, padding: PaddingValues = PaddingValues(horizontal = 14.dp, vertical = 12.dp), onClick: (() -> Unit)? = null, borderColor: Color? = null, content: @Composable ColumnScope.() -> Unit) {
    val c = Wfd.colors
    val border = BorderStroke(if (borderColor != null) 2.dp else 1.dp, borderColor ?: c.line)
    val shape = RoundedCornerShape(14.dp)
    if (onClick != null) {
        Surface(onClick = onClick, modifier = modifier.fillMaxWidth(), shape = shape, color = c.surface, border = border) {
            Column(Modifier.padding(padding), content = content)
        }
    } else {
        Surface(modifier = modifier.fillMaxWidth(), shape = shape, color = c.surface, border = border) {
            Column(Modifier.padding(padding), content = content)
        }
    }
}

@Composable
fun Muted(text: String, modifier: Modifier = Modifier, small: Boolean = true) {
    Text(text, modifier = modifier, color = Wfd.colors.muted, fontSize = if (small) 13.sp else 15.sp)
}

@Composable
fun SectionTitle(text: String, modifier: Modifier = Modifier) {
    Text(text, modifier = modifier.padding(top = 14.dp, bottom = 6.dp), style = MaterialTheme.typography.titleMedium, color = Wfd.colors.text)
}

@Composable
fun FieldLabel(text: String, modifier: Modifier = Modifier) {
    Text(text, modifier = modifier.padding(top = 6.dp, bottom = 4.dp), fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Wfd.colors.muted)
}

@Composable
fun PrimaryButton(text: String, modifier: Modifier = Modifier, enabled: Boolean = true, small: Boolean = false, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        contentPadding = if (small) PaddingValues(horizontal = 12.dp, vertical = 4.dp) else ButtonDefaults.ContentPadding,
        shape = RoundedCornerShape(10.dp),
    ) { Text(text, fontSize = if (small) 13.sp else 14.sp, maxLines = 1) }
}

@Composable
fun SecondaryButton(text: String, modifier: Modifier = Modifier, enabled: Boolean = true, small: Boolean = false, danger: Boolean = false, onClick: () -> Unit) {
    val c = Wfd.colors
    OutlinedButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        contentPadding = if (small) PaddingValues(horizontal = 10.dp, vertical = 4.dp) else ButtonDefaults.ContentPadding,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, c.line),
        colors = ButtonDefaults.outlinedButtonColors(containerColor = c.surface, contentColor = if (danger) c.danger else c.text),
    ) { Text(text, fontSize = if (small) 13.sp else 14.sp, maxLines = 1) }
}

/** Round icon-like button with an emoji / symbol. */
@Composable
fun IconText(text: String, modifier: Modifier = Modifier, selected: Boolean = false, size: Dp = 34.dp, onClick: () -> Unit) {
    val c = Wfd.colors
    Box(
        modifier
            .size(size)
            .clip(CircleShape)
            .background(if (selected) c.accentSoft else Color.Transparent)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) { Text(text, fontSize = 16.sp, color = c.text) }
}

@Composable
fun LinkText(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Text(text, modifier = modifier.clickable(onClick = onClick).padding(vertical = 4.dp), color = Wfd.colors.accent, fontSize = 13.sp, fontWeight = FontWeight.Medium)
}

@Composable
fun CheckRow(text: String, checked: Boolean, modifier: Modifier = Modifier, strike: Boolean = false, onChange: (Boolean) -> Unit) {
    Row(modifier.clickable { onChange(!checked) }, verticalAlignment = Alignment.CenterVertically) {
        Checkbox(checked = checked, onCheckedChange = onChange, modifier = Modifier.size(36.dp))
        Text(
            text,
            fontSize = 14.sp,
            color = if (strike && checked) Wfd.colors.muted else Wfd.colors.text,
            textDecoration = if (strike && checked) androidx.compose.ui.text.style.TextDecoration.LineThrough else null,
        )
    }
}

/** Segmented control (.segmented). */
@Composable
fun Segmented(options: List<Pair<String, String>>, selected: String, modifier: Modifier = Modifier, onSelect: (String) -> Unit) {
    val c = Wfd.colors
    Row(
        modifier
            .clip(RoundedCornerShape(10.dp))
            .border(1.dp, c.line, RoundedCornerShape(10.dp))
            .background(c.surface2),
    ) {
        options.forEach { (value, label) ->
            val on = value == selected
            Box(
                Modifier
                    .weight(1f, fill = false)
                    .clip(RoundedCornerShape(9.dp))
                    .background(if (on) c.accent else Color.Transparent)
                    .clickable { onSelect(value) }
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(label, color = if (on) c.accentText else c.text, fontSize = 13.sp, maxLines = 1)
            }
        }
    }
}

@Composable
fun Stepper(label: String, value: Int, min: Int, max: Int, modifier: Modifier = Modifier, onChange: (Int) -> Unit) {
    Row(modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(label, modifier = Modifier.weight(1f), fontSize = 14.sp)
        StepButton("−", value > min) { onChange((value - 1).coerceAtLeast(min)) }
        Text(value.toString(), modifier = Modifier.width(36.dp), textAlign = androidx.compose.ui.text.style.TextAlign.Center, fontWeight = FontWeight.SemiBold)
        StepButton("+", value < max) { onChange((value + 1).coerceAtMost(max)) }
    }
}

@Composable
private fun StepButton(text: String, enabled: Boolean, onClick: () -> Unit) {
    val c = Wfd.colors
    Box(
        Modifier
            .size(34.dp)
            .clip(CircleShape)
            .border(1.dp, c.line, CircleShape)
            .then(if (enabled) Modifier.clickable(onClick = onClick) else Modifier),
        contentAlignment = Alignment.Center,
    ) { Text(text, color = if (enabled) c.text else c.muted.copy(alpha = 0.4f), fontSize = 18.sp) }
}

/** Dropdown select (replacement for <select>). Options: value → label; null value = header. */
@Composable
fun Select(
    label: String,
    options: List<Pair<String?, String>>,
    modifier: Modifier = Modifier,
    asPill: Boolean = false,
    onSelect: (String) -> Unit,
) {
    var open by remember { mutableStateOf(false) }
    Box(modifier) {
        if (asPill) Pill(label, onClick = { open = true }) else SecondaryButton(label, Modifier.fillMaxWidth()) { open = true }
        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            options.forEach { (value, text) ->
                if (value == null) {
                    Text(text, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Wfd.colors.muted)
                } else {
                    DropdownMenuItem(text = { Text(text) }, onClick = { open = false; onSelect(value) })
                }
            }
        }
    }
}

/**
 * Text field that saves on focus loss / Done instead of on every keystroke, so typing stays
 * smooth while the value syncs to the other phones (TextField.tsx). With [clearOnCommit] it is
 * an "add" input that empties itself.
 */
@Composable
fun CommitField(
    value: String,
    onCommit: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    label: String? = null,
    singleLine: Boolean = true,
    clearOnCommit: Boolean = false,
) {
    var draft by remember { mutableStateOf(value) }
    var focused by remember { mutableStateOf(false) }
    LaunchedEffect(value) { if (!focused) draft = value }
    val focus = LocalFocusManager.current
    val commit = {
        if (draft != value) onCommit(draft)
        if (clearOnCommit) draft = ""
    }
    OutlinedTextField(
        value = draft,
        onValueChange = { draft = it },
        modifier = modifier.onFocusChanged {
            if (focused && !it.isFocused) commit()
            focused = it.isFocused
        },
        placeholder = if (placeholder.isNotEmpty()) ({ Text(placeholder, fontSize = 14.sp) }) else null,
        label = if (label != null) ({ Text(label) }) else null,
        singleLine = singleLine,
        minLines = if (singleLine) 1 else 2,
        textStyle = MaterialTheme.typography.bodyMedium,
        keyboardOptions = KeyboardOptions(imeAction = if (singleLine) ImeAction.Done else ImeAction.Default),
        keyboardActions = KeyboardActions(onDone = {
            commit()
            if (!clearOnCommit) focus.clearFocus()
        }),
    )
}

/** Plain controlled text input. */
@Composable
fun Input(
    value: String,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    label: String? = null,
    singleLine: Boolean = true,
    minLines: Int = 1,
    onDone: (() -> Unit)? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        modifier = modifier,
        placeholder = if (placeholder.isNotEmpty()) ({ Text(placeholder, fontSize = 14.sp) }) else null,
        label = if (label != null) ({ Text(label) }) else null,
        singleLine = singleLine,
        minLines = minLines,
        textStyle = MaterialTheme.typography.bodyMedium,
        keyboardOptions = KeyboardOptions(imeAction = if (singleLine) ImeAction.Done else ImeAction.Default),
        keyboardActions = KeyboardActions(onDone = { onDone?.invoke() }),
    )
}

/** Opens the platform date picker; [max] limits the selectable range (ISO). */
@Composable
fun rememberDatePicker(max: String? = null, onPick: (String) -> Unit): (String?) -> Unit {
    val context = LocalContext.current
    return { initial: String? ->
        val d = initial?.takeIf { Dates.isValid(it) }?.let { Dates.fromISO(it) } ?: LocalDate.now()
        val dlg = DatePickerDialog(context, { _, y, m, day -> onPick(LocalDate.of(y, m + 1, day).toString()) }, d.year, d.monthValue - 1, d.dayOfMonth)
        if (max != null) dlg.datePicker.maxDate = Dates.fromISO(max).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli() + 86_399_000
        dlg.show()
    }
}

@Composable
fun rememberTimePicker(onPick: (String) -> Unit): (String?) -> Unit {
    val context = LocalContext.current
    return { initial: String? ->
        val parts = initial?.split(":")
        val h = parts?.getOrNull(0)?.toIntOrNull() ?: 18
        val m = parts?.getOrNull(1)?.toIntOrNull() ?: 0
        TimePickerDialog(context, { _, hh, mm -> onPick("%02d:%02d".format(hh, mm)) }, h, m, true).show()
    }
}

@Composable
fun VSpace(h: Dp = 8.dp) = Spacer(Modifier.height(h))

@Composable
fun HSpace(w: Dp = 8.dp) = Spacer(Modifier.width(w))

// ---------------------------------------------------------------- dish widgets

/** Original name (in its script) with the romanisation in brackets, then the translation (DishName.tsx). */
@Composable
fun DishNameView(dish: Dish, size: String = "md", modifier: Modifier = Modifier) {
    val store = LocalStore.current
    val lang = store.lang
    val c = Wfd.colors
    val origSize = when (size) { "lg" -> 20.sp; "sm" -> 15.sp; else -> 17.sp }
    val transSize = when (size) { "lg" -> 15.sp; "sm" -> 12.sp; else -> 13.sp }
    val translation = dish.name[lang]
    Column(modifier) {
        Text(
            buildString {
                append(dish.name.orig)
                dish.name.roman?.let { append(" ($it)") }
            },
            fontSize = origSize,
            fontWeight = FontWeight.SemiBold,
            color = c.text,
            lineHeight = origSize * 1.25,
        )
        if (translation.isNotEmpty() && translation != dish.name.orig) Text(translation, fontSize = transSize, color = c.muted, lineHeight = transSize * 1.25)
    }
}

/** "Italian · quick · last eaten 12 days ago" (DishMeta.tsx). */
@Composable
fun DishMeta(dish: Dish, showLast: Boolean = true, compact: Boolean = false) {
    val store = LocalStore.current
    val i = store.i18n
    val stats = store.stats
    val parts = mutableListOf<String>()
    if (dish.kind == Kind.EATOUT) {
        parts.add(i.t(if (dish.takeaway == true) "dish.takeaway" else "dish.restaurantOnly"))
        dish.place?.let { parts.add(it) }
    } else {
        parts.add(i.cuisine(dish.cuisine))
        if (dish.kind != Kind.COMBO) parts.add(i.t("dish.effort${dish.effort}"))
    }
    if (showLast) {
        val next = stats.next[dish.id]
        val last = stats.last[dish.id]
        when {
            next != null -> parts.add(i.t("dish.plannedOn", "d" to Format.day(next, i.lang)))
            last != null -> {
                val n = Dates.daysBetween(last, stats.today)
                parts.add(if (n == 0) i.t("dish.lastEatenToday") else i.t("dish.lastEaten", "n" to n))
            }
            dish.kind != Kind.COMBO && dish.kind != Kind.EATOUT && !compact -> parts.add(i.t("dish.neverEaten"))
        }
    }
    var text = parts.joinToString(" · ")
    if (dish.has("vegan")) text += " · 🌱" else if (dish.has("veggie")) text += " · 🥕"
    dish.rating?.takeIf { it > 0 }?.let { text += " · " + "★".repeat(it) }
    if (dish.has("spicy")) text += " · 🌶"
    Text(text, fontSize = 12.sp, color = Wfd.colors.muted, lineHeight = 16.sp)
}

@Composable
fun FavButton(dish: Dish) {
    val store = LocalStore.current
    val on = dish.id in store.state.favorites
    Box(
        Modifier
            .size(36.dp)
            .clip(CircleShape)
            .clickable { store.toggleFavorite(dish.id) },
        contentAlignment = Alignment.Center,
    ) {
        Text(if (on) "♥" else "♡", fontSize = 20.sp, color = if (on) Wfd.colors.accent else Wfd.colors.muted)
    }
}

/** Coloured tags of the people whose favourite this is / who don't like it (FanTags.tsx). */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FanTags(dish: Dish) {
    val store = LocalStore.current
    val s = store.state
    val fans = s.labels.filter { s.labelFavorites[it.id]?.contains(dish.id) == true }
    val haters = s.labels.filter { s.labelDislikes[it.id]?.contains(dish.id) == true }
    if (fans.isEmpty() && haters.isEmpty()) return
    FlowRow(Modifier.padding(top = 4.dp), horizontalArrangement = Arrangement.spacedBy(4.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        fans.forEach { Tag("★ ${it.name}", Wfd.colors.label(it.color)) }
        haters.forEach { Tag("👎 ${it.name}", Wfd.colors.label(it.color), faded = true) }
    }
}

/** List row of a dish (name, meta, fan tags, heart). */
@Composable
fun DishRow(dish: Dish, trailing: (@Composable () -> Unit)? = null, onClick: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            DishNameView(dish, "sm")
            DishMeta(dish)
            FanTags(dish)
        }
        if (trailing != null) trailing() else if (dish.kind != Kind.COMBO) FavButton(dish)
    }
    androidx.compose.material3.HorizontalDivider(color = Wfd.colors.line)
}

fun comboIcon(type: String) = de.nevbie.whatsfordinner.core.Combos.ICONS[type] ?: "🍽"

// ---------------------------------------------------------------- filters

/** Filter panel (FilterBar.tsx). */
@Composable
fun FilterBar(filters: Filters, onChange: (Filters) -> Unit, showEatOut: Boolean = true) {
    val store = LocalStore.current
    val i = store.i18n
    val c = Wfd.colors
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Segmented(listOf("any" to i.t("filter.diet.any"), "veggie" to i.t("filter.diet.veggie"), "vegan" to i.t("filter.diet.vegan")), filters.diet) {
            onChange(filters.copy(diet = it))
        }
        Column {
            FieldLabel(i.t("filter.cuisine"))
            ScrollRow {
                Classify.REGIONS.forEach { r ->
                    Pill(i.t("region.$r"), r in filters.regions, color = c.brand) { onChange(filters.copy(regions = FilterLogic.toggleIn(filters.regions, r))) }
                }
                FilterLogic.CUISINE_GROUPS.forEach { g ->
                    Pill(i.t("cg.$g"), g in filters.cuisines) { onChange(filters.copy(cuisines = FilterLogic.toggleIn(filters.cuisines, g))) }
                }
            }
        }
        Column {
            FieldLabel(i.t("filter.staple"))
            ScrollRow {
                Classify.STAPLES.forEach { st ->
                    Pill("${Classify.STAPLE_ICONS[st]} ${i.t("staple.$st")}", st in filters.staples) { onChange(filters.copy(staples = FilterLogic.toggleIn(filters.staples, st))) }
                }
            }
        }
        Column {
            FieldLabel(i.t("filter.props"))
            ScrollRow {
                Pill("🧒 ${i.t("filter.kids")}", filters.kids) { onChange(filters.copy(kids = !filters.kids)) }
                Pill(i.t("filter.noSpicy"), filters.noSpicy) { onChange(filters.copy(noSpicy = !filters.noSpicy)) }
                Pill("⏱ ${i.t("filter.quick")}", filters.maxEffort == 1) { onChange(filters.copy(maxEffort = if (filters.maxEffort == 1) 3 else 1)) }
                Pill(i.t("filter.noProject"), filters.maxEffort == 2) { onChange(filters.copy(maxEffort = if (filters.maxEffort == 2) 3 else 2)) }
                Pill("🍮 ${i.t("filter.sweet")}", filters.sweetOnly) { onChange(filters.copy(sweetOnly = !filters.sweetOnly)) }
            }
        }
        Column {
            FieldLabel(i.t("filter.loved"))
            ScrollRow {
                Pill("♥ ${i.t("filter.favorites")}", filters.favoritesOnly) { onChange(filters.copy(favoritesOnly = !filters.favoritesOnly)) }
                if (store.state.labels.isNotEmpty()) Pill("👍 ${i.t("filter.noDislikes")}", filters.noDislikes) { onChange(filters.copy(noDislikes = !filters.noDislikes)) }
                store.state.labels.forEach { l ->
                    Pill("★ ${l.name}", l.id in filters.favLabels, color = c.label(l.color)) { onChange(filters.copy(favLabels = FilterLogic.toggleIn(filters.favLabels, l.id))) }
                }
                if (showEatOut) Pill("🍽 ${i.t("filter.eatOut")}", filters.eatOut) { onChange(filters.copy(eatOut = !filters.eatOut)) }
            }
        }
    }
}

/** Filter button with the number of active filters. */
@Composable
fun FilterToggle(filters: Filters, open: Boolean, onClick: () -> Unit) {
    val n = FilterLogic.activeFilterCount(filters)
    Pill("⚙︎ ${LocalStore.current.t("suggest.filters")}" + if (n > 0) " ($n)" else "", open, onClick = onClick)
}

/** Text with a tappable line (for headers in sheets). */
@Composable
fun TitleRow(title: String, modifier: Modifier = Modifier, trailing: @Composable RowScope.() -> Unit = {}) {
    Row(modifier.fillMaxWidth().padding(top = 8.dp, bottom = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(title, style = MaterialTheme.typography.headlineSmall, modifier = Modifier.weight(1f))
        trailing()
    }
}

@Composable
fun SmallTextButton(text: String, onClick: () -> Unit) {
    TextButton(onClick = onClick, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)) { Text(text, fontSize = 13.sp) }
}
