# Animation Spec

Conventions, tool choice, allowed properties, and the GSAP loading pattern are defined in
`.claude/skills/lightweight-motion/SKILL.md` — this doc only maps that policy onto each
section. Every row must obey that skill; this table doesn't repeat its rules.

| Section | Trigger | Effect | Breakpoints | Reduced-motion fallback | No-JS fallback |
|---|---|---|---|---|---|
| Nav | Scroll position (CSS only) | Glass bar background/border fade in past 8px scroll | All | Same (CSS only, no motion to reduce) | Fully functional; background visible without scroll listener via fallback class |
| Hero | Mount (IO none needed — above the fold) | Two phones settle into 2.5D position on load; headline never animates | ≥ 1024: pointer tilt (±6° via CSS vars, rAF-throttled). < 1024: static layered phones, no tilt | No entrance motion, no tilt; phones render at rest position immediately | Phones render at final position/opacity via plain CSS; headline and CTAs fully present |
| Intro splash | Once per session, pre-paint decision (GSAP timeline) | Beacon mark scales in (`back.out(1.5)`) → 3 radar rings ripple out, 450ms stagger → the device brightens and settles showing a real app screen → `SOS` reveals letter-by-letter behind per-letter masks (80ms stagger) → `: COMMUNITY APP` fades up → 0.5s hold → wordmark FLIPs onto the nav's own mark, device recedes, overlay fades | All sizes (type, mark and device are `clamp()`-fluid; the device is clipped by the stage on short viewports by design) | `data-intro="quick"`: brand and device painted in their final state, held 0.35s, faded out 0.35s. No GSAP requested | Overlay never displays — `html[data-intro]` is never set, page fully usable |
| Hero phone entrance | On mount (GSAP, one-shot) | Phone frame rises 44px and settles (`power3.out`, 1.05s). **Translate only** — no opacity, no scale | ≥ 1024 only | Not loaded; phone static at final position | Static at final position |
| Hero phone screen cycle | First visitor interaction (`scroll`/`pointerdown`/`keydown`/`touchstart`), then a 3.4s timer | Three real screenshots (`hero-primary` → `how-report` → `how-resolve`) crossfade with a depth slide (`translate3d(7%,0,0) scale(.98)` in, `translate3d(-5%,0,0) scale(.97)` out) | All sizes; stops when the phone leaves the viewport (IO 0.25) or the tab is hidden | No `[data-cycling]` attribute, no timer, no dots — first screen only, fully visible | First screen only, fully visible |
| Hero phone tap cursor | Each screen handoff, 620ms before it (GSAP) | Neutral white dot fades in at a per-screen coordinate, presses (scale 1 → .72 → 1), ripple expands and fades | ≥ 1024 only (a tap cursor is meaningless on touch) | Never runs; no GSAP requested by this component | Never runs |
| Hero phone glass sweep | Each screen change (GSAP) | Specular band translates `xPercent -130 → 130` across the glass in 1.05s | ≥ 1024 only | Never runs | Never runs |
| Hero phone idle float | None — pure CSS `@keyframes` | Frame drifts `translate3d(0,-11px,0)` over a 7.5s ease-in-out loop (`.phone-float`) | ≥ 1024 only | `@media (prefers-reduced-motion: no-preference)` gates the `animation` declaration | Static |
| Hero orbit badges | IO (`data-reveal`), staggered 320ms + 110ms each; then CSS drift | Three badges fade + rise around the phone, then drift on 9s/11s/10s loops at offset delays (`.orbit-drift`) | ≥ 1024 only (`hidden lg:block`) | Instant visible, no drift | Visible by default |
| Hero ambient blobs | None — pure CSS `@keyframes` | Two large low-opacity radial fields drift and scale on 22s/18s loops (`.hero-blob`); `filter: blur()` is set once and never animated | All | Static | Static |
| Hero scroll transition | Scroll (ScrollTrigger, `scrub: 0.8`) | Copy lifts and softens while the phone composition moves down/right, recedes, and rotates as the hero exits | All visual sizes; pointer tilt remains desktop-only | GSAP not loaded; hero remains fully readable and static | Static position (no JS = no scroll transition, layout unaffected) |
| Hero secondary-phone idle rotation | None — pure CSS `@keyframes`, always running once mounted | Supporting phone's `rotateY` oscillates −14° ↔ −21° over an 8s ease-in-out loop (`.hero-secondary-phone` in globals.css); `rotateX` still tracks pointer tilt via `--rx` | ≥ 1024 only (secondary phone is `hidden` below that) | `@media (prefers-reduced-motion: no-preference)` gates the `animation` declaration — reduced motion gets the static transform, no loop | Static transform (CSS animation requires no JS; without CSS the phone still renders at its base position) |
| Hero workflow cycle | None — `setInterval`, continuous while mounted | All four app steps render as real text (`Open the App → Capture & Report → Get Confirmation → Track Resolution`); the active one highlights in accent color, advancing every 1.8s | All | No interval starts; first stage stays highlighted, no cycling | Full stage-name chain renders as plain text regardless of JS; only the highlight color is script-driven |
| About | IO (`data-reveal`, rootMargin 0px, threshold 0.2) | 3-node flow fades + rises 24px, staggered ≤ 3×60ms | All | Instant visible, no transition | Visible by default (`no-js` class keeps opacity:1) |
| How It Works (mobile/tablet, < 1024) | IO per step | Each stacked step card reveals independently | < 1024 | Instant visible | Fully readable, stacked, own phone per step |
| How It Works (desktop, ≥ 1024) | ScrollTrigger progress inside a native CSS-sticky scene | Four app screenshot cards travel through a perspective rail; depth, angle, active label, and progress update from opening the app through tracking resolution. **No wheel capture or scroll hijack** | ≥ 1024 only | Static horizontally scrollable card row | Static horizontally scrollable card row |
| Reporting Categories | IO (`data-reveal`) | Grid tiles fade + rise, staggered ≤ 6×60ms per row | All | Instant visible | Visible by default |
| App Showcase (desktop ≥ 1024) | IO triggers GSAP load; ScrollTrigger scrub | Floating phones gentle depth/parallax reveal, one-shot per phone then settles | ≥ 1024 | No depth transition; phones shown at rest, fully visible | Phones visible, static, in a wrapping grid (no scroll-snap needed since no horizontal constraint) |
| App Showcase (mobile/tablet < 1024) | Native scroll | Horizontal `scroll-snap-type: x mandatory` gallery, CSS only | < 1024 | Same (native scroll, not a JS animation) | Fully functional (native CSS scroll-snap requires no JS) |
| How to Register | IO (`data-reveal`) | Step cards fade + rise | All | Instant visible | Visible by default |
| Incident Tracking | IO, **once** | Status pills advance Pending → Ongoing → Cleared in sequence, then stop, labeled "Illustration" | All (desktop may use a slightly longer stagger) | Shows final state (Cleared) immediately, fully annotated | All three states render in the DOM with the "Illustration" label; without JS, final/annotated state is shown directly (no sequence) |
| Responder Coordination | IO, **once** | SVG connector lines draw in via `stroke-dashoffset` CSS transition (not per-frame JS) | All | Connectors render fully drawn, no transition | Connectors fully drawn (static SVG, no JS dependency) |
| FAQ | Click/keyboard (native `<details>`) | Chevron rotates (CSS transition), content expands natively | All | Same (native disclosure, not reduced-motion-gated) | Fully functional — native HTML, zero JS required |
| Final CTA | IO (`data-reveal`) | Fade + rise, no phones, minimal | All | Instant visible | Visible by default |
| Footer | None | Static | All | Static | Static |

