package de.nevbie.whatsfordinner.data

import de.nevbie.whatsfordinner.core.Change
import de.nevbie.whatsfordinner.core.FamilyState
import de.nevbie.whatsfordinner.core.StateOps
import java.io.File

/** Storage for the shared family state: a JSON file on this device, or Firebase for the family. */
interface Backend {
    /** Calls [onState] with the current state and on every change; returns the unsubscribe function. */
    fun subscribe(onState: (FamilyState) -> Unit, onError: (Throwable) -> Unit): () -> Unit
    suspend fun apply(change: Change)
}

/** The device-local copy of the state (filesDir/state.json) – same role as localStorage 'wfd:state'. */
class LocalStateFile(dir: File) {
    private val file = File(dir, "state.json")

    fun read(): FamilyState = try {
        if (file.exists()) StateOps.parseState(file.readText()) else FamilyState()
    } catch (e: Exception) {
        FamilyState()
    }

    @Synchronized
    fun write(state: FamilyState) {
        try {
            val tmp = File(file.parentFile, "state.json.tmp")
            tmp.writeText(StateOps.encodeState(state))
            if (!tmp.renameTo(file)) {
                file.writeText(tmp.readText())
                tmp.delete()
            }
        } catch (e: Exception) {
            // storage full or blocked – keep working in memory
        }
    }
}

/** Single-device storage (port of src/store/local.ts). */
class LocalBackend(private val storage: LocalStateFile) : Backend {
    private var state: FamilyState = storage.read()
    private val listeners = mutableSetOf<(FamilyState) -> Unit>()

    override fun subscribe(onState: (FamilyState) -> Unit, onError: (Throwable) -> Unit): () -> Unit {
        listeners.add(onState)
        onState(state)
        return { listeners.remove(onState) }
    }

    override suspend fun apply(change: Change) {
        state = StateOps.apply(state, change)
        storage.write(state)
        listeners.toList().forEach { it(state) }
    }
}
