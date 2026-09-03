// ─────────────────────────────────────────────────────────────────────────────
// useAuth hook – Firebase Authentication
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthState } from "@/lib/firebase-auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