## Shared mechanics

- **Continuous-loop exception:** lightweight-motion's default is one-shot over
  continuous motion. The hero's secondary-phone idle rotation and workflow-cycle
  highlight are deliberate exceptions — explicitly requested by the user as a
  lightweight CSS/JS stand-in for a reference 3D hero animation (a rotating object in a
  photoreal 3D scene, which was declined in favor of this interpretation to stay
  within the Three.js-free, ≤130KB-JS budget). Both are gated by
  `prefers-reduced-motion`, cost nothing per frame (CSS compositor animation; a 1.8s
  `setInterval` triggering a small React state update, not an rAF loop), and never hide
  content — don't take their presence as license to add more continuous loops
  elsewhere without the same explicit ask.
- One shared `IntersectionObserver` (see `src/lib/motion/`) drives every `[data-reveal]`
  element; `unobserve` after reveal.
- GSAP is dynamically imported only inside the scroll-linked effects (hero
  transition/parallax, showcase depth, How It Works desktop gallery), loaded via
  `requestIdleCallback`/near-viewport IO — never in the initial bundle. Verified in
  `docs/performance-checklist.md` build-output check.
- `prefers-reduced-motion: reduce` → GSAP never imported; all reveals apply their
  `.is-visible` end state via the plain CSS media-query rule, no JS needed.
- No-JS: `<html>` carries a `no-js` class removed by a tiny inline script on hydration;
  while absent (or if JS never runs), `.no-js [data-reveal]` forces the visible end state.
