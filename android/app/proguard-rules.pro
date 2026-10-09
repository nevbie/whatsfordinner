# Release builds are not minified (isMinifyEnabled = false). Rules for kotlinx.serialization
# in case minification is switched on later:
-keepattributes *Annotation*, InnerClasses
-keep,includedescriptorclasses class de.nevbie.whatsfordinner.**$$serializer { *; }
-keepclassmembers class de.nevbie.whatsfordinner.** { *** Companion; }
