---
name: responsive-accessibility
description: Responsive layout rules (320px to large desktop) and WCAG 2.2 AA accessibility standards for the SOS landing page — landmarks, headings, keyboard, focus, menu, accordions, touch targets, contrast, reduced motion. Use when building or reviewing any layout, navigation, interactive control, or before finishing a section.
---

# Responsive & Accessibility

An emergency-related page must be usable by everyone, on any device, under stress. Clarity beats cleverness.

## Breakpoints
Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Design mobile-first and intentionally per range:
- **320–639:** single column, flat phones, horizontal scroll-snap gallery, stacked CTAs full-width, menu in disclosure panel.
- **640–1023:** two-column grids where content allows; still no 3D tilt or pinning.
- **≥ 1024:** asymmetric 12-col layouts, 2.5D phones, pointer tilt, optional sticky storytelling.
Test widths: 320, 375, 414, 768, 1024, 1280, 1440, 1920. No horizontal page scroll at any width (watch rotated phones and oversized type — use `overflow-x: clip` on sections, not `body`).

## Landmarks & structure
- `<a href="#main" class="skip-link">Skip to content</a>` first focusable element.
- `<header>` (nav), `<main id="main">`, each section a `<section aria-labelledby="…-heading">`, `<footer>`.
- Exactly one `h1` (hero headline). Each section starts with `h2`; sub-items `h3`. No skipped levels.
- Section `id`s match nav anchors: `about`, `features` (categories + showcase), `how-it-works`, `register`, `faq`.
- Anchor targets offset by sticky nav: `scroll-margin-top: var(--nav-h)`.

## Navigation
- Desktop: inline links + an informational CTA (e.g. "Explore the Features") — no download/install CTA, see CLAUDE.md "Scope: showcase, not install funnel".
- Mobile: a `<button aria-expanded aria-controls="mobile-menu">` toggles a panel. On open: focus first link; `Esc` closes and returns focus to the button; clicking a link closes the menu. Body scroll lock is optional and must be released reliably. Hamburger button has accessible name "Open menu"/"Close menu".
- Current section indication (optional) via `aria-current="true"`, not color only.

## Keyboard & focus
- Everything interactive reachable by Tab in visual order. No positive `tabindex`.
- Visible focus ring on all controls: `outline: 2px solid var(--color-accent); outline-offset: 3px;` — ensure ≥ 3:1 against both dark and light backgrounds (use a light ring on red buttons).
- Horizontal galleries: container `tabindex="0"` with `role="region"` + `aria-label`, arrow keys scroll natively.
- Any disabled/unavailable control (e.g. missing contact/legal link): rendered as `<span aria-disabled="true">` or `<button disabled>` with explanatory text, never a focusable fake link.

## FAQ accordions
- Prefer native `<details><summary>`; or `button[aria-expanded][aria-controls]` + region. Summary text is the question as plain text inside an `h3` equivalent.
- Content is in the DOM (searchable, works without JS).

## Touch & pointer
- Touch targets ≥ 44×44px (buttons, menu items, FAQ toggles).
- ≥ 8px spacing between adjacent targets.
- Hover-only effects never hide information.

## Color & text
- Body text contrast ≥ 4.5:1, large text ≥ 3:1, UI boundaries ≥ 3:1.
- Status (Pending/Ongoing/Resolved) always has text label + icon, not color only.
- Text resizes to 200% without loss; no fixed-height text containers.
- Line length ≤ ~70ch for body.

## Images & media
- Meaningful screenshots: factual `alt` (see app-screenshot-showcase). Decorative: `alt=""` + `aria-hidden` on purely decorative SVG.
- Placeholders announce themselves: "Screenshot placeholder: registration screen".
- Icons accompanying text: `aria-hidden="true"`.

## Motion
- Respect `prefers-reduced-motion` (see lightweight-motion). No content appears only via animation.
- Illustrative animated components (tracking, coordination) include visible text saying they're illustrations, plus `aria-live` is NOT used (not live data).

## Emergency information
- Disclaimer appears near hero CTAs, in the FAQ ("Is SOS a replacement for emergency hotlines?"), near the final CTA, and in the footer. Plain language, readable contrast, not hidden in tiny text (≥ 14px).

## Review checklist
- [ ] axe / Lighthouse a11y ≥ 95, zero critical violations
- [ ] Keyboard-only: skip link, menu open/close/Esc, all anchors, FAQ, gallery
- [ ] Screen reader spot-check (VoiceOver/NVDA): headings list makes sense
- [ ] 320px: no overflow, headline fits, CTAs prominent
- [ ] 200% zoom works
- [ ] Reduced motion verified
- [ ] Landscape mobile (e.g., 740×360) usable
