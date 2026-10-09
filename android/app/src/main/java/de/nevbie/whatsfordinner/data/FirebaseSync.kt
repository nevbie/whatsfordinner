package de.nevbie.whatsfordinner.data

import android.content.Context
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.FieldPath
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FirebaseFirestoreSettings
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.PersistentCacheSettings
import de.nevbie.whatsfordinner.BuildConfig
import de.nevbie.whatsfordinner.core.Change
import de.nevbie.whatsfordinner.core.FamilyCode
import de.nevbie.whatsfordinner.core.FamilyState
import de.nevbie.whatsfordinner.core.FieldOp
import de.nevbie.whatsfordinner.core.RemoteOps
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.tasks.await

/**
 * One Firestore document per family: families/{CODE without dashes} – the same document the
 * web app uses (src/store/firebase.ts). Firebase is initialised by hand from BuildConfig
 * (no google-services.json). Anonymous sign-in before any access; offline persistence on.
 */
object FirebaseSync {
    private const val APP_NAME = "wfd"

    /** true when the build has a Firebase config; otherwise the app is local-only. */
    val available: Boolean
        get() = BuildConfig.FIREBASE_API_KEY.isNotBlank() && BuildConfig.FIREBASE_PROJECT_ID.isNotBlank() && BuildConfig.FIREBASE_APP_ID.isNotBlank()

    private var db: FirebaseFirestore? = null
    private val lock = Mutex()

    private fun options(): FirebaseOptions {
        val appId = BuildConfig.FIREBASE_APP_ID
        // appId format 1:<senderId>:<platform>:<hash> – the sender id is the second segment
        val senderId = appId.split(":").getOrNull(1).orEmpty()
        return FirebaseOptions.Builder()
            .setApiKey(BuildConfig.FIREBASE_API_KEY)
            .setApplicationId(appId)
            .setProjectId(BuildConfig.FIREBASE_PROJECT_ID)
            .apply { if (senderId.isNotEmpty()) setGcmSenderId(senderId) }
            .build()
    }

    suspend fun firestore(context: Context): FirebaseFirestore = lock.withLock {
        check(available) { "Firebase is not configured" }
        val app = FirebaseApp.getApps(context).firstOrNull { it.name == APP_NAME }
            ?: FirebaseApp.initializeApp(context.applicationContext, options(), APP_NAME)
        val fs = db ?: FirebaseFirestore.getInstance(app).also {
            it.firestoreSettings = FirebaseFirestoreSettings.Builder()
                .setLocalCacheSettings(PersistentCacheSettings.newBuilder().build())
                .build()
            db = it
        }
        val auth = FirebaseAuth.getInstance(app)
        if (auth.currentUser == null) auth.signInAnonymously().await()
        fs
    }

    suspend fun doc(context: Context, code: String): DocumentReference =
        firestore(context).collection("families").document(FamilyCode.docId(code))

    suspend fun createFamily(context: Context, code: String, initial: FamilyState) {
        doc(context, code).set(RemoteOps.documentFor(initial)).await()
    }

    suspend fun familyExists(context: Context, code: String): Boolean = doc(context, code).get().await().exists()
}

/** Field-level updates exactly like the web app (see core RemoteOps). */
class FirebaseBackend(private val context: Context, private val code: String) : Backend {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override fun subscribe(onState: (FamilyState) -> Unit, onError: (Throwable) -> Unit): () -> Unit {
        var registration: ListenerRegistration? = null
        var cancelled = false
        scope.launch {
            try {
                val ref = FirebaseSync.doc(context, code)
                if (cancelled) return@launch
                registration = ref.addSnapshotListener { snap, err ->
                    if (err != null) onError(err)
                    else if (snap != null) onState(RemoteOps.stateFrom(snap.data))
                }
            } catch (e: Exception) {
                onError(e)
            }
        }
        return {
            cancelled = true
            registration?.remove()
        }
    }

    override suspend fun apply(change: Change) {
        val updates = RemoteOps.updatesFor(change)
        if (updates.isEmpty()) return
        val ref = FirebaseSync.doc(context, code)
        val pairs = updates.map { u ->
            val value: Any = when (val op = u.op) {
                is FieldOp.Set -> op.value
                FieldOp.Delete -> FieldValue.delete()
                is FieldOp.ArrayUnion -> FieldValue.arrayUnion(op.value)
                is FieldOp.ArrayRemove -> FieldValue.arrayRemove(op.value)
            }
            FieldPath.of(*u.path.toTypedArray()) to value
        }
        val rest = pairs.drop(1).flatMap { listOf(it.first, it.second) }.toTypedArray()
        ref.update(pairs[0].first, pairs[0].second, *rest).await()
    }
}