- `will-change: transform` is added only for the duration of an active animation and
  removed on completion/`ScrollTrigger` leave.
- **Shared easing and duration tokens** live in `globals.css` `@theme`:
  `--ease-soft` (`cubic-bezier(.2,.7,.2,1)`, GSAP equivalent `power3.out`),
  `--ease-settle`, `--dur-hover` 200ms, `--dur-base` 400ms, `--dur-reveal` 700ms.
  Every transition on the page resolves to one of these — don't introduce a new
  bezier or a duration outside 200–800ms without updating this list.
- **`.hover-lift`** is the one shared hover treatment (3px rise, `--dur-hover`,
  `--ease-soft`), applied to CTAs and cards. Gated on
  `(hover: hover) and (pointer: fine)` and neutralized under reduced motion.
- **`[data-reveal-stagger]`** gives a parent CSS-only sibling stagger
  (0/70/140/210/280ms, capped at 5 steps) as an alternative to one `delayMs` per child.

## Why the hero cycle waits for interaction (LCP)

Measured, not theoretical. The hero phone overhangs the viewport bottom at common
desktop sizes (−44px at 1280×800, −43.6px at 1024×768), so the entrance tween's first
paint is slightly smaller than the settled one. LCP records a new candidate on any
strictly-larger paint, so an unprompted cycle handed LCP to whichever screen it
advanced to: **195,015px² at 224ms, then 197,842px² at 5,228ms** against a 2.5s budget.

Three things keep that fixed, and all three are load-bearing:

1. The entrance **translates only** — adding `scale` or `opacity` reintroduces it.
2. Every screen-transition `scale` is **≤ 1**, so an incoming screen is never briefly
   larger than the first one.
3. The auto-advance waits for the first `scroll`/`pointerdown`/`keydown`/`touchstart`.
   `pointermove` is deliberately **excluded**: Chrome does not end the LCP window on
   it, so a mouse-only visitor would have reported the second screen (measured 6.8s).

A lab run never interacts, so LCP stays the first screen at ~216ms; a real visitor's
input finalizes LCP before the first advance lands. The dot controls beneath the phone
drive the screens manually in the meantime.


## Intro splash

`src/components/motion/IntroSplash.tsx` + `src/lib/motion/intro.ts`.

### Why the decision happens in an inline script

Visibility is owned by `html[data-intro]`, stamped by the inline script in
`src/app/layout.tsx` **before first paint**. The overlay markup is always
server-rendered but defaults to `display: none`. Deciding there rather than in React
is what keeps all three paths flash-free:

| Path | `data-intro` | Result |
|---|---|---|
| No JS | never set | Overlay never displays; page fully usable |
| Returning visit (sessionStorage) | never set | No flash of the overlay |
| First visit | set pre-paint | No flash of the page behind it |
| Reduced motion | `"quick"` | Static brand, 0.35s hold + 0.35s fade, zero GSAP |

The overlay is a **sibling of `<main>`**, never a wrapper, so the page renders and
loads underneath it the whole time and nothing about it defers the hero's images.
Measured: LCP stays the hero screenshot at 120–172ms across 320–1920px with the intro
playing, and the splash never becomes an LCP candidate of its own.

### The device

The splash shows the app itself: a real registered screenshot (`hero-primary`) in the
page's own `PhoneFrame`, so the intro and the hero read as one piece of design. Never a
mock-up, per `.claude/skills/sos-content-accuracy` ("Never fabricate app UI").

Two constraints shape it, both measured:

1. **It declares the same `sizes` as the hero phone** (`(min-width: 640px) 300px,
   260px`). Same slot, same `sizes` → the optimizer serves one variant and the two
   share a single image request. Mismatched `sizes` would fetch a second variant of
   the same file — the duplicate-variant trap documented in
   `docs/performance-checklist.md`.
2. **It starts dim-but-painted and settles DOWNWARD**, never upward. On mobile the
   hero phone is below the fold, so this device is the largest in-viewport content and
   therefore the LCP element. Fading it up from `opacity: 0` and rising it into frame
   grew its painted area late and moved LCP from 160ms to **1.65s**. LCP ignores only
   *fully* transparent elements, so the resting state is `opacity: 0.22` with
   `translate3d(0, -12px, 0)` — already a candidate at first paint, and every later
   frame is smaller. Measured after the change: a single LCP candidate at 68–92ms
   across 320/375/390/1440.

The device is expected to overflow the bottom of a short viewport; `.intro-root` clips
it. That reads as the device rising into frame and removes any need to shrink it to fit
the shortest phone.

