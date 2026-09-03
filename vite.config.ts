import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },

  root: path.resolve(import.meta.dirname, "client"),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,

    // Target: evergreen browsers only — zero polyfills, smallest possible output
    // Chrome 100+ (Apr 2022), Firefox 100+ (May 2022), Safari 15.4+ (Mar 2022), Edge 100+
    target: ["es2022", "chrome100", "firefox100", "safari15.4", "edge100"],

    // Enable minification
    minify: "esbuild",

    // CSS code splitting
    cssCodeSplit: true,

    // Asset inlining threshold — inline tiny assets
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        // Cache-friendly hashed filenames
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",

        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor: React core — changes rarely
          "vendor-react": ["react", "react-dom"],
          // Vendor: framer-motion — large, changes rarely
          "vendor-motion": ["framer-motion"],
          // Vendor: tanstack query
          "vendor-query": ["@tanstack/react-query"],
          // Vendor: Firebase
          "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
          // Radix UI primitives — stable
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-toast",
            "@radix-ui/react-select",
            "@radix-ui/react-tooltip",
          ],
        },
      },
    },

    // Report bundle size
    reportCompressedSize: true,

    // Increase chunk size warning threshold (we're intentionally splitting)
    chunkSizeWarningLimit: 800,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "@tanstack/react-query",
      "wouter",
    ],
  },
});
