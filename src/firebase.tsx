import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check
if (typeof window !== "undefined") {
  // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    ),
    isTokenAutoRefreshEnabled: true, // Automatically refreshes the "passport"
  });
}

// Export the database instance to use it elsewhere
export const db = getFirestore(app);
