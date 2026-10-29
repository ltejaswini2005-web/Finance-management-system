import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth } from './config'
import { db } from './config'
import type { UserProfile } from '../types/domain'

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null)
    return () => undefined
  }
  return onAuthStateChanged(auth, callback)
}

export const signIn = (email: string, password: string) => {
  if (!auth) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to .env.local.')
  return signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = () => auth ? signOut(auth) : Promise.resolve()

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? ({ uid, ...snapshot.data() } as UserProfile) : null
}
