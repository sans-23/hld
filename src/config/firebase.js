import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Reads from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-messaging-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder-app-id"
};

let app;
let auth;
let db;
let googleProvider;
let isFirebaseEnabled = false;

// Initialize Firebase only if we have a valid key (not placeholder)
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "placeholder-api-key") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    isFirebaseEnabled = true;
  } catch (error) {
    console.warn("Failed to initialize Firebase:", error);
  }
} else {
  console.log("Firebase is running in local-only mode (No valid API Key detected). Progress will be saved in LocalStorage.");
}

export { auth, db, googleProvider, isFirebaseEnabled };
