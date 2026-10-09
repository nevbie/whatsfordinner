package de.nevbie.whatsfordinner.core

import java.io.File

/** Loads the real shared JSON from the repository (../shared). */
object TestData {
    private val dir: File = File(System.getProperty("sharedDir") ?: "../../shared")
    val catalog: Catalog by lazy { Catalog.parse(File(dir, "dishes.json").readText()) }
    val strings: Strings by lazy { Strings.parse(File(dir, "strings.json").readText()) }
    val builtin get() = catalog.builtin
    val byId get() = catalog.builtinById
    const val TODAY = "2026-10-06"

    /** deterministic RNG (same as the web tests) */
    fun seeded(seed: Long = 1): Rng {
        var s = seed
        return {
            s = (s * 16807) % 2147483647
            (s - 1).toDouble() / 2147483646
        }
    }
}
