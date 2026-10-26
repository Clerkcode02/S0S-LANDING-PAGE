# Assets Guide

Full intake rules, privacy review, manifest schema, and placement mapping live in
`.claude/skills/app-screenshot-showcase/SKILL.md` — this doc is the practical checklist
and the running intake log. Read the skill before registering anything.

## Drop locations (not deployed)

```
assets/screenshots-raw/   ← original app screenshots, full resolution, dummy data only
assets/brand-raw/         ← logo.svg (or PNG), app-icon.png (1024×1024), og-image.png (1200×630)
```

## Naming

`<order>-<screen-purpose>.png`, lowercase kebab-case — see the suggested filenames in
`SCREENSHOTS-GUIDE.md`. Arbitrary names are fine too; they get renamed/mapped by purpose
during intake.

**Mobile app vs. operations center web view.** Report, Review, and Resolve are citizen
mobile-app screens (portrait). Assign and Respond happen in the operations center's
**web view**, not the mobile app — those two need landscape browser screenshots, not
phone screenshots. See `sos-content-accuracy` "Verified product facts" and the full id
table in `app-screenshot-showcase`.

## Process (run every time new files are dropped)

1. Inspect each image, identify its purpose (welcome, register, verify, login, home,
   category, report-form, submitted, status, notifications, responder, map, other).
2. Privacy review — stop and ask the user if any real personal data is visible.
3. `npm run optimize:screenshots` — generates WebP + AVIF in `public/screenshots/` at
   max width 1080px, metadata stripped, and prints a manifest stub with real
   width/height to paste into `src/config/screenshots.ts`.
4. Register each image in `src/config/screenshots.ts` with accurate `alt` text,
   `purpose`, `slots`, `device` (`"mobile"` or `"web"`), and `privacyChecked: true`.
5. Place per the mapping table in the skill; confirm ambiguous placements with the user.
6. Verify at 320/768/1440 — no CLS, only `hero-primary` uses `priority`.
7. Log the batch below.

## Slot reference

See `Slot` type in `src/config/screenshots.ts` — one of: `hero-primary`,
`hero-secondary`, `how-report`, `how-review`, `how-assign`, `how-respond`,
`how-resolve`, `showcase`, `register-welcome`, `register-form`, `register-verify`,
`register-home`, `tracking`.

## Intake log

| Date | Files added | Purpose(s) identified | Privacy issues found | Slots filled | Notes |
|---|---|---|---|---|---|
| 2026-10-26 | — | — | — | — | Initial build: all slots are placeholders (`src: null`). No screenshots supplied yet. |
| 2026-10-26 | 11 files: hero-primary, hero-secondary, how-report, how-review, how-assign, how-respond, how-resolve, register-welcome, register-form, register-verify, register-home | home, updates-feed (mismatch), capture/report-form, submitted, web-assign, web-map, status, terms/welcome, register, verify, login | **3 blocked**: `how-report.png` (visible face + precise street address/GPS coordinates rendered in-UI), `how-assign.png` (real full name + real phone number in Report Details panel), `register-verify.png` (real profile photo + real full name + real phone number). **1 held for review**: `how-resolve.png` (specific street address baked into UI — confirming with user before registering). Optimized output for the 3 blocked files was generated before inspection completed and has been deleted from `public/screenshots/`. | hero-primary, how-review, how-respond, register-welcome, register-form, register-home (6 of 11) | `hero-secondary.png` is the Updates/announcements feed, not a category-selection screen — held, wrong purpose, not a privacy issue. `how-assign`/`how-respond` confirmed as `device: "web"` (desktop dashboard captures, 1080×612) — matches the "operations center web view" correction. Screens also revealed real facts worth confirming with the user: a 3-tier verification system (Basic Level → Registered → Fully Verified), a 3-step pre-registration flow starting with name fields, "Cleared" as the literal terminal status label, and phone-number + Face ID sign-in. |

| 2026-10-26 | Same 4 files (how-report, how-assign, register-verify, how-resolve), edited in place | capture, web-assign, verify, status | **Resolved** — user explicitly asked to blur the faces/addresses rather than wait for new files. Ran `scripts/blur-regions.mjs` (sharp, region-blur only, no redraw/retouch) to blur: `how-report.png` (face/body + address/GPS/timestamp overlay), `how-assign.png` (reporter name + phone number, in both the Report Details panel and the chat thread — first attempt left a fragment of the name visible and also over-blurred part of an unrelated sidebar card; both issues fixed and verified by pixel-cropping the result), `register-verify.png` (profile photo + name + phone number, verification badges left legible), `how-resolve.png` (street address line). All four re-optimized and registered with `privacyChecked: true`. | how-report, how-assign, register-verify, how-resolve (11 of 11 now registered) | First blur pass on `how-assign.png` used wrong coordinates and a buggy chained-pipeline script (composite silently didn't apply on the 2nd region) — caught by direct pixel verification, not visual inspection alone. No pristine backup was kept before editing in place; future blur-on-request work should copy the source first. `scripts/blur-regions.mjs` is a one-off, not part of the regular `optimize:screenshots` pipeline. |

Add one row per batch. Never delete prior rows — this is an audit trail of what was
reviewed and when.
