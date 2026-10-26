---
name: app-screenshot-showcase
description: Intake, optimization, privacy review, manifest registration, and presentation of real SOS mobile app screenshots in CSS phone frames. Use whenever the user uploads or drops screenshots/brand images, or when working on PhoneFrame, the hero phones, the showcase gallery, How It Works, or the registration guide visuals.
---

# App Screenshot Showcase

Real screenshots are the source of truth. Never fabricate, redraw, retouch, or "improve" app UI. Never alter text inside screenshots.

## Where files go
| What | Drop location (user) | Output (generated) |
|---|---|---|
| App screenshots (PNG/JPG, full-res) | `assets/screenshots-raw/` | `public/screenshots/<id>.webp` (+ `.avif`) |
| Logo, app icon, brand marks | `assets/brand-raw/` | `public/brand/` |
| Open Graph image (1200×630) | `assets/brand-raw/og-image.png` | `public/brand/og-image.jpg` |

`assets/` is not deployed. Only optimized files in `public/` ship.

## Naming convention
`<order>-<screen-purpose>.png`, lowercase kebab-case, e.g.
`01-home.png`, `02-category-select.png`, `03-report-form.png`, `04-report-submitted.png`, `05-report-status.png`, `06-welcome.png`, `07-register.png`, `08-verify.png`, `09-login.png`, `10-responder-map.png`.
If the user's files are named arbitrarily, inspect each and rename by purpose.

## Intake workflow (every new batch)
1. **Inspect** each image (open it). Identify purpose: welcome, registration, verification, login, home, category picker, report form, camera/capture, confirmation, status/tracking, notifications, responder view, map/route, other.
2. **Privacy review** — look for real names, phone numbers, emails, addresses, faces, plate numbers, precise home locations, IDs, tokens. If found: stop and ask the user for a cleaned version. Do NOT blur/edit yourself unless the user explicitly asks, and then only blur, never alter UI.
3. **Record dimensions** and aspect ratio. Never crop away UI or stretch. Status bar may stay as-is.
4. **Optimize:** `npm run optimize:screenshots` (sharp): output WebP q≈82 and AVIF q≈60 at max width 1080px, keep original aspect, strip metadata (EXIF/GPS). Keep text legible — zoom in to verify small UI text after compression.
5. **Register** in `src/config/screenshots.ts` (see schema below).
6. **Place** using the mapping table; propose placement to the user in one short list if ambiguous.
7. **Verify** layout at 320/768/1440, no CLS, alt text present, only hero uses `priority`.
8. Update `docs/assets-guide.md` intake log.

## Manifest schema
```ts
// src/config/screenshots.ts
export type ScreenPurpose =
  | "welcome" | "register" | "verify" | "login" | "home"
  | "category" | "report-form" | "capture" | "submitted"
  | "status" | "notifications" | "responder" | "map" | "other";

export type Slot =
  | "hero-primary" | "hero-secondary"
  | "how-report" | "how-review" | "how-assign" | "how-respond" | "how-resolve"
  | "showcase" | "register-welcome" | "register-form" | "register-verify" | "register-home"
  | "tracking";

export interface Screenshot {
  id: string;                 // "03-report-form"
  src: string | null;         // "/screenshots/03-report-form.webp"; null = placeholder
  width: number; height: number; // intrinsic px of optimized file
  alt: string;                // describes what the screen shows, factually
  purpose: ScreenPurpose;
  slots: Slot[];
  caption?: string;
  privacyChecked: boolean;    // must be true before src is non-null in production
}
export const screenshots: Screenshot[] = [ /* ... */ ];
export const bySlot = (slot: Slot) => screenshots.filter(s => s.slots.includes(slot));
```
- Default placeholder ratio: 1179×2556 (≈ 9:19.5) until real sizes are known.
- Build should warn (console in dev) if a screenshot has `src` but `privacyChecked: false`.

## Placement mapping
| Screen purpose | Slot(s) |
|---|---|
| home | hero-primary, register-home, showcase |
| category | hero-secondary, how-report, showcase |
| report-form / capture | how-report, showcase |
| submitted | how-review, showcase |
| status | tracking, how-resolve, showcase |
| notifications / responder / map | how-assign, how-respond, showcase |
| welcome | register-welcome |
| register | register-form |
| verify | register-verify (omit step entirely if no such screen exists) |
| login | register-home |

## Alt text rules
Describe what is visible, not marketing claims. Good: "Category selection screen listing Rescue, Police, Fire, and other report types." Bad: "Fast, easy reporting!" Decorative duplicates (e.g., a reflection) get `alt=""`.

## PhoneFrame component
- Pure CSS frame: rounded rect (`ink-raised`), 1px inner highlight, thin screen inset, optional dynamic-island pill. No PNG device mockups.
- Children: `next/image` with explicit `width`/`height` from manifest, `sizes` set (e.g. `(min-width:1024px) 320px, 70vw`), `loading="lazy"` except hero-primary (`priority`, `fetchPriority="high"`).
- Placeholder mode (`src === null`): neutral gradient screen, small label "Screenshot slot: <slot> — awaiting real app screen", correct aspect ratio. No fake UI elements, no fake buttons or text.
- Screen content must stay upright and readable: max rotateY 18°, never mirror.
- Mobile (< 1024px): no 3D rotation; flat phones, native horizontal scroll-snap gallery (`snap-x snap-mandatory`, `scroll-padding`), visible scroll affordance, keyboard focusable region with `aria-label`.

## Checklist per batch
- [ ] Every image inspected and purpose identified
- [ ] No personal data visible (or user confirmed it's dummy data)
- [ ] Optimized files < ~180KB each, text still readable
- [ ] Manifest entries complete: dimensions, alt, purpose, slots, privacyChecked
- [ ] Only one `priority` image on the page
- [ ] No layout shift; aspect ratios intact
- [ ] Unused placeholder slots still render honestly labeled
- [ ] Lighthouse mobile re-run after integration
