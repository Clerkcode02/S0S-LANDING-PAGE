---
name: lightweight-motion
description: Motion and animation conventions for the SOS landing page — GSAP lazy-loading, IntersectionObserver reveals, 2.5D CSS perspective, pointer tilt, scroll parallax, and reduced-motion fallbacks. Use when adding, changing, or debugging any animation or interaction.
---

# Lightweight Motion

Motion exists to create depth and guide attention, never as decoration. If removing an animation loses no meaning, remove it.

## Tool choice (cheapest first)
1. **CSS transitions** — hovers, focus, button states, accordion chevrons.
2. **IntersectionObserver + CSS class** — entrance reveals (`data-reveal` → `.is-visible`). Default for most sections.
3. **GSAP + ScrollTrigger** — only for scroll-linked scrubbing (hero phone parallax, showcase depth transition, How It Works step progress). Lazy-loaded.
4. Anything else — needs user permission.

## GSAP loading pattern
```ts
// src/lib/motion/gsap.ts
let p: Promise<{ gsap: typeof import("gsap").gsap; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger }> | null = null;
export function loadGsap() {
  return (p ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  }));
}
```
- Import only from client components, inside `useEffect`, after checking reduced motion.
- Load GSAP when the first scroll-linked section is near viewport (IO with `rootMargin: "200px"`), or on `requestIdleCallback` after first paint — never in the critical path.
- Always wrap in `gsap.context(() => {...}, ref)` and `ctx.revert()` on unmount.
- Use `gsap.matchMedia()` to scope desktop-only effects: `"(min-width: 1024px) and (prefers-reduced-motion: no-preference)"`.

## Allowed properties
Animate **only** `transform` (translate3d, rotateX/Y, scale) and `opacity`.
Never animate per frame: `filter: blur()`, `box-shadow`, `clip-path`, `width/height/top/left`, `backdrop-filter`. For mask reveals, animate a transform on an overlay element instead of clip geometry.

## 2.5D depth recipe
```css
.stage   { perspective: 1600px; }
.layer   { transform-style: preserve-3d; transform: rotateX(var(--rx,8deg)) rotateY(var(--ry,-14deg)) translate3d(0,0,0); }
.phone-2 { transform: translate3d(-18%, 10%, -120px) rotateY(-14deg); }
```
- Two phones max in the hero: dominant front phone + one supporting phone behind/offset.
- Static layered shadows (2 stacked, soft) defined once — never animated.
- Rotation limits: rotateX ≤ 10°, rotateY ≤ 18°. Tilt delta from pointer ≤ ±6°.

## Pointer tilt
- Only when `matchMedia("(hover: hover) and (pointer: fine)").matches` and no reduced motion.
- Throttle with a single rAF per pointer event (no loop). Write CSS vars (`--rx`, `--ry`); CSS does the transform.
- Reset to rest on `pointerleave` with a 400ms CSS transition.
- Detach listeners when the element leaves the viewport (IO).

## Scroll parallax
- ScrollTrigger `scrub: 0.6`, small ranges (translateY ≤ 80px, rotate ≤ 6°).
- No `pin` below 1024px. Prefer no pin at all; if used (How It Works on desktop), the content must still be fully readable without it.
- Never hijack scroll; never use smooth-scroll libraries. `scroll-behavior: smooth` in CSS only when reduced motion is not set.

## Reveal pattern
```css
[data-reveal] { opacity: 0; transform: translate3d(0, 24px, 0); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
[data-reveal].is-visible { opacity: 1; transform: none; }
.no-js [data-reveal] { opacity: 1; transform: none; transition: none; }
@media (prefers-reduced-motion: reduce) { [data-reveal] { opacity: 1; transform: none; transition: none; } }
```
- Content must be visible if JS fails: add `no-js` class on `<html>` and remove it with an inline script, or set initial hidden state only after hydration.
- One IntersectionObserver instance shared for all reveals; `unobserve` after reveal.
- Stagger via `style={{ transitionDelay }}` — max 5 items × 60ms.

## Easing & timing
- Ease: `cubic-bezier(.2,.7,.2,1)` (CSS) / `power3.out` (GSAP).
- Durations: hover 200ms, reveal 600–800ms, hero entrance ≤ 1.2s total.
- Hero headline must be readable immediately — animate phones in, not the headline's visibility (a subtle 12px rise with opacity starting at 0.001 is acceptable only if LCP is unaffected; prefer no headline animation).

## Section-specific motion (see docs/animation-spec.md)
- Hero: phones entrance + scroll parallax + desktop tilt.
- How It Works: active step highlight driven by IO (which step is centered); desktop may use sticky phone.
- Tracking: status pills advance Pending → Ongoing → Resolved on reveal, once, labeled "Illustration" — no looping, no "live" wording.
- Coordination: SVG connector `stroke-dashoffset` draw-in **once** on reveal (CSS transition — small SVG only).
- Showcase: per-phone reveal + gentle depth transition; mobile = native horizontal scroll-snap, no 3D.

## will-change
Set `will-change: transform` only during an active animation (add on start, remove on complete). Never globally.

## Reduced motion
`prefers-reduced-motion: reduce` → no GSAP load, no tilt, no parallax, reveals instant, status component shows final annotated state. Verify with DevTools emulation.

## Checklist
- [ ] Only transform/opacity animated
- [ ] No continuous rAF/setInterval loops; nothing animates while offscreen
- [ ] GSAP not in initial JS bundle (check build output)
- [ ] All contexts/ScrollTriggers/listeners cleaned up
- [ ] Desktop-only effects gated by matchMedia
- [ ] Reduced-motion and no-JS show complete content
- [ ] No pinning or scroll lock on mobile
