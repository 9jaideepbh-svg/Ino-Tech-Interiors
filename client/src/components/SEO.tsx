/**
 * SEO Head component — updates document title and meta description per route.
 * Keeps it lightweight: no external library, no blocking render.
 */
import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

export function SEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Description
    let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement("meta");
      descEl.name = "description";
      document.head.appendChild(descEl);
    }
    descEl.content = description;

    // OG Title
    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    // OG Description
    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;

    // Canonical
    if (canonical) {
      let canonEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonEl) {
        canonEl = document.createElement("link");
        canonEl.rel = "canonical";
        document.head.appendChild(canonEl);
      }
      canonEl.href = canonical;
    }
  }, [title, description, canonical]);

  return null;
}
