# Claude Code Prompt — SOS: COMMUNITY APP Landing Page

> **How to use:** Put `CLAUDE.md` and the `.claude/` folder in an empty project folder, open Claude Code in that folder, and paste everything below the line as your first message. For later screenshot batches, use the short prompt at the bottom.

---

You are working in this folder to build the **SOS: COMMUNITY APP** landing page from scratch to a verified production build. `CLAUDE.md` and six project skills in `.claude/skills/` already exist — read `CLAUDE.md` now and load each skill before working in its area:

- `sos-content-accuracy` — before writing any copy
- `sos-design-system` — before styling anything
- `lightweight-motion` — before any animation
- `app-screenshot-showcase` — before phone frames, images, or the manifest
- `responsive-accessibility` — before nav, menus, accordions, galleries, and at review
- `performance-audit` — at verification

Do not overwrite `CLAUDE.md` or the skills; extend them only if you learn something durable (and tell me).

Visual reference: https://hidokmeh.com/ — if you can browse, study its typography, spacing, navigation, scroll choreography, and composition. Interpret the *feel* only; do not copy branding, layouts, assets, code, or text. If you can't browse, follow the art direction in `sos-design-system`.

Work through the phases in order. Keep a running task list. Don't stop after planning — finish with a working, verified page.

## PHASE 1 — Create the project
1. Confirm the folder only contains `CLAUDE.md`, `.claude/`, `PROMPT.md`, `SCREENSHOTS-GUIDE.md` (and optionally `assets/`). If other code exists, inspect it and preserve its conventions instead of scaffolding.
2. Scaffold in place (keep the existing files):
   `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
   If it refuses because the folder isn't empty, scaffold into a temp folder and move the files in, keeping `CLAUDE.md` and `.claude/` intact.
3. Install only: `gsap`, `lucide-react`; dev: `sharp`, `lighthouse` (or use `npx lighthouse`). Nothing else without asking me.
4. Add scripts to package.json: `typecheck` (`tsc --noEmit`), `optimize:screenshots` (`node scripts/optimize-screenshots.mjs`), `audit:lighthouse`.
5. Create the folder structure from `CLAUDE.md`, including empty `assets/screenshots-raw/` and `assets/brand-raw/` with a `.gitkeep` and a one-line README in each.
6. `git init` and make an initial commit.
7. Give me a concise architecture + content plan (≤ 20 lines) and continue without waiting.

## PHASE 2 — Documentation
Create (concise, practical, no duplication of skill content — link to skills instead):
- `README.md` — install, dev, build, deploy (Vercel + generic Node), where to put screenshots
- `docs/content-map.md` — each section → which supplied facts it uses, and which copy is draft
- `docs/assets-guide.md` — screenshot/brand intake process, naming, slot table, intake log
- `docs/animation-spec.md` — per section: trigger, effect, breakpoints, reduced-motion fallback, no-JS fallback
- `docs/performance-checklist.md` — how to audit + a results log table
- `.env.example` only if a real env var is needed (e.g., `NEXT_PUBLIC_SITE_URL`)

## PHASE 3 — Content & config modules
- `src/content/site.ts` — name, brand statement, nav items, store links (null), contact (null), legal URLs (null), disclaimer short + full, availability (draft), SEO metadata
- `src/content/sections.ts` — all section copy (hero, about, how-it-works stages, tracking, coordination, final CTA)
- `src/content/categories.ts` — 5 groups × incident types exactly as in `sos-content-accuracy`, with lucide icon names and generic descriptions
- `src/content/registration.ts` — draft steps with conditional verify step
- `src/content/faq.ts` — the 7 questions from the brief, configurable draft answers where facts are unknown
- `src/config/screenshots.ts` — typed manifest with placeholder entries (`src: null`) for every slot
- `scripts/optimize-screenshots.mjs` — sharp: read `assets/screenshots-raw/*`, output WebP + AVIF to `public/screenshots/` (max width 1080, strip metadata), print a ready-to-paste manifest stub with real width/height

Required copy (use verbatim):
- Hero eyebrow: COMMUNITY SAFETY, CONNECTED · H1: Every Second Matters. · Sub: Report incidents. Connect with responders. Stay informed. · Description: SOS: COMMUNITY APP helps communities report emergencies and public concerns through a coordinated reporting and response platform. · CTAs: Discover the App / How It Works
- About H2: A Safer Community Starts With a Report.
- How It Works: Report → Review → Assign → Respond → Resolve
- Tracking: Pending → Ongoing → Resolved
- Final CTA H2: Stronger Communities. Safer Tomorrows. · Support: Connecting citizens and responders through better emergency reporting and coordination. · CTA: Get the SOS App

## PHASE 4 — Build the page
Design tokens + fluid type scale in `globals.css`; fonts via `next/font`. Build reusable UI (`Container`, `Button`, `Eyebrow`, `DraftBadge`, `StoreButton`, `Disclosure`), device components (`PhoneFrame`, `PhoneStack`, `ScreenshotPlaceholder`), then one file per section in `src/components/sections/`, composed in `page.tsx`:

1. **Nav** — sticky, minimal glass bar: logo/name, About, Features, How It Works, How to Register, FAQs, Download App CTA; accessible mobile menu.
2. **Hero** (dark, cinematic) — headline dominant; dominant phone + supporting phone in 2.5D perspective; short disclaimer under CTAs.
3. **About** (light) — citizen → operations center → responder flow as a clean 3-node visual.
4. **How It Works** (dark) — 5-stage storytelling; desktop: sticky phone that swaps screenshot per stage (no scroll-jacking); mobile: stacked steps each with its own phone. Fully readable without JS.
5. **Reporting Categories** (light) — 5 groups, elegant responsive grid, lucide icons.
6. **App Showcase** (dark, full-bleed) — "See SOS in Action": 3D floating phones on desktop, native scroll-snap gallery on mobile; labeled placeholders until screenshots arrive.
7. **How to Register** (light) — draft-marked step guide with screenshot slots (welcome, register, verify if enabled, login/home) + config-driven store buttons ("Coming soon" while null).
8. **Incident Tracking** (dark) — labeled "Illustration" status component Pending → Ongoing → Resolved with timestamp explanation; not presented as live.
9. **Responder Coordination** (light) — operations center → review → assignment → on-site, simple SVG connectors.
10. **FAQ** (light) — 7 accessible accordions.
11. **Final CTA** (dark, emotional, minimal) — with short disclaimer.
12. **Footer** — name, About, Features, How to Register, FAQs, Contact / Privacy / Terms rendered honestly as unavailable until configured, full emergency disclaimer.

SEO: `metadata` (title, description, Open Graph, Twitter, `metadataBase` from env), `app/sitemap.ts`, `app/robots.ts`, `app/icon` / favicon from `public/brand/` if provided, OG image path configurable.

## PHASE 5 — Motion
Follow `lightweight-motion` exactly: shared IntersectionObserver reveals; lazy-loaded GSAP only for hero parallax, showcase depth transition, and How It Works stage progress on ≥ 1024px; pointer tilt on fine pointers only; one-shot status and connector animations; full reduced-motion and no-JS fallbacks. Document everything in `docs/animation-spec.md`.

## PHASE 6 — Verify
1. `npm run typecheck`, `npm run lint`, `npm run build` — fix every error and warning.
2. Confirm in build output that GSAP is not in the initial chunk.
3. `npm run start` and check: every nav/footer anchor resolves; no `href="#"`; no console errors.
4. If a headless browser is available (Playwright/Chrome), screenshot the page at 320, 375, 768, 1024, 1440 and inspect for overflow, clipping, and hierarchy; test keyboard flow (skip link, menu + Esc, FAQ, gallery) and reduced-motion emulation. Fix issues.
5. Run Lighthouse mobile ×3 on the production build; record median scores + LCP/CLS/TBT in `docs/performance-checklist.md`. If Lighthouse can't run here, say so — don't estimate.
6. Run the checklists in all six skills; fix failures.
7. Commit.

## PHASE 7 — Report to me
Summarize briefly:
- Files created (grouped), features delivered
- Test results with real numbers (or what couldn't be run and why)
- Every placeholder and draft item still waiting on me (store URLs, contact, legal pages, availability, registration details, verification yes/no, logo, OG image)
- Known limitations
- **Exactly where to drop screenshots and images**, and the command to run afterward

## Rules throughout
- Accuracy over polish: never invent facts or UI (see `sos-content-accuracy`).
- No Three.js / R3F / Spline / Framer Motion / smooth-scroll libraries / extra UI kits without my permission.
- Ask me only if a missing fact would cause a material inaccuracy or block the build; otherwise use labeled placeholders and keep going.

---

## Follow-up prompt — when you add screenshots

> I've added new screenshots to `assets/screenshots-raw/` (and brand images to `assets/brand-raw/` if any). Load the `app-screenshot-showcase` skill and run the full intake workflow: inspect each image and tell me what screen it is, check for personal data (stop and tell me if you find any), run `npm run optimize:screenshots`, register them in `src/config/screenshots.ts` with accurate alt text, propose and apply placements, update `docs/assets-guide.md`, then re-run typecheck, lint, build, and a mobile Lighthouse audit and report the results.

Optional extras to include in that message when you know them:
- "Our registration steps are: … (verification: yes/no)" → updates `registration.ts` from draft to verified
- "App Store URL: … / Google Play URL: …"
- "Contact email: … / Privacy URL: … / Terms URL: …"
- "Available in: …"
