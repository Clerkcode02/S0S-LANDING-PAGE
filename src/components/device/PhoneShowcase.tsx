"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Screenshot, Slot } from "@/config/screenshots";
import { PhoneFrame } from "./PhoneFrame";
import { loadGsap } from "@/lib/motion/gsap";
import { isDesktopViewport, prefersReducedMotion } from "@/lib/motion/preferences";
import { introSettled, onIntroDone } from "@/lib/motion/intro";

export interface ShowcaseScreen {
  screenshot: Screenshot;
  slot: Slot;
  /** Short label for the screen picker beneath the phone. */
  label: string;
  /** Where the simulated tap lands as this screen hands off, in % of the screen
   * box — positioned over the relevant region of the real screenshot. */
  tap: { x: number; y: number };
}

const DWELL_MS = 3400;
const TAP_LEAD_MS = 620;

/**
 * The hero device. An auto-cycling stack of REAL registered screenshots with
 * App-Store-style depth-slide transitions, a specular glass sweep on each change,
 * and a neutral tap cursor that lands just before the handoff.
 *
 * Nothing inside the screen is synthesized — every pixel of app UI is a real
 * screenshot from src/config/screenshots.ts, per .claude/skills/sos-content-accuracy
 * ("Never fabricate app UI"). The cursor dot and the sweep are presentation chrome
 * drawn over the screenshot; neither imitates a control inside the real app.
 *
 * Three tiers, per .claude/skills/lightweight-motion:
 * - Desktop, motion allowed → GSAP entrance + cycling + sweep + tap cursor.
 * - Mobile, motion allowed  → cycling only, driven by CSS transitions; this
 *   component requests no GSAP of its own (other sections still may).
 * - Reduced motion / no JS  → first screen only, fully visible, no timers.
 * The cycle stops whenever the phone leaves the viewport or the tab is hidden, and
 * does not start until the visitor interacts — see the LCP note on that effect.
 */
