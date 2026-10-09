package de.nevbie.whatsfordinner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import de.nevbie.whatsfordinner.data.AppStore
import de.nevbie.whatsfordinner.ui.WfdApp
import de.nevbie.whatsfordinner.ui.WfdTheme

class MainActivity : ComponentActivity() {
    private val store: AppStore by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WfdTheme {
                WfdApp(store)
            }
        }
    }
}
