// ─────────────────────────────────────────────────────────────────────────────
// Firebase Authentication Service – INOTECH Interiors
// Supports: Email/Password  +  Google Sign-In (whitelist enforced)
// ─────────────────────────────────────────────────────────────────────────────
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

// ── Allowed Google accounts ───────────────────────────────────────────────────
// Add / remove emails here. Firestore security rules mirror this during deployment.
export const ALLOWED_GOOGLE_EMAILS: string[] = [
  "9jaideepbh@gmail.com",
  "inotechinteriors@gmail.com",
];

const googleProvider = new GoogleAuthProvider();
// Force account picker every time so the user can switch accounts
googleProvider.setCustomParameters({ prompt: "select_account" });

// ── Email/Password login ──────────────────────────────────────────────────────
export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

// ── Google Sign-In (whitelist-gated) ─────────────────────────────────────────
/**
 * Opens the Google sign-in popup.
 * If the signed-in account is NOT in ALLOWED_GOOGLE_EMAILS the user is
 * immediately signed out and an error is thrown.
 */
export async function loginWithGoogle(): Promise<UserCredential> {
  const credential = await signInWithPopup(auth, googleProvider);
  const email = credential.user.email ?? "";

  if (!ALLOWED_GOOGLE_EMAILS.includes(email.toLowerCase())) {
    // Sign out the unauthorized account immediately
    await signOut(auth);
    throw new Error(
      `Access denied. "${email}" is not an authorized admin account.`
    );
  }

  return credential;
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  return signOut(auth);
}

// ── Auth state listener ───────────────────────────────────────────────────────
/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/** Get the currently authenticated user (synchronous snapshot) */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
