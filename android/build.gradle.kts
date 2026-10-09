// Plugin versions live here. The Android Gradle plugin is only put on the classpath when the
// :app module is part of the build (see settings.gradle.kts), so :core builds without Google's
// Maven repository and without an Android SDK.
buildscript {
    val kotlinVersion = "2.1.21"
    val agpVersion = "8.9.1"
    val withApp = rootProject.findProject(":app") != null
    repositories {
        if (withApp) google()
        mavenCentral()
        maven("https://repo1.maven.org/maven2")
        gradlePluginPortal()
    }
    dependencies {
        if (withApp) classpath("com.android.tools.build:gradle:$agpVersion")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
        classpath("org.jetbrains.kotlin:kotlin-serialization:$kotlinVersion")
        if (withApp) classpath("org.jetbrains.kotlin:compose-compiler-gradle-plugin:$kotlinVersion")
    }
}
