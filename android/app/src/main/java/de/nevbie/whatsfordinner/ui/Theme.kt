package de.nevbie.whatsfordinner.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** Berry & Peach palette (top of src/styles.css). */
@Immutable
data class WfdColors(
    val brand: Color,
    val highlight: Color,
    val bg: Color,
    val surface: Color,
    val surface2: Color,
    val text: Color,
    val muted: Color,
    val line: Color,
    val accent: Color,
    val accentText: Color,
    val accentSoft: Color,
    val danger: Color,
    /** colours of the people/group labels (.lbl-0 … .lbl-7) */
    val labels: List<Color>,
) {
    fun label(index: Int) = labels[((index % 8) + 8) % 8]
}

val LightWfd = WfdColors(
    brand = Color(0xFF5B2A4E), highlight = Color(0xFFF7A76C), bg = Color(0xFFFFF5EE), surface = Color(0xFFFFFFFF),
    surface2 = Color(0xFFFFECE2), text = Color(0xFF3B2235), muted = Color(0xFF6E5A69), line = Color(0xFFF1DDD4),
    accent = Color(0xFFD9404C), accentText = Color(0xFFFFFFFF), accentSoft = Color(0xFFFDE2DC), danger = Color(0xFFB4233A),
    labels = listOf(0xFF2563EB, 0xFFDB2777, 0xFF059669, 0xFF9333EA, 0xFFD97706, 0xFF0891B2, 0xFFDC2626, 0xFF65A30D).map { Color(it) },
)

val DarkWfd = WfdColors(
    brand = Color(0xFFE7B6D6), highlight = Color(0xFFF7A76C), bg = Color(0xFF1D1219), surface = Color(0xFF2A1A25),
    surface2 = Color(0xFF362230), text = Color(0xFFF8EBF2), muted = Color(0xFFBEA8B8), line = Color(0xFF47303F),
    accent = Color(0xFFF2707A), accentText = Color(0xFF1D1219), accentSoft = Color(0xFF4C2433), danger = Color(0xFFFF8A8A),
    labels = listOf(0xFF60A5FA, 0xFFF472B6, 0xFF34D399, 0xFFC084FC, 0xFFFBBF24, 0xFF22D3EE, 0xFFF87171, 0xFFA3E635).map { Color(it) },
)

val LocalWfd = staticCompositionLocalOf { LightWfd }

object Wfd {
    val colors: WfdColors @Composable get() = LocalWfd.current
}

@Composable
fun WfdTheme(content: @Composable () -> Unit) {
    val dark = isSystemInDarkTheme()
    val c = if (dark) DarkWfd else LightWfd
    val scheme = if (dark) {
        darkColorScheme(
            primary = c.accent, onPrimary = c.accentText, primaryContainer = c.accentSoft, onPrimaryContainer = c.text,
            secondary = c.brand, onSecondary = c.bg, tertiary = c.highlight,
            background = c.bg, onBackground = c.text, surface = c.surface, onSurface = c.text,
            surfaceVariant = c.surface2, onSurfaceVariant = c.muted, surfaceContainer = c.surface, surfaceContainerLow = c.surface,
            surfaceContainerHigh = c.surface2, outline = c.line, outlineVariant = c.line, error = c.danger,
        )
    } else {
        lightColorScheme(
            primary = c.accent, onPrimary = c.accentText, primaryContainer = c.accentSoft, onPrimaryContainer = c.text,
            secondary = c.brand, onSecondary = Color.White, tertiary = c.highlight,
            background = c.bg, onBackground = c.text, surface = c.surface, onSurface = c.text,
            surfaceVariant = c.surface2, onSurfaceVariant = c.muted, surfaceContainer = c.surface, surfaceContainerLow = c.surface,
            surfaceContainerHigh = c.surface2, outline = c.line, outlineVariant = c.line, error = c.danger,
        )
    }
    val base = Typography()
    val typography = base.copy(
        headlineSmall = base.headlineSmall.copy(fontWeight = FontWeight.Bold, fontSize = 24.sp, color = c.brand),
        titleMedium = base.titleMedium.copy(fontWeight = FontWeight.SemiBold, fontSize = 17.sp),
        titleSmall = base.titleSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 15.sp),
        bodyMedium = base.bodyMedium.copy(fontSize = 15.sp),
        bodySmall = base.bodySmall.copy(fontSize = 13.sp),
        labelMedium = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Medium),
    )
    CompositionLocalProvider(LocalWfd provides c) {
        MaterialTheme(colorScheme = scheme, typography = typography, content = content)
    }
}
