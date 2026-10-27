# Content Map

Every section's copy lives in `src/content/*.ts`, sourced from the verified facts in
`.claude/skills/sos-content-accuracy/SKILL.md`. This table says which facts back which
section and what is still draft. Full accuracy rules: that skill — not duplicated here.

| Section | Source file | Verified facts used | Draft / unconfirmed |
|---|---|---|---|
| Nav | `src/content/site.ts` | Product name, nav anchors | Informational CTA (`exploreCta`, no download/install destination — see CLAUDE.md "Scope") |
| Hero | `src/content/sections.ts` | Verbatim brief copy (eyebrow, H1, sub, description, CTAs), emergency disclaimer (short) | — (copy is fixed per brief, not drafted) |
| About | `src/content/sections.ts` | Citizen → operations center → responder workflow, brand statement | — |
| How It Works | `src/content/sections.ts` | App-only workflow: Open the App → Capture & Report → Get Confirmation → Track Resolution | — |
| Reporting Categories | `src/content/categories.ts` | Exact category list + 6 approved groups from the skill | Descriptions are generic by design; none promise response time |
| App Showcase | `src/config/screenshots.ts` | N/A (visual only) | All slots `src: null` until screenshots arrive |
| How to Register | `src/content/registration.ts` | Steps 1–4 confirmed from real app screenshots: sign-in/create account → accept Terms & Conditions → pre-registration name fields → verification levels (Basic/Registered/Fully Verified) | Still `status: "draft"` — the rest of the multi-step pre-registration form and the exact verification mechanism aren't confirmed yet |
| Incident Tracking | `src/content/sections.ts` | Status vocabulary: Pending, Ongoing, Cleared (confirmed from app UI) | Labeled "Illustration" — not live data |
| Responder Coordination | `src/content/sections.ts` | Operations center → review → assignment → on-site flow | — |
| FAQ | `src/content/faq.ts` | 5 of 7 answers from verified facts + disclaimer | "Where is the app available?" renders `site.availability` draft text; "Do I need an account?" points to the draft register guide |
| Final CTA | `src/content/sections.ts` | Verbatim headline/support copy, disclaimer (short) | CTA is informational ("Discover SOS" → `#features`), not a download action |
| Footer | `src/content/site.ts` | Nav links, full disclaimer | Contact / Privacy / Terms render as "Unavailable" until `site.contact` / `site.legal` are filled in |

## Fields still `null` / draft, end to end

| Field | File | Effect while `null`/`draft` |
|---|---|---|
| `site.contact.email` | `src/content/site.ts` | Footer shows "Contact details will be published here once confirmed." |
| `site.legal.privacyUrl` / `.termsUrl` | `src/content/site.ts` | Footer renders "Unavailable" text, not a dead link |
| `site.availability` | `src/content/site.ts` | FAQ + register section show the admin-message placeholder |
| `registration.status` | `src/content/registration.ts` | `"draft"` shows a visible "general guide" note; flip to `"verified"` once real steps are confirmed |
| `registration.steps[].enabled` (verify step) | `src/content/registration.ts` | `false` removes the verification step and its screenshot slot entirely |
| All `screenshots[].src` | `src/config/screenshots.ts` | `null` renders `ScreenshotPlaceholder`, not fabricated UI |

## Updating this map

When the user supplies a new fact: update `sos-content-accuracy`'s "Verified product
facts" first, then the relevant `src/content/*` file, flip its `status` field, and update
this table's row — in that order (see the skill's "When the user supplies new facts"
section).
