// ─────────────────────────────────────────────────────────────────────────────
// Firebase Configuration – INOTECH Interiors
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPm0TvDDFytq9sQuh_6ynFe8CQsMNzs9E",
  authDomain: "inotech-interiors.firebaseapp.com",
  projectId: "inotech-interiors",
  storageBucket: "inotech-interiors.firebasestorage.app",
  messagingSenderId: "947819629138",
  appId: "1:947819629138:web:ff3289ccf33e4e394d2d8b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
