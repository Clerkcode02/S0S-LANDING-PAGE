---
name: sos-design-system
description: Visual design system for the SOS COMMUNITY APP landing page — color tokens, typography scale, spacing, surfaces, buttons, and art direction. Use when creating or restyling any section, component, or visual element.
---

# SOS Design System

## Art direction
Premium, calm, civic, human-centered. Think editorial magazine meets emergency operations room — confident, not alarmist.

**Do:** oversized editorial headings, large negative space, strong left-aligned grid with deliberate asymmetry, occasional full-bleed sections, subtle cinematic lighting (one soft radial gradient per section max), restrained glass on overlays only, emergency red used as a precise accent.

**Don't:** neon glow, saturated red backgrounds, emoji graphics, generic dashboard cards everywhere, floating cards with heavy drop shadows, continuous spinning objects, multiple competing gradients, particle backgrounds.

Rule of thumb: if red covers more than ~5% of a viewport, it's too much.

## Color tokens
Define once in `src/app/globals.css` under Tailwind v4 `@theme`. Components use token utilities only (`bg-ink`, `text-paper`, `text-accent`), never raw hex.

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#101318` | Primary dark background |
| `--color-ink-raised` | `#1B2027` | Dark surfaces, phone bezels, cards on dark |
| `--color-ink-line` | `#2A313B` | Hairlines/dividers on dark |
| `--color-paper` | `#F5F6F7` | Light section background |
| `--color-paper-line` | `#E1E4E8` | Hairlines on light |
| `--color-accent` | `#D93642` | Accent: CTAs, key marks, status dots |
| `--color-accent-strong` | `#B8232F` | Accent text on light backgrounds (AA on `#F5F6F7`) |
| `--color-accent-soft` | `#F6E8EA` | Tinted backgrounds, badges on light |
| `--color-text-dark` | `#171A20` | Body text on light |
| `--color-text-light` | `#F7F8FA` | Body text on dark |
| `--color-muted-dark` | `#9AA2AD` | Muted text on dark (≥ 4.5:1 on `#101318`) |
| `--color-muted-light` | `#5E6672` | Muted text on light (≥ 4.5:1 on `#F5F6F7`) |

Contrast notes:
- `#858D98` (supplied muted) passes on dark only for large text; use `--color-muted-dark` for body.
- White text on `#D93642` buttons is ~4.6:1 — OK for button labels ≥ 16px semibold. Verify after any change.
- Red text on light backgrounds must use `--color-accent-strong`.
- Never convey status by color alone — pair with label or icon.

Status colors (tracking section only): Pending = amber `#C98A1B` + clock icon, Ongoing = accent red + pulse-free dot, Resolved = green `#2F8F5B` + check icon. Always labeled.

## Typography
- Font: one variable sans via `next/font/google` (preferred: **Inter Tight** for display + **Inter** for body, or **Geist** alone). `display: "swap"`, subset `latin`, max 2 families.
- Headings: weight 600–700, tight tracking (`-0.03em` to `-0.045em`), line-height 0.95–1.05.
- Body: weight 400, line-height 1.6, max width ~65ch.
- Eyebrows: 12–13px, uppercase, `tracking-[0.18em]`, weight 500, muted color, often with a short red rule before it.

Fluid scale (put in `@theme` as `--text-*`):
```
--text-display: clamp(3rem, 1.2rem + 7.5vw, 9rem);    /* hero h1 */
--text-h2:      clamp(2.25rem, 1.2rem + 4.2vw, 5.5rem);
--text-h3:      clamp(1.375rem, 1rem + 1.4vw, 2.25rem);
--text-lead:    clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
--text-body:    1rem;  /* 1.0625rem on ≥ md */
--text-small:   0.875rem;
--text-eyebrow: 0.8125rem;
```
At 320px the hero headline must fit without overflow — test "Every Second Matters." specifically.

## Layout & spacing
- Container: `max-w-[1440px]`, side padding `clamp(1.25rem, 4vw, 4rem)`.
- 12-column grid on ≥ lg; asymmetric spans (e.g., 7/5, 5/7, offset-1).
- Section vertical rhythm: `clamp(5rem, 10vw, 10rem)` top/bottom.
- Spacing scale: 4px base (Tailwind default). Prefer 6, 8, 12, 16, 24, 32 steps.
- Radius: 6px small controls, 14px cards, phone frame ~2.6rem outer.

## Surfaces & sections rhythm
Alternate dark and light to create chapters:
Hero (dark) → About (light) → How It Works (dark) → Categories (light) → Showcase (dark, full-bleed) → Register (light) → Tracking (dark) → Coordination (light) → FAQ (light) → Final CTA (dark, cinematic) → Footer (dark).

Lighting: at most one `radial-gradient` per dark section, low opacity (≤ 0.18), red or cool-gray tint. Static — never animated.

Glass: `bg-white/5` + `backdrop-blur-md` + 1px `ink-line` border, only on nav and small overlays. No large blurred panels (performance).

## Components
- **Button primary:** accent bg, light text, 48px min height, 20–28px horizontal padding, subtle arrow icon that shifts 2px on hover.
- **Button secondary:** transparent, 1px border (`ink-line` on dark / `paper-line` on light), same sizing.
- **Disabled store button:** dashed border, muted text, label "Coming soon", `aria-disabled="true"`, not focusable as a link.
- **Eyebrow:** red 24px rule + uppercase label.
- **DraftBadge:** small amber-outlined pill "Draft — pending confirmation"; only in sections with draft content.
- **Category tile:** icon (24px lucide, stroke 1.5) + title + one-line description; hairline border, no heavy shadow; hover = border color shift + 2px lift.
- **Phone frame:** see `app-screenshot-showcase` skill.

## Iconography
lucide-react only, stroke 1.5, sizes 20/24/32. One icon per concept; icons support text, never replace it.

## Checklist before finishing visual work
- [ ] Only tokens used; no raw hex in components
- [ ] Red usage restrained; status not color-only
- [ ] Headline hierarchy reads at a glance; one dominant element per viewport
- [ ] Dark/light rhythm intact
- [ ] Contrast checked for any new color pairing
- [ ] Looks intentional at 320px, not just shrunk
