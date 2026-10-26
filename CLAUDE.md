# CLAUDE.md — SOS: COMMUNITY APP Landing Page

Foundational project memory. Keep this file short; detailed rules live in `.claude/skills/*/SKILL.md`. Load the relevant skill before working in its area.

## Mission
A premium, immersive, lightweight marketing landing page for **SOS: COMMUNITY APP** — a community safety and emergency reporting platform that lets citizens submit incidents to the appropriate local authorities and designated operations center, where authorized personnel review, assign, and monitor them.

Brand statement: *SOS: COMMUNITY APP — Connecting communities to faster, more coordinated emergency response.*

Goal: the FEEL of an award-winning agency site (editorial, cinematic, 2.5D depth) with the performance of a lean product page. Never a generic SaaS template.

## Priorities (in order)
1. Public trust and accurate emergency information
2. Excellent visual design
3. Fast loading, low memory
4. Clean responsive behavior (320px → large desktop)
5. Subtle, meaningful motion
6. Easy screenshot integration
7. Maintainable code

## Non-negotiable accuracy rules (details: `sos-content-accuracy` skill)
- Never invent registration fields, verification procedures, store URLs, coverage regions, response times, partners, or certifications.
- Never imply a report guarantees immediate dispatch. Reports are **received and reviewed by authorized personnel** for appropriate assignment.
- Always show the emergency disclaimer: for immediate life-threatening emergencies, contact the applicable local emergency hotline. The app is not a guaranteed substitute for emergency services.
- Unconfirmed copy lives in `src/content/` with `status: "draft"` and must render with a visible "Draft" marker or be hidden — never presented as verified.
- Never fabricate app UI. Only real screenshots, or clearly labeled neutral placeholders.

## Tech stack
- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- GSAP + ScrollTrigger — lazy-loaded, only where CSS/IntersectionObserver can't do the job
- lucide-react icons (tree-shaken named imports)
- `next/font` for self-hosted fonts; `next/image` for screenshots
- **Forbidden without explicit user permission:** Three.js, R3F, Spline, Lottie, Framer Motion, Lenis/Locomotive or any smooth-scroll engine, particle libraries, physics engines, UI kits.

## Repository structure
```
assets/screenshots-raw/     ← user drops ORIGINAL app screenshots here (not deployed)
assets/brand-raw/           ← user drops logo / brand images here (not deployed)
public/screenshots/         ← optimized WebP/AVIF output (generated)
public/brand/               ← optimized logo, favicon, OG image
scripts/optimize-screenshots.mjs
src/app/                    ← layout.tsx, page.tsx, sitemap.ts, robots.ts, globals.css
src/components/layout/      ← Nav, Footer, SkipLink
src/components/sections/    ← one file per page section
src/components/ui/          ← Button, Eyebrow, Container, Disclosure, DraftBadge, StoreButton
src/components/device/      ← PhoneFrame, PhoneStack, ScreenshotPlaceholder
src/components/motion/      ← Reveal, TiltOnHover, MotionProvider (client-only)
src/content/                ← site.ts, sections.ts, categories.ts, faq.ts, registration.ts
src/config/screenshots.ts   ← typed screenshot manifest (single source of truth)
src/lib/motion/             ← gsap loader, reduced-motion + pointer helpers
docs/                       ← content-map, assets-guide, animation-spec, performance-checklist
```

## Architecture rules
- Content, screenshot config, animation logic, and components are separate. Sections read from `src/content/*` — no hard-coded marketing copy in JSX.
- Sections are Server Components by default. Add `"use client"` only to small leaf components that need interaction or motion.
- One section per file; `page.tsx` only composes sections.
- All text and structure must render without JavaScript. Motion is progressive enhancement.
- No dead links: missing destinations (store URLs, privacy, terms, contact) render as disabled/“Coming soon” states driven by config, never `href="#"`.

## Design language (details: `sos-design-system` skill)
Dark near-black surfaces, light neutral contrast sections, controlled emergency red, oversized editorial type, large negative space, deliberate asymmetry, restrained glass. Tokens live in `globals.css` (`@theme`) — never hard-code hex values in components.

## Motion (details: `lightweight-motion` skill)
Transform + opacity only. No continuous rAF loops, no scroll-jacking, no pinning on small screens. Respect `prefers-reduced-motion`. Pointer tilt only on `(hover: hover) and (pointer: fine)`.

## Screenshots (details: `app-screenshot-showcase` skill)
Raw images → `assets/screenshots-raw/` → `npm run optimize:screenshots` → `public/screenshots/` → register in `src/config/screenshots.ts`. Only the hero screenshot may be `priority`. Check every screenshot for personal data before publishing.

## Performance budget (details: `performance-audit` skill)
Mobile Lighthouse targets: Perf 90+, A11y 95+, Best Practices 95+, SEO 95+; LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms. Report measured numbers only — never claim untested scores.

## Accessibility & responsive (details: `responsive-accessibility` skill)
WCAG 2.2 AA. Semantic landmarks, one `h1`, logical heading order, visible focus, keyboard-operable menu and accordions, 44px touch targets, 320px minimum width.

## Commands
```
npm run dev                 # local dev
npm run lint                # ESLint
npm run typecheck           # tsc --noEmit
npm run build               # production build
npm run start               # serve production build
npm run optimize:screenshots
npm run audit:lighthouse    # mobile Lighthouse against local production build
```

## Definition of done
- [ ] `typecheck`, `lint`, `build` pass with zero errors
- [ ] All nav/footer anchors resolve; no `href="#"`
- [ ] Emergency disclaimer visible in hero area or near CTAs, FAQ, and footer
- [ ] All draft content marked; no invented facts
- [ ] Works at 320, 375, 768, 1024, 1440px with no horizontal scroll
- [ ] Keyboard-only walkthrough passes; reduced-motion verified
- [ ] Lighthouse mobile run recorded in `docs/performance-checklist.md`
- [ ] Screenshots registered in manifest with alt text; no personal data visible

## Working conventions
- Ask the user only when a missing fact would cause a material inaccuracy or block work; otherwise use labeled placeholders and continue.
- Prefer editing existing components over adding new ones. Prefer CSS over JS. Prefer zero new dependencies.
- After any change to motion or images, re-run the `performance-audit` checklist.
