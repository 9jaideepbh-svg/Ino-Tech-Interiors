import { Project } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Maximize2, X } from "lucide-react";
import buildingImg from "@assets/20180309_175550_1772781756286.jpg";
import cmHouseImg from "@assets/IMG_20260306_091320_1772782464446.jpg";
import {
  optimizeImage,
  isCloudinaryUrl,
  cloudinaryUrl,
  cloudinarySrcSet,
} from "@/lib/cloudinary-utils";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  TouchEvent as ReactTouchEvent,
} from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  // fullLoaded: true once the hi-res image has finished loading
  const [fullLoaded, setFullLoaded] = useState(false);

  // ── Pinch / double-tap zoom state ──────────────────────────────────────────
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const lastDist = useRef<number | null>(null);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  // ── Source resolution ──────────────────────────────────────────────────────
  const isCityCivilCourt = project.title === "City Civil Court";
  const isCMHouse = project.title === "Chief Minister Residential House";

  const rawImage: string =
    isCityCivilCourt ? buildingImg : isCMHouse ? cmHouseImg : project.imageUrl;

  // Thumb — already loaded by the card, used for instant display
  const thumb = optimizeImage(rawImage, {
    width: 600,
    height: 400,
    thumbnail: true,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  });

  // Full-res — loaded silently after lightbox opens
  const fullSrc = isCloudinaryUrl(rawImage)
    ? cloudinaryUrl(rawImage, { width: 1600, crop: "limit", quality: "auto:best" })
    : typeof rawImage === "string" && rawImage.includes("unsplash.com")
    ? rawImage.replace(/w=\d+/, "w=1600").replace(/auto=format/, "auto=format,compress&fm=webp")
    : rawImage;

  const fullSrcSet = isCloudinaryUrl(rawImage)
    ? cloudinarySrcSet(rawImage, { widths: [800, 1200, 1600, 2000], crop: "limit" })
    : undefined;

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  // Lock body scroll; reset zoom on close
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset zoom when closing
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      setFullLoaded(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  // ── Touch: pinch-to-zoom + drag-when-zoomed ───────────────────────────────
  const onTouchStart = (e: ReactTouchEvent) => {
    if (e.touches.length === 2) {
      // Two fingers: start of pinch
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      // Single finger: check double-tap
      const now = Date.now();
      if (now - lastTap.current < 300) {
        // Double-tap: toggle zoom 1× ↔ 2.5×
        if (scale > 1) {
          setScale(1);
          setTranslate({ x: 0, y: 0 });
        } else {
          setScale(2.5);
        }
      }
      lastTap.current = now;

      // Store start position for drag
      if (scale > 1) {
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          tx: translate.x,
          ty: translate.y,
        };
      }
    }
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 2 && lastDist.current !== null) {
      // Pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastDist.current;
      setScale((s) => Math.min(Math.max(s * ratio, 1), 5));
      lastDist.current = dist;
    } else if (e.touches.length === 1 && dragStart.current && scale > 1) {
      // Drag while zoomed
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setTranslate({ x: dragStart.current.tx + dx, y: dragStart.current.ty + dy });
    }
  };

  const onTouchEnd = (e: ReactTouchEvent) => {
    if (e.touches.length < 2) lastDist.current = null;
    if (e.touches.length === 0) dragStart.current = null;
    // Snap back to 1× if pinched below threshold
    if (scale < 1.1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  };

  return (
    <>
      {/* ── PROJECT CARD ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.45 }}
        whileHover={{ y: -5 }}
        onClick={handleOpen}
        className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-border/10 transition-all duration-300 h-full flex flex-col cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title} – ${project.category}`}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      >
        {/* Card image */}
        <div className="relative h-60 sm:h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10 group-hover:opacity-40 transition-opacity duration-300"
            aria-hidden="true"
          />
          <img
            src={thumb.src}
            srcSet={thumb.srcSet}
            sizes={thumb.sizes}
            alt={`${project.title} – ${project.category} project by Inotech Interiors`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
          />
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
              {project.category}
            </span>
          </div>
        </div>

        {/* Card text */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
            {project.title}
          </h3>
          {project.location && (
            <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm">
              <MapPin className="w-4 h-4 text-secondary flex-shrink-0" aria-hidden="true" />
              <span>{project.location}</span>
            </div>
          )}
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
            {project.description}
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:underline decoration-secondary underline-offset-4 mt-auto">
            View Full Image <Maximize2 className="w-4 h-4 transition-transform group-hover:scale-110" aria-hidden="true" />
          </div>
        </div>
      </motion.div>

      {/* ── FULL-SCREEN LIGHTBOX ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            // True full-screen: covers everything including safe areas
            className="fixed inset-0 z-[9999] bg-black"
            style={{ touchAction: "none" }}
            role="dialog"
            aria-modal="true"
            aria-label={`Full image of ${project.title}`}
          >
            {/* ── CLOSE BUTTON — always top-right, large tap target ── */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[10001] w-12 h-12 rounded-full bg-black/70 border border-white/30 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label="Close image"
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </button>

            {/* ── IMAGE AREA — fills full screen ── */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              // Backdrop tap closes only when not zoomed in
              onClick={() => { if (scale <= 1) handleClose(); }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/*
                TWO-LAYER STRATEGY for instant open:
                1. Show the thumb (already decoded by the card) immediately — zero delay
                2. Load full-res silently in the background
                3. Swap to full-res once it's ready (crossfade)
              */}

              {/* Layer 1: thumb — visible instantly */}
              {!fullLoaded && (
                <img
                  src={thumb.src}
                  alt={`${project.title} – preview`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                    transformOrigin: "center center",
                    transition: scale === 1 ? "transform 0.2s ease" : "none",
                    filter: "blur(1px)",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Layer 2: full-res — loads in background, crossfades in */}
              <img
                src={fullSrc}
                srcSet={fullSrcSet}
                sizes="100vw"
                alt={`${project.title} – full resolution`}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                style={{
                  opacity: fullLoaded ? 1 : 0,
                  transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                  transformOrigin: "center center",
                  transition: scale === 1
                    ? "transform 0.2s ease, opacity 0.3s ease"
                    : "opacity 0.3s ease",
                  // Prevent default browser touch actions (scroll/zoom)
                  touchAction: "none",
                }}
                onLoad={() => setFullLoaded(true)}
                decoding="async"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* ── FOOTER: title + zoom hint ── */}
            <div className="absolute bottom-0 left-0 right-0 z-[10000] pb-safe">
              {/* Gradient fade from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="relative flex flex-col items-center gap-1 px-4 py-4">
                <p className="text-white font-bold text-base text-center drop-shadow-lg tracking-wide line-clamp-1 max-w-xs">
                  {project.title}
                </p>
                {project.location && (
                  <p className="text-white/60 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </p>
                )}
                {/* Zoom hint — fades out */}
                <motion.p
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="text-white/30 text-[10px] mt-0.5 select-none"
                >
                  Pinch to zoom · Double-tap to zoom · Tap anywhere to close
                </motion.p>
              </div>
            </div>

            {/* Loading shimmer — only while thumb is blurred and full isn't ready */}
            {!fullLoaded && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] pointer-events-none">
                <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
