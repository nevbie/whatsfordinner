import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

/** Gradle property (-P / ~/.gradle/gradle.properties) or environment variable, "" when missing. */
fun config(name: String): String =
    (providers.gradleProperty(name).orNull ?: providers.environmentVariable(name).orNull ?: "").trim()

fun quoted(value: String) = "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\""

android {
    namespace = "de.nevbie.whatsfordinner"
    compileSdk = 35

    defaultConfig {
        applicationId = "de.nevbie.whatsfordinner"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        // Firebase web config of the family project; empty → the app works locally only.
        buildConfigField("String", "FIREBASE_API_KEY", quoted(config("FIREBASE_API_KEY")))
        buildConfigField("String", "FIREBASE_PROJECT_ID", quoted(config("FIREBASE_PROJECT_ID")))
        buildConfigField("String", "FIREBASE_APP_ID", quoted(config("FIREBASE_APP_ID")))
        buildConfigField("String", "FIREBASE_AUTH_DOMAIN", quoted(config("FIREBASE_AUTH_DOMAIN")))
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    // shared/dishes.json and shared/strings.json (exported from the web app) are bundled as assets
    sourceSets["main"].assets.srcDir(rootProject.file("../shared"))

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

kotlin {
    compilerOptions { jvmTarget.set(JvmTarget.JVM_17) }
}

dependencies {
    implementation(project(":core"))

    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.9.0")

    // Firebase (configured in code from BuildConfig – no google-services plugin / json)
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-firestore")
    implementation("com.google.firebase:firebase-auth")
}
