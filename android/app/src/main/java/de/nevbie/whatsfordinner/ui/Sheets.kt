package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/** Frame of every sheet (Sheet.tsx): title row with ✕, scrolling body, optional footer. */
@Composable
fun ColumnScope.SheetFrame(
    title: @Composable () -> Unit,
    onClose: () -> Unit,
    tall: Boolean = false,
    footer: (@Composable () -> Unit)? = null,
    body: LazyListScope.() -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .then(if (tall) Modifier.fillMaxHeight(0.95f) else Modifier)
            .imePadding(),
    ) {
        Row(Modifier.fillMaxWidth().padding(start = 16.dp, end = 8.dp, bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.weight(1f)) { title() }
            IconText("✕", onClick = onClose)
        }
        HorizontalDivider(color = Wfd.colors.line)
        LazyColumn(
            Modifier.weight(1f, fill = tall),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
            content = body,
        )
        if (footer != null) {
            HorizontalDivider(color = Wfd.colors.line)
            Box(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp)) { footer() }
        }
    }
}
