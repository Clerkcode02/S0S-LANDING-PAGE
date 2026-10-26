# Animation Spec

Conventions, tool choice, allowed properties, and the GSAP loading pattern are defined in
`.claude/skills/lightweight-motion/SKILL.md` — this doc only maps that policy onto each
section. Every row must obey that skill; this table doesn't repeat its rules.

| Section | Trigger | Effect | Breakpoints | Reduced-motion fallback | No-JS fallback |
|---|---|---|---|---|---|
| Nav | Scroll position (CSS only) | Glass bar background/border fade in past 8px scroll | All | Same (CSS only, no motion to reduce) | Fully functional; background visible without scroll listener via fallback class |
| Hero | Mount (IO none needed — above the fold) | Two phones settle into 2.5D position on load; headline never animates | ≥ 1024: pointer tilt (±6° via CSS vars, rAF-throttled). < 1024: static layered phones, no tilt | No entrance motion, no tilt; phones render at rest position immediately | Phones render at final position/opacity via plain CSS; headline and CTAs fully present |
| Hero scroll parallax | Scroll (ScrollTrigger, `scrub: 0.6`) | Phones translate/rotate ≤ 80px / ≤ 6° as hero scrolls past | ≥ 1024 only | GSAP not loaded; phones static | Static position (no JS = no parallax, layout unaffected) |
| About | IO (`data-reveal`, rootMargin 0px, threshold 0.2) | 3-node flow fades + rises 24px, staggered ≤ 3×60ms | All | Instant visible, no transition | Visible by default (`no-js` class keeps opacity:1) |
| How It Works (mobile/tablet, < 1024) | IO per step | Each stacked step card reveals independently | < 1024 | Instant visible | Fully readable, stacked, own phone per step |
| How It Works (desktop, ≥ 1024) | ScrollTrigger scoped via `matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)")` | Sticky phone swaps screenshot + active-step highlight advances as user scrolls the step list; **no pin beyond the 5-step container, no scroll hijack** | ≥ 1024 only | Falls back to the mobile stacked layout behavior (no sticky, no swap animation) — content order identical | Stacked layout (same DOM, CSS-only sticky removed) |
| Reporting Categories | IO (`data-reveal`) | Grid tiles fade + rise, staggered ≤ 5×60ms per row | All | Instant visible | Visible by default |
| App Showcase (desktop ≥ 1024) | IO triggers GSAP load; ScrollTrigger scrub | Floating phones gentle depth/parallax reveal, one-shot per phone then settles | ≥ 1024 | No depth transition; phones shown at rest, fully visible | Phones visible, static, in a wrapping grid (no scroll-snap needed since no horizontal constraint) |
| App Showcase (mobile/tablet < 1024) | Native scroll | Horizontal `scroll-snap-type: x mandatory` gallery, CSS only | < 1024 | Same (native scroll, not a JS animation) | Fully functional (native CSS scroll-snap requires no JS) |
| How to Register | IO (`data-reveal`) | Step cards fade + rise | All | Instant visible | Visible by default |
| Incident Tracking | IO, **once** | Status pills advance Pending → Ongoing → Resolved in sequence, then stop, labeled "Illustration" | All (desktop may use a slightly longer stagger) | Shows final state (Resolved) immediately, fully annotated | All three states render in the DOM with the "Illustration" label; without JS, final/annotated state is shown directly (no sequence) |
| Responder Coordination | IO, **once** | SVG connector lines draw in via `stroke-dashoffset` CSS transition (not per-frame JS) | All | Connectors render fully drawn, no transition | Connectors fully drawn (static SVG, no JS dependency) |
| FAQ | Click/keyboard (native `<details>`) | Chevron rotates (CSS transition), content expands natively | All | Same (native disclosure, not reduced-motion-gated) | Fully functional — native HTML, zero JS required |
| Final CTA | IO (`data-reveal`) | Fade + rise, no phones, minimal | All | Instant visible | Visible by default |
| Footer | None | Static | All | Static | Static |

## Shared mechanics

- One shared `IntersectionObserver` (see `src/lib/motion/`) drives every `[data-reveal]`
  element; `unobserve` after reveal.
- GSAP is dynamically imported only inside the three scroll-linked effects (hero
  parallax, showcase depth, How It Works desktop progress), loaded via
  `requestIdleCallback`/near-viewport IO — never in the initial bundle. Verified in
  `docs/performance-checklist.md` build-output check.
- `prefers-reduced-motion: reduce` → GSAP never imported; all reveals apply their
  `.is-visible` end state via the plain CSS media-query rule, no JS needed.
- No-JS: `<html>` carries a `no-js` class removed by a tiny inline script on hydration;
  while absent (or if JS never runs), `.no-js [data-reveal]` forces the visible end state.
- `will-change: transform` is added only for the duration of an active animation and
  removed on completion/`ScrollTrigger` leave.
