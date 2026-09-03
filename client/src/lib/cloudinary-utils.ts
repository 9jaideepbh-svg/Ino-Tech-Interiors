// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary Image Optimization Utilities – INOTECH Interiors
//
// Automatically applies:
//  - Auto format (WebP for Chrome/Firefox/Edge, AVIF where supported)
//  - Auto quality (Cloudinary AI compression)
//  - Correct dimensions to avoid over-fetching
//  - Responsive srcSet generation for <img srcset>
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD_NAME = "ddcxdhu3k";
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Detects if a URL is a Cloudinary URL for this project.
 */
export function isCloudinaryUrl(url: string): boolean {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

/**
 * Builds an optimized Cloudinary transformation URL.
 *
 * @param src    - Original Cloudinary URL (with or without existing transforms)
 * @param width  - Target display width in CSS pixels
 * @param height - Optional: target height (enables crop)
 * @param crop   - Crop mode: "fill" | "fit" | "limit" (default: "fill")
 * @param quality - Quality override (default: "auto:best")
 */
export function cloudinaryUrl(
  src: string,
  {
    width,
    height,
    crop = "fill",
    quality = "auto:best",
    gravity = "auto",
    format = "auto",
  }: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "limit" | "pad" | "scale";
    quality?: string;
    gravity?: string;
    format?: string;
  } = {}
): string {
  if (!src || !isCloudinaryUrl(src)) return src;

  // Build transformation string
  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  if ((crop === "fill" || crop === "pad") && gravity) {
    transforms.push(`g_${gravity}`);
  }
  // DPR: serve 2x for retina but limit bandwidth
  transforms.push("dpr_auto");

  const transformString = transforms.join(",");

  // Insert transformation after /upload/ in the URL
  // Handle URLs that may already have transformations
  if (src.includes("/upload/")) {
    // Remove any existing transformations (everything between /upload/ and the version or path)
    const uploadIdx = src.indexOf("/upload/") + "/upload/".length;
    const afterUpload = src.slice(uploadIdx);

    // Check if there's an existing transformation segment (starts with letters, not v<digits> or folder)
    const hasTransform = /^[a-z_]+[_,]/i.test(afterUpload) && !afterUpload.startsWith("v");
    const cleanPath = hasTransform
      ? afterUpload.slice(afterUpload.indexOf("/") + 1)
      : afterUpload;

    return `${CLOUDINARY_BASE}/${transformString}/${cleanPath}`;
  }

  return src;
}

/**
 * Generates an optimized srcSet string for responsive Cloudinary images.
 *
 * @param src     - Original Cloudinary URL
 * @param widths  - Array of widths for srcSet (default: 400, 800, 1200, 1600)
 * @param height  - Optional fixed height ratio relative to widths
 * @param crop    - Crop mode
 */
export function cloudinarySrcSet(
  src: string,
  {
    widths = [400, 800, 1200, 1600],
    height,
    crop = "fill",
    quality = "auto:best",
    gravity = "auto",
  }: {
    widths?: number[];
    height?: number;
    crop?: "fill" | "fit" | "limit" | "pad" | "scale";
    quality?: string;
    gravity?: string;
  } = {}
): string {
  if (!isCloudinaryUrl(src)) return "";

  return widths
    .map((w) => {
      const h = height ? Math.round((height / widths[widths.length - 1]) * w) : undefined;
      const url = cloudinaryUrl(src, { width: w, height: h, crop, quality, gravity });
      return `${url} ${w}w`;
    })
    .join(", ");
}

/**
 * Optimizes Unsplash URLs with WebP format and proper sizing.
 *
 * @param src   - Unsplash image URL
 * @param width - Target width
 */
export function unsplashUrl(src: string, width: number): string {
  if (!src || !src.includes("unsplash.com")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("auto", "format,compress");
  url.searchParams.set("fm", "webp");
  url.searchParams.set("q", "80");
  url.searchParams.set("fit", "crop");
  return url.toString();
}

/**
 * Unified image optimizer: handles Cloudinary, Unsplash, and static assets.
 *
 * Returns { src, srcSet, sizes } ready for <img> attributes.
 */
export function optimizeImage(
  src: string,
  {
    width = 800,
    height,
    thumbnail = false,
    sizes = "(max-width: 768px) 100vw, 50vw",
  }: {
    width?: number;
    height?: number;
    thumbnail?: boolean;
    sizes?: string;
  } = {}
): { src: string; srcSet?: string; sizes?: string } {
  if (!src) return { src };

  if (isCloudinaryUrl(src)) {
    const displayWidth = thumbnail ? Math.min(width, 600) : width;
    const optimizedSrc = cloudinaryUrl(src, {
      width: displayWidth,
      height,
      crop: thumbnail ? "fill" : "limit",
      quality: thumbnail ? "auto:good" : "auto:best",
    });
    const srcSet = thumbnail
      ? undefined
      : cloudinarySrcSet(src, {
          widths: [400, 800, 1200, 1600],
          height,
          crop: "limit",
        });

    return { src: optimizedSrc, srcSet, sizes: srcSet ? sizes : undefined };
  }

  if (src.includes("unsplash.com")) {
    const thumbSrc = unsplashUrl(src, thumbnail ? 600 : width);
    const srcSet = thumbnail
      ? undefined
      : [600, 900, 1200, 1800]
          .map((w) => `${unsplashUrl(src, w)} ${w}w`)
          .join(", ");

    return { src: thumbSrc, srcSet, sizes: srcSet ? sizes : undefined };
  }

  // Static / bundled asset — return as-is
  return { src };
}
