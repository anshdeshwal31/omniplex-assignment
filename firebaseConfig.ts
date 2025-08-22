import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase Config
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if no apps exist and we have the required config
const app = getApps().length === 0 && firebaseConfig.projectId 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

let db: any = null;
let storage: any = null;

// Only initialize Firestore and Storage if we have a valid app
if (app && firebaseConfig.projectId) {
  try {
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase services not available during build time:', error);
  }
}

export { db, storage };

export const initializeFirebase = () => {
  return app;
};