export function PhoneShowcase({
  screens,
  className = "",
}: {
  screens: ShowcaseScreen[];
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [cycling, setCycling] = useState(false);
  // The screens after the first are not fetched until the visitor engages. They
  // can't be seen before then (the cycle waits for the same signal), and loading
  // them eagerly put ~53KB of off-screen imagery on the initial payload — measured
  // as a Lighthouse LCP regression from 2.78s to 3.23s. See docs/performance-checklist.md.
  const [loadRest, setLoadRest] = useState(false);

  // Mirrors `active` so timers and observers never close over a stale index.
  // Written in an effect, not during render.
  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Whether the GSAP-driven embellishments are allowed. Set once on mount so the
  // cycle loop can check it synchronously without re-querying matchMedia.
  const enhancedRef = useRef(false);

  const goTo = useCallback((next: number) => {
    setPrevious(activeRef.current);
    setActive(next);
  }, []);

  /* -- Tap cursor + ripple ------------------------------------------------
   * Desktop-only: it's the one piece here that needs GSAP, and a tap cursor is
   * meaningless on a touch device anyway. */
  const playTap = useCallback((tap: { x: number; y: number }) => {
    const cursor = cursorRef.current;
    const ripple = rippleRef.current;
    if (!cursor || !ripple || !enhancedRef.current) return;

    loadGsap().then(({ gsap }) => {
      // Position is set once per tap, never tweened — only transform and opacity
      // animate from here on.
      gsap.set([cursor, ripple], { left: `${tap.x}%`, top: `${tap.y}%` });
      gsap
        .timeline()
        .fromTo(
          cursor,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.26, ease: "power3.out" },
        )
        .to(cursor, { scale: 0.72, duration: 0.1, ease: "power2.in" })
        .to(cursor, { scale: 1, duration: 0.14, ease: "power2.out" })
        .fromTo(
          ripple,
          { opacity: 0.85, scale: 0.6 },
          { opacity: 0, scale: 4.5, duration: 0.62, ease: "power2.out" },
          "-=0.2",
        )
        .to(cursor, { opacity: 0, duration: 0.24, ease: "power2.in" }, "-=0.18");
    });
  }, []);

  /* -- Entrance: rise + settle -------------------------------------------
   * Translate only — no opacity, and deliberately no scale.
   *
   * Both of those would wreck LCP on this specific element. The frame holds the
   * hero's priority screenshot, so fading it up from 0 delays the LCP paint by the
   * length of the tween. Scaling is subtler and worse: it makes the FIRST screen
   * paint at a smaller visible size, so when the cycle advances, the next screen
   * paints LARGER and is recorded as a new, much later LCP candidate (measured: the
   * second screen was being reported as LCP at ~4s). Translating keeps every screen
   * the same visible size, so they tie and the first one stays the LCP.
   * See .claude/skills/lightweight-motion ("Easing & timing"). */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || prefersReducedMotion() || !isDesktopViewport()) return;
    enhancedRef.current = true;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // Waits for the intro splash so the phone rises as the overlay clears rather
    // than behind it. Fires synchronously when no intro is running.
    const unsubscribe = onIntroDone(() => {
      if (cancelled) return;
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        const ctx = gsap.context(() => {
          gsap.fromTo(
            frame,
            { y: 44 },
            {
              y: 0,
              duration: 1.05,
              ease: "power3.out",
              // will-change only for the life of the tween, never globally.
              onStart: () => frame.style.setProperty("will-change", "transform"),
              onComplete: () => frame.style.removeProperty("will-change"),
            },
          );
        }, frame);
        cleanup = () => ctx.revert();
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
      cleanup?.();
    };
  }, []);

  /* -- Auto-cycle ---------------------------------------------------------
   * Gated on three things: the phone being in the viewport, the tab being
   * visible, and the visitor having interacted at least once.
   *
   * That last gate is a hard LCP requirement, not a stylistic choice. The hero
   * phone is clipped by the viewport bottom at common desktop sizes (measured:
   * -44px of overhang at 1280x800), so the entrance tween's first paint is
   * slightly smaller than the settled one. LCP records a new candidate on any
   * strictly-larger paint, which means an unprompted cycle hands LCP to whichever
   * screen it advances to — measured at 5.3s against a 2.5s budget. Waiting for
   * input fixes it at both ends: a lab run never interacts, so LCP stays the first
   * screen at ~270ms; a real visitor's input finalizes LCP before the first
   * advance can land. The dots below drive it manually in the meantime.
   * See .claude/skills/performance-audit ("Core Web Vitals"). */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || screens.length < 2 || prefersReducedMotion()) return;

    // Enables the CSS transitions on the stack and reveals the dot controls, so
    // the screens are reachable immediately even if the timer never starts.
    setCycling(true);

    let timer: number | undefined;
    let handoff: number | undefined;
    let inView = false;
    let engaged = false;

    const stop = () => {
      if (timer) window.clearTimeout(timer);
      if (handoff) window.clearTimeout(handoff);
      timer = undefined;
      handoff = undefined;
    };

    const schedule = () => {
      stop();
      timer = window.setTimeout(() => {
        const next = (activeRef.current + 1) % screens.length;
        // The pointer taps first, then the screen changes — so the transition
        // reads as caused by the tap rather than arbitrary.
        playTap(screens[activeRef.current].tap);
        handoff = window.setTimeout(
          () => {
            goTo(next);
            schedule();
          },
          enhancedRef.current ? TAP_LEAD_MS : 0,
        );
      }, DWELL_MS);
    };

    const sync = () => {
      if (engaged && inView && !document.hidden && introSettled()) schedule();
      else stop();
    };

    // A keypress can both skip the intro and count as engagement in the same tick,
    // so re-evaluate once the overlay is actually gone.
    const unsubscribeIntro = onIntroDone(sync);

    // Deliberately only the events Chrome actually ends the LCP window on —
    // scroll, tap and keypress. "pointermove" is excluded on purpose: it would
    // start the cycle without finalizing LCP, so a visitor who moves the mouse but
    // never scrolls or clicks would report the second screen's paint as their LCP
    // (measured: 6.8s). Any scroll on a landing page this long starts it anyway.
    const ENGAGE_EVENTS = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const onEngage = () => {
      if (engaged) return;
      engaged = true;
      // Starts fetching the remaining screens now — a full DWELL_MS before the
      // first one is needed on screen.
      setLoadRest(true);
      for (const type of ENGAGE_EVENTS) window.removeEventListener(type, onEngage);
      sync();
    };
    for (const type of ENGAGE_EVENTS) {
      window.addEventListener(type, onEngage, { passive: true, once: false });
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(frame);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      unsubscribeIntro();
      for (const type of ENGAGE_EVENTS) window.removeEventListener(type, onEngage);
    };
  }, [screens, goTo, playTap]);

  /* -- Specular sweep on each screen change ------------------------------ */
  useEffect(() => {
    const sweep = sweepRef.current;
    if (!sweep || previous === null || !enhancedRef.current) return;

    loadGsap().then(({ gsap }) => {
      // `x: 0` pinned in both vars for the same reason as the intro wordmark: the
      // CSS resting transform is `translate3d(-130%, 0, 0)`, which computed style
      // reports in pixels, and GSAP would otherwise add `xPercent` on top of that
      // offset — parking the sweep off the glass for the whole tween.
      gsap.fromTo(
        sweep,
        { x: 0, xPercent: -130 },
        {
          x: 0,
          xPercent: 130,
          duration: 1.05,
          ease: "power2.inOut",
          onStart: () => sweep.style.setProperty("will-change", "transform"),
          onComplete: () => sweep.style.removeProperty("will-change"),
        },
      );
    });
  }, [active, previous]);

  const first = screens[0];

  return (
    <div className={className}>
      <PhoneFrame
        ref={frameRef}
        screenshot={first.screenshot}
        slot={first.slot}
        priority
        chrome
        screen={
          <div
            className="screen-stack relative"
            data-cycling={cycling ? "" : undefined}
            // The stack, not the first child, owns the height — see the
            // .screen-stack LCP note in globals.css. All cycled screenshots share
            // one aspect ratio, and object-fit: contain keeps any future odd one
            // uncropped rather than silently letterboxing it away.
            style={{ aspectRatio: `${first.screenshot.width} / ${first.screenshot.height}` }}
          >
            {screens.map((screen, i) => {
              const shot = screen.screenshot;
              const isActive = i === active;
              return (
                <div
                  key={shot.id}
                  data-screen=""
                  data-active={isActive ? "" : undefined}
                  data-leaving={previous === i && !isActive ? "" : undefined}
                >
                  {(i === 0 || loadRest) && (
                    <Image
                      src={shot.src as string}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      // Accurate to the real render, not the viewport: the phone
                      // is capped at 280px (<640px) / 320px, and PhoneFrame's
                      // p-2.5 takes 20px off, so the image box is 260px / 300px.
                      // The old "70vw" over-stated it by ~11%, which was enough to
                      // push Next's optimizer up to a 640w variant for a 455w box.
                      sizes="(min-width: 640px) 300px, 260px"
                      priority={i === 0}
                      fetchPriority={i === 0 ? "high" : "low"}
                      loading={i === 0 ? undefined : "lazy"}
                    />
                  )}
                </div>
              );
            })}
          </div>
        }
        overlay={
          <>
            <span ref={sweepRef} aria-hidden="true" className="phone-glass-sweep" />
            <span ref={rippleRef} aria-hidden="true" className="tap-ripple" />
            <span ref={cursorRef} aria-hidden="true" className="tap-cursor" />
          </>
        }
      />

      {/* Real, keyboard-operable control — the auto-cycle is never the only way to
        * reach a screen. Rendered only when the cycle is actually running. */}
      {cycling && (
        <div className="mt-6 flex items-center justify-center gap-1">
          {screens.map((screen, i) => (
            <button
              key={screen.screenshot.id}
              type="button"
              aria-label={`Show screen: ${screen.label}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
              className="group grid min-h-11 min-w-11 place-items-center"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-7 bg-accent" : "w-1.5 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
