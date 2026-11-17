import type { FirebaseOptions } from 'firebase/app';

/** Reads the build-time Firebase settings; null when any are missing so sharing can degrade gracefully. */
function readFirebaseConfig(): FirebaseOptions | null {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const isComplete = Object.values(config).every((value) => typeof value === 'string' && value.trim() !== '');
  return isComplete ? config : null;
}

export const firebaseConfig = readFirebaseConfig();

export const isFirebaseConfigured = firebaseConfig !== null;