### Gotcha: GSAP `xPercent`/`yPercent` on top of a percentage CSS transform

Cost two real bugs, both now fixed, so it is written down:

**Computed style reports a percentage transform in pixels.** `transform:
translate3d(0, 115%, 0)` on an 88px-tall element computes to `matrix(…, 101.2)`. GSAP
reads that `101.2` as `y`, then applies `yPercent` *on top of it*. So the natural-looking

```js
gsap.fromTo(el, { yPercent: 115 }, { yPercent: 0 })   // WRONG
```

animates to `y: 101.2px + 0%` — **exactly where it started**.

Pin the pixel component to zero in both vars:

```js
gsap.fromTo(el, { y: 0, yPercent: 115 }, { y: 0, yPercent: 0 })   // right
```

Two places were silently broken by this and looked fine to every numeric check:

- **The intro wordmark never appeared.** The letters sat behind their masks for the
  whole sequence. Every metric passed — the element had the right size, the nav FLIP
  measured pixel-exact — because the `[data-intro-word]` *container* was correct; only
  its children were parked. Caught by taking a screenshot.
- **The hero phone's specular sweep never crossed the glass.** It was pinned at -858px
  for a 307px-wide frame. After the fix the band travels -1032px → +668px and
  genuinely passes over the device.

Lesson for this repo: a transform bug can pass every rect/size assertion. Screenshot
anything whose whole purpose is to be seen.

### Adjusting or disabling

- **Disable entirely:** `INTRO_ENABLED = false` in `src/lib/motion/intro.ts`. The
  inline script then emits nothing and the overlay stays `display: none` forever.
- **Retime:** every duration lives in `INTRO_TIMING` in the same file (`markIn`,
  `ringStagger`, `wordStart`, `letterStagger`, `subStart`, `hold`, `exit`, plus the
  `reduced*` pair). Total is ~3.0s; keep it near that — it's a brand beat, not a loader.
- **Replace the mark:** swap the single `<svg data-intro-mark>` in `IntroSplash.tsx`.
  Nothing else in the sequence reads its internals. `--intro-mark-size` in
  `globals.css` controls its fluid size and the radar rings track it.
- **Change the app screen shown:** `INTRO_SCREEN` at the top of `IntroSplash.tsx` is a
  single `byId()` lookup. If you point it at a slot the hero doesn't also use, give it
  `sizes` matching that call site or accept a second image request. `.intro-device` in
  `globals.css` controls its width.
- **Re-show during testing:** clear `sessionStorage` key `sos:intro-played` (or open a
  new tab). It's written as soon as the intro *starts*, so a reload mid-sequence
  doesn't replay it.

### Hand-off to the hero

`markIntroDone()` releases two things that would otherwise animate behind the opaque
overlay and be finished before anyone could see them:

1. **The shared reveal observer** (`src/lib/motion/reveal-observer.ts`) holds every
   `observeReveal()` registration until the intro settles. `IntersectionObserver` has
   no concept of occlusion, so without this gate all above-the-fold reveals fire
   immediately. Measured: 2 of 42 reveals visible at intro end, not 42.
2. **The hero phone entrance** (`PhoneShowcase`) waits via `onIntroDone()`, so the
   phone rises as the overlay clears. The phone's screen cycle additionally re-syncs
   on intro end, because a keypress can both skip the intro and count as engagement
   in the same tick.

`onIntroDone(cb)` fires **synchronously** when no intro is running, so callers need no
branching of their own.

### Scroll lock

`html.intro-lock` sets `overflow: hidden` **and** `scrollbar-gutter: stable`, so
removing the scrollbar doesn't reflow the page into a CLS hit. Measured CLS with the
intro playing: ≤ 0.0134 across all breakpoints, against a 0.1 budget.

### Skip

Click/tap anywhere, any keypress, or the corner Skip button (44x44 minimum, focused on
mount so keyboard users can reach it without hunting). Skipping is immediate and
unanimated — a skip that takes 800ms isn't a skip. Focus returns to `#main` afterwards
so nobody is left focused on a hidden element. The per-letter spans are `aria-hidden`
and the full brand name is exposed once via `.sr-only`.

### FLIP accuracy

The closing move measures `[data-nav-brand]` (the nav's own `SOS` span) and tweens the
splash wordmark onto it, scaling by height ratio — the same string in the same family,
so the ratio is exact. Verified landing error: `dx=0, dy=0, height ratio 1.00` at both
1440x900 and 390x844. The wordmark cross-fades out over the final 180ms so the nav's
real text takes over and any hairline weight difference never shows.
