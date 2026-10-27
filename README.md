# SOS: COMMUNITY APP — Landing Page

Marketing landing page for **SOS: COMMUNITY APP**, a community safety and emergency
reporting platform. Next.js (App Router) + TypeScript + Tailwind CSS, static-first,
no backend.

Project rules live in [`CLAUDE.md`](./CLAUDE.md) and `.claude/skills/*/SKILL.md` — read
those before changing anything. This file is just the run book.

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
# http://localhost:3000
```

## Typecheck & lint

```bash
npm run typecheck
npm run lint
```

## Production build

```bash
npm run build
npm run start   # serves the production build on :3000
```

## Screenshots & brand images

Drop files, then run one command — see [`SCREENSHOTS-GUIDE.md`](./SCREENSHOTS-GUIDE.md)
and the `app-screenshot-showcase` skill for the full intake workflow.

```
assets/screenshots-raw/   ← original app screenshots (PNG/JPG, full-res, dummy data only)
assets/brand-raw/         ← logo, app icon, OG image
```

```bash
npm run optimize:screenshots
```

This reads `assets/screenshots-raw/*`, writes optimized WebP + AVIF into
`public/screenshots/`, and prints a manifest stub to paste into
`src/config/screenshots.ts`.

## Performance audit

```bash
npm run build && npm run start   # in one terminal
npm run audit:lighthouse         # in another, against the running production build
```

Procedure and budget: `performance-audit` skill. Results log: `docs/performance-checklist.md`.

## Deploy

### Vercel
1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel — framework preset "Next.js" is auto-detected.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL in Vercel project env vars.
4. Deploy. No other config needed (no database, no server runtime beyond Next.js itself).

### Generic Node host
```bash
npm ci
npm run build
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run start
```
Serve behind a reverse proxy (nginx/Caddy) on the port Next listens on (default 3000,
override with `PORT=xxxx npm run start`).

## Docs

- [`docs/content-map.md`](./docs/content-map.md) — section → source facts, draft status
- [`docs/assets-guide.md`](./docs/assets-guide.md) — screenshot/brand intake process
- [`docs/animation-spec.md`](./docs/animation-spec.md) — per-section motion spec
- [`docs/performance-checklist.md`](./docs/performance-checklist.md) — audit log

## Scope

This is an informational showcase for SOS: COMMUNITY APP — it introduces the app, how
it works, and its purpose. It is not an install funnel: there are no "Download App" /
App Store / Google Play buttons anywhere on the page. See `CLAUDE.md` ("Scope: showcase,
not install funnel") before adding anything that looks like an acquisition CTA.

## What's still a placeholder

Contact email, privacy/terms URLs, availability/coverage, and exact registration fields
are unconfirmed and render as drafts or honest "unavailable" states. See
`docs/content-map.md` for the full list and `src/content/site.ts` /
`src/content/registration.ts` to fill them in once known.
# S0S-LANDING-PAGE
