// ─────────────────────────────────────────────────────────────────────────────
// Auth Utilities – Firebase
// ─────────────────────────────────────────────────────────────────────────────

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

/** Redirect to admin login page with optional toast */
export function redirectToLogin(
  toast?: (options: { title: string; description: string; variant: string }) => void
) {
  if (toast) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Please login again.",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    window.location.href = "/admin";
  }, 500);
}
