import type { FirebaseOptions } from 'firebase/app'

/**
 * Firebase project used to sync the family's plan between phones.
 * Values come from VITE_FIREBASE_* environment variables (see README → "Sync between phones").
 * Without them the app still works, but only stores data on the current device.
 */
const env = import.meta.env

export const firebaseConfig: FirebaseOptions | null = env.VITE_FIREBASE_API_KEY
  ? {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      appId: env.VITE_FIREBASE_APP_ID,
    }
  : null
