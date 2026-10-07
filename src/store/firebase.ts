import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import {
  arrayRemove,
  arrayUnion,
  deleteField,
  doc,
  FieldPath,
  getDoc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore'
import type { FamilyState } from '../data/types'
import { firebaseConfig } from '../firebaseConfig'
import { keepEntry, normalize, type Backend } from './backend'

/**
 * One Firestore document per family: families/{CODE}. The code is a long random
 * string that works like a shared password – whoever knows it can read and edit the plan.
 * Field-level updates (plan.<date>, favorites array ops) keep concurrent edits from
 * different phones from overwriting each other.
 */

let app: FirebaseApp | undefined
let db: Firestore | undefined

async function init(): Promise<Firestore> {
  if (!firebaseConfig) throw new Error('Firebase is not configured')
  if (!app) app = getApps()[0] ?? initializeApp(firebaseConfig)
  if (!db) {
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    })
  }
  const auth = getAuth(app)
  if (!auth.currentUser) await signInAnonymously(auth)
  return db
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function newFamilyCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`
}

/** Normalise user input ("abcd efgh-jkmn") to the stored form. */
export function cleanCode(code: string): string {
  const c = code.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return c.length === 12 ? `${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}` : c
}

const docId = (code: string) => cleanCode(code).replace(/-/g, '')

export async function createFamily(code: string, initial: FamilyState): Promise<void> {
  const fs = await init()
  await setDoc(doc(fs, 'families', docId(code)), initial)
}

export async function familyExists(code: string): Promise<boolean> {
  const fs = await init()
  return (await getDoc(doc(fs, 'families', docId(code)))).exists()
}

export function firebaseBackend(code: string): Backend {
  const ref = async () => doc(await init(), 'families', docId(code))
  return {
    subscribe(onState, onError) {
      let unsub: (() => void) | undefined
      let cancelled = false
      ref()
        .then((r) => {
          if (cancelled) return
          unsub = onSnapshot(r, (snap) => onState(normalize(snap.data() as Partial<FamilyState>)), onError)
        })
        .catch(onError)
      return () => {
        cancelled = true
        unsub?.()
      }
    },
    async setDay(date, entry) {
      const r = await ref()
      await updateDoc(r, new FieldPath('plan', date), keepEntry(entry) ? entry : deleteField())
    },
    async setFavorite(id, on) {
      await updateDoc(await ref(), { favorites: on ? arrayUnion(id) : arrayRemove(id) })
    },
    async saveDish(dish) {
      await updateDoc(await ref(), new FieldPath('customDishes', dish.id), dish)
    },
    async deleteDish(id) {
      await updateDoc(await ref(), new FieldPath('customDishes', id), deleteField())
    },
    async saveParty(party) {
      await updateDoc(await ref(), new FieldPath('parties', party.id), party)
    },
    async deleteParty(id) {
      await updateDoc(await ref(), new FieldPath('parties', id), deleteField())
    },
    async saveLabels(labels) {
      await updateDoc(await ref(), { labels })
    },
    async deleteLabel(id, remaining) {
      await updateDoc(await ref(), 'labels', remaining, new FieldPath('labelFavorites', id), deleteField(), new FieldPath('labelDislikes', id), deleteField())
    },
    async setLabelFavorite(labelId, dishId, on) {
      await updateDoc(await ref(), new FieldPath('labelFavorites', labelId), on ? arrayUnion(dishId) : arrayRemove(dishId))
    },
    async setLabelDislike(labelId, dishId, on) {
      await updateDoc(await ref(), new FieldPath('labelDislikes', labelId), on ? arrayUnion(dishId) : arrayRemove(dishId))
    },
    async setHidden(dishId, on) {
      await updateDoc(await ref(), { hiddenDishes: on ? arrayUnion(dishId) : arrayRemove(dishId) })
    },
    async updateSettings(patch) {
      const r = await ref()
      const args = Object.entries(patch).flatMap(([k, v]) => [new FieldPath('settings', k), v])
      if (args.length) await updateDoc(r, args[0] as FieldPath, args[1], ...args.slice(2))
    },
  }
}
