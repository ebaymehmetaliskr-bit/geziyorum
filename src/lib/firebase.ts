import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Fallback to local config for AI Studio / Development
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import localConfig from '../../firebase-applet-config.json';

// Try to use environment variables first (for Vercel/Production)
let firebaseConfig;
let dbId;

if (import.meta.env.VITE_FIREBASE_API_KEY) {
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
} else {
  firebaseConfig = {
    apiKey: localConfig?.apiKey,
    authDomain: localConfig?.authDomain,
    projectId: localConfig?.projectId,
    storageBucket: localConfig?.storageBucket,
    messagingSenderId: localConfig?.messagingSenderId,
    appId: localConfig?.appId
  };
  dbId = localConfig?.firestoreDatabaseId;
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

