import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's default smallest deviceSizes entry is 640, so a phone screenshot
    // rendered in a ~260px CSS box at DPR 1.75 (455 device px) still downloaded a
    // 640w variant — Lighthouse flagged ~26KB of waste on the LCP image alone.
    // 480 is deliberately the ONLY entry added. A 420 entry was tried and removed:
    // hero-primary renders at three different widths across the page (hero phone,
    // How-It-Works list, showcase), and with both 420 and 480 available the smaller
    // boxes resolved to 420 while the hero resolved to 480 — fetching the same file
    // twice (25KB + 35KB) instead of sharing one request. With 480 alone they all
    // land on one variant. See docs/performance-checklist.md (2026-10-27 audit).
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // AVIF first: the screenshots are already optimized to both .webp and .avif by
    // scripts/optimize-screenshots.mjs, and AVIF is materially smaller for flat UI
    // imagery like app screenshots. Browsers that don't accept it fall back to webp.
    formats: ["image/avif", "image/webp"],
  },
  // NOTE: experimental.optimizePackageImports: ["lucide-react"] was tried for the
  // initial-JS budget and REMOVED — measured 187KB gzip both with and without it.
  // The named imports were already tree-shaken (the whole lucide client chunk is
  // 4KB); the weight is React/ReactDOM (70KB) + Next's router runtime (47KB) +
  // framework internals (38KB). See docs/performance-checklist.md.
  // NOTE: experimental.inlineCss was tried for the render-blocking stylesheet and
  // REVERTED — it measured worse. It clears Lighthouse's render-blocking audit
  // (120ms est.) but grows the HTML document from 27KB to 57KB, and the document is
  // the very first request on the critical path, so net LCP went 3.01s -> 3.23s and
  // Perf 95 -> 93. Keeping the stylesheet as a separate cacheable file wins. Don't
  // re-enable without re-measuring. See docs/performance-checklist.md.
  turbopack: {
    // Pin the workspace root to this project — without it, Turbopack walks up and
    // finds an unrelated package-lock.json higher in the home directory tree.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
