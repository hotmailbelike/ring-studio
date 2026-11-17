import { initializeApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

class FirebaseNotConfiguredError extends Error {
  constructor() {
    super('Firebase is not configured for this build.');
    this.name = 'FirebaseNotConfiguredError';
  }
}

let firestore: Firestore | null = null;

export function getFirestoreClient(): Firestore {
  if (!firebaseConfig) throw new FirebaseNotConfiguredError();
  firestore ??= getFirestore(initializeApp(firebaseConfig));
  return firestore;
}
