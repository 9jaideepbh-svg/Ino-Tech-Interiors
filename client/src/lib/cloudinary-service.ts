// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary Upload Service – INOTECH Interiors
//
// UNSIGNED preset (current) – switches to SIGNED automatically
// by changing VITE_CLOUDINARY_UPLOAD_MODE to "signed" and supplying
// a server-side signature endpoint (VITE_CLOUDINARY_SIGN_ENDPOINT).
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD_NAME = "ddcxdhu3k";
const UPLOAD_PRESET = "inotech_interiors"; // Cloudinary preset names must be lowercase with underscores (no spaces!)
const ASSET_FOLDER = "inotech-interiors/projects";

// ── Unsigned upload (active now) ────────────────────────────────────────────
async function uploadUnsigned(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", ASSET_FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary upload failed");
  }

  const json = await res.json();
  return json.secure_url as string;
}

// ── Signed upload (enable before deployment) ─────────────────────────────────
// To switch:
//   1. Set VITE_CLOUDINARY_UPLOAD_MODE=signed in your .env
//   2. Set VITE_CLOUDINARY_SIGN_ENDPOINT=/api/cloudinary/sign (or your route)
//   3. Implement that server-side endpoint to return { signature, timestamp, api_key }
async function uploadSigned(file: File): Promise<string> {
  const signEndpoint =
    import.meta.env.VITE_CLOUDINARY_SIGN_ENDPOINT || "/api/cloudinary/sign";

  const signRes = await fetch(signEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: ASSET_FOLDER }),
  });
  if (!signRes.ok) throw new Error("Failed to get Cloudinary signature");

  const { signature, timestamp, api_key } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", ASSET_FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary signed upload failed");
  }

  const json = await res.json();
  return json.secure_url as string;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Upload a file to Cloudinary.
 * Automatically picks unsigned or signed mode based on env var.
 *
 * @param file - The File object to upload
 * @returns Secure HTTPS URL of the uploaded image
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const mode = import.meta.env.VITE_CLOUDINARY_UPLOAD_MODE || "unsigned";
  if (mode === "signed") {
    return uploadSigned(file);
  }
  return uploadUnsigned(file);
}
