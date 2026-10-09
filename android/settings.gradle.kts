import java.util.Properties

pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

/*
 * The Android app module is only included when an Android SDK is available
 * (ANDROID_HOME / ANDROID_SDK_ROOT or sdk.dir in local.properties). Without an SDK,
 * `gradle :core:test` still works, e.g. on machines that cannot reach Google's Maven
 * repository. Pass -PskipApp=true to leave the app out explicitly.
 */
fun androidSdkDir(): String? {
    System.getenv("ANDROID_HOME")?.takeIf { it.isNotBlank() }?.let { return it }
    System.getenv("ANDROID_SDK_ROOT")?.takeIf { it.isNotBlank() }?.let { return it }
    val local = file("local.properties")
    if (local.exists()) {
        val props = Properties()
        local.inputStream().use { props.load(it) }
        props.getProperty("sdk.dir")?.let { return it }
    }
    return null
}

val skipApp = providers.gradleProperty("skipApp").orNull == "true"
val sdkDir = androidSdkDir()
val withApp = !skipApp && sdkDir != null && file(sdkDir).exists()

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        if (withApp) google()
        mavenCentral()
        // mirror of Maven Central (fallback when repo.maven.apache.org rate-limits)
        maven("https://repo1.maven.org/maven2")
    }
}

rootProject.name = "whatsfordinner"

// Pure Kotlin/JVM module with models, data loading and all app logic (+ unit tests).
include(":core")

if (withApp) {
    include(":app")
} else {
    println("whatsfordinner: Android SDK not found (or -PskipApp) – building :core only")
}
