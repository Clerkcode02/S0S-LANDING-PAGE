---
name: performance-audit
description: Performance budget, measurement procedure, and fix playbook for the SOS landing page — Lighthouse mobile, Core Web Vitals, bundle size, image weight. Use before finishing any feature, after adding images or motion, and when the user asks about speed or scores.
---

# Performance Audit

Design for a mid-range Android phone on 4G, not a desktop workstation. Report measured numbers only; never claim a score you didn't run.

## Budget
| Metric | Target (mobile) |
|---|---|
| Lighthouse Performance | ≥ 90 (where feasible) |
| Accessibility / Best Practices / SEO | ≥ 95 |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP / TBT | INP ≤ 200 ms (TBT ≤ 200 ms as lab proxy) |
| First-load JS (route) | ≤ 130 KB gzip, GSAP excluded (lazy) |
| Fonts | ≤ 2 families, woff2, self-hosted via next/font |
| Hero image | ≤ 120 KB, only `priority` asset |
| Total page weight on first view | ≤ 600 KB |

## Measurement procedure
1. `npm run build && npm run start` (never audit the dev server).
2. Check build output: route first-load JS; confirm `gsap` is in a separate async chunk.
3. Run Lighthouse mobile (default throttling), 3 runs, record the median:
   ```
   npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --output=json --output-path=./reports/lh-mobile.json --chrome-flags="--headless=new"
   npx lighthouse http://localhost:3000 --only-categories=accessibility,best-practices,seo --form-factor=mobile --output=html --output-path=./reports/lh-quality.html --chrome-flags="--headless=new"
   ```
   (`npm run audit:lighthouse` wraps this.) If Chrome is unavailable, say so and report what was measured instead.
4. Also run desktop once for sanity.
5. Log date, commit, scores, LCP element, CLS sources in `docs/performance-checklist.md`.

## Common fixes
**LCP slow**
- LCP element should be the hero `h1` text or hero phone image. Text LCP: ensure font uses `display: swap` and headline is not hidden by entrance animation.
- Hero image: `priority`, correct `sizes`, AVIF/WebP, ≤ 1080px source.
- Don't put the LCP element behind a client component that waits for hydration.

**CLS**
- Every image has width/height (from manifest). Placeholders keep same aspect ratio.
- Fonts: next/font with `adjustFontFallback` (default) to avoid swap shift.
- Sticky nav has fixed height; no content injected above the fold after load.

**TBT / INP**
- Keep sections as Server Components; minimize `"use client"` surface.
- Lazy-load GSAP and motion components (`next/dynamic` with `ssr: false` for purely decorative motion wrappers, or dynamic `import()` inside effects).
- Pointer handlers: passive listeners, rAF-throttled, no layout reads after writes.
- Accordions: native `<details>`/`<summary>` or minimal state.

**Rendering cost**
- No large `backdrop-filter` areas; glass only on nav.
- No animated filters/shadows. Limit simultaneous 3D layers (≤ 4 composited phones in view).
- Remove `will-change` after animations.
- Pause/skip work for offscreen sections (IO).

**Bytes**
- lucide named imports only.
- No unused dependencies (`npx depcheck`).
- Inline SVG icons for categories instead of image files.

## Pre-merge checklist
- [ ] Production build audited (not dev)
- [ ] Scores and vitals recorded with date
- [ ] GSAP lazy chunk confirmed
- [ ] Single priority image
- [ ] No console errors/warnings in production
- [ ] Any regression > 5 points explained or fixed
