"use client";

import { useCallback, useEffect, useRef } from "react";
import { site } from "@/content/site";
import { byId } from "@/config/screenshots";
import { PhoneFrame } from "@/components/device/PhoneFrame";
import { loadGsap } from "@/lib/motion/gsap";
import {
  INTRO_TIMING,
  introMode,
  markIntroDone,
  rememberIntroPlayed,
} from "@/lib/motion/intro";

const MARK_LETTERS = site.shortName.split(""); // "SOS"
const SUB = ": COMMUNITY APP";

/** The app screen the intro shows. Same slot and same `sizes` as the hero phone, so
 *  the two share one optimized image request rather than fetching two variants of
 *  the same file. */
const INTRO_SCREEN = byId("hero-primary");
const INTRO_SCREEN_SIZES = "(min-width: 640px) 300px, 260px";

/**
 * Brand intro splash. Plays once per session, then hands the page over.
 *
 * Visibility is driven entirely by `html[data-intro]`, stamped before first paint by
 * the inline script in src/app/layout.tsx — this component's markup is always
 * server-rendered but stays `display: none` unless that attribute is present. That's
 * what makes the three paths behave:
 *   - no JS            → attribute never set, overlay never shows, page fully usable
 *   - returning visit  → attribute never set, no flash of the overlay
 *   - first visit      → attribute set pre-paint, no flash of the page underneath
 *
 * The page renders and loads normally underneath the whole time; the overlay is a
 * sibling of <main>, never a wrapper, so nothing about it defers the hero's images.
 *
 * Sequence (see INTRO_TIMING): mark scales in with a settle → radar rings ripple out
 * → wordmark reveals letter-by-letter behind a mask → sub-wordmark fades up → the
 * device rises into frame showing a real app screen → 0.5s hold → the "SOS"
 * wordmark FLIPs to its measured position in the nav, the device recedes, and the
 * overlay fades, then `markIntroDone()` releases the hero animations.
 *
 * Reduced motion gets `data-intro="quick"`: the brand is painted statically and
 * fades out, no GSAP requested at all.
 */
export function IntroSplash() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const finishRef = useRef<(() => void) | null>(null);

  const skip = useCallback(() => {
    finishRef.current?.();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const mode = introMode();
    if (!root || mode === null) return;

    rememberIntroPlayed();

    let cancelled = false;
    let cleanupGsap: (() => void) | undefined;

    // Restores focus to the page body once the overlay goes away, so a keyboard user
    // who was on the Skip button isn't left with focus on a removed element.
    const releaseFocus = () => {
      const main = document.getElementById("main");
      if (!main) return;
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      main.removeAttribute("tabindex");
    };

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      finishRef.current = null;
      root.style.pointerEvents = "none";
      releaseFocus();
      markIntroDone();
    };

    /* -- Reduced motion: a quick static fade, zero GSAP ------------------- */
    if (mode === "quick") {
      root.dataset.state = "quick-out";
      const t = window.setTimeout(finish, (INTRO_TIMING.reducedHold + INTRO_TIMING.reducedFade) * 1000);
      finishRef.current = () => {
        window.clearTimeout(t);
        finish();
      };
      return () => {
        window.clearTimeout(t);
      };
    }

    /* -- Full sequence ---------------------------------------------------- */
    // Usable immediately: a click during the dynamic import must still skip, so the
    // plain finish() stands in until the timeline-aware version replaces it.
    finishRef.current = finish;

    // Any key dismisses too — the overlay swallows the page, so every input route
    // out of it has to work, not just the pointer.
    const onKeyDown = () => finishRef.current?.();
    window.addEventListener("keydown", onKeyDown);

    // Give the Skip button focus so keyboard users can act on it without hunting.
    root.querySelector<HTMLButtonElement>("[data-intro-skip]")?.focus({ preventScroll: true });

    // If GSAP never arrives (chunk fails, offline mid-load), the sequence can't run
    // and nothing would otherwise call finish() — leaving an opaque overlay over the
    // whole page. Release it rather than trap the visitor.
    const failsafe = window.setTimeout(finish, 6000);

    loadGsap().catch(() => finish()).then((mod) => {
      if (cancelled || !mod) return;
      const { gsap } = mod;
      window.clearTimeout(failsafe);
      const ctx = gsap.context(() => {
        const t = INTRO_TIMING;
        const timeline = gsap.timeline();

        // 1. Mark scales up and settles, glow blooms with it.
        timeline
          .fromTo(
            "[data-intro-mark]",
            { scale: 0.86, opacity: 0 },
            { scale: 1, opacity: 1, duration: t.markIn, ease: "back.out(1.5)" },
            0,
          )
          .fromTo(
            "[data-intro-glow]",
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.9, ease: "power2.out" },
            0,
          );

        // 2. Radar rings ripple outward from behind the mark, staggered.
        timeline.fromTo(
          "[data-intro-ring]",
          { scale: 0.5, opacity: 0.55 },
          {
            scale: 2.6,
            opacity: 0,
            duration: 1.9,
            ease: "power2.out",
            stagger: t.ringStagger,
          },
          0.25,
        );

        // 3. Wordmark letters slide up from behind their masks.
        //
        // `y: 0` in BOTH vars is required, not decorative. The resting state in CSS
        // is `translate3d(0, 115%, 0)`, which computed style reports as a PIXEL
        // value (101.2px at an 88px font size). GSAP reads that as `y` and then
        // applies `yPercent` on top of it, so a naive fromTo(yPercent 115 -> 0)
        // lands at `y: 101.2px + 0%` — exactly where it started, leaving the
        // wordmark hidden behind its mask for the whole sequence. Pinning `y` to 0
        // hands the whole movement to the percentage.
        timeline.fromTo(
          "[data-intro-letter]",
          { y: 0, yPercent: 115 },
          {
            y: 0,
            yPercent: 0,
            duration: 0.62,
            ease: "power3.out",
            stagger: t.letterStagger,
          },
          t.wordStart,
        );

        // 4. Sub-wordmark fades up underneath.
        timeline.fromTo(
          "[data-intro-sub]",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          t.subStart,
        );

        // 5. The app materialises and settles. It brightens from the dim, already
        // painted base state set in globals.css and settles DOWNWARD (-12px -> 0),
        // never upward — see the .intro-device comment there for why that direction
        // is load-bearing for LCP on mobile.
        timeline.to(
          "[data-intro-device]",
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          t.deviceStart,
        );

        // 6. Hold, then FLIP the wordmark into the nav, recede the device, and fade
        //    the overlay out.
        timeline.call(
          () => {
            const word = wordRef.current;
            const target = document.querySelector<HTMLElement>("[data-nav-brand]");
            const exit = gsap.timeline({ onComplete: finish });

            if (word && target) {
              const from = word.getBoundingClientRect();
              const to = target.getBoundingClientRect();
              if (from.height > 0 && to.height > 0) {
                // Same string, same family — a height ratio is an accurate scale, so
                // the wordmark lands exactly on the nav's own mark.
                exit.to(
                  word,
                  {
                    x: to.left + to.width / 2 - (from.left + from.width / 2),
                    y: to.top + to.height / 2 - (from.top + from.height / 2),
                    scale: to.height / from.height,
                    duration: t.exit,
                    ease: "power3.inOut",
                  },
                  0,
                );
                // Cross-faded out as it lands so the nav's real text takes over and
                // any hairline weight difference never shows.
                exit.to(word, { opacity: 0, duration: 0.18, ease: "power1.in" }, t.exit - 0.18);
              }
            }

            exit
              .to("[data-intro-device]", { y: 48, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
              .to("[data-intro-sub]", { opacity: 0, y: -6, duration: 0.3, ease: "power2.in" }, 0)
              .to("[data-intro-mark], [data-intro-glow]", { opacity: 0, scale: 1.1, duration: 0.45, ease: "power2.in" }, 0)
              .to("[data-intro-skip]", { opacity: 0, duration: 0.2 }, 0)
              .to(root, { opacity: 0, duration: 0.42, ease: "power2.inOut" }, t.exit - 0.42);
          },
          undefined,
          t.subStart + 0.5 + t.hold,
        );

        finishRef.current = () => {
          timeline.kill();
          // Skipping is immediate and unanimated — a skip that takes 800ms isn't a skip.
          gsap.set(root, { opacity: 0 });
          finish();
        };

        cleanupGsap = () => ctx.revert();
      }, root);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      window.removeEventListener("keydown", onKeyDown);
      cleanupGsap?.();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-intro-root
      onClick={skip}
      className="intro-root fixed inset-0 z-[200] grid place-items-center bg-ink"
    >
      {/* Brand-red glow behind the mark. filter: blur() is painted once, never animated. */}
      <span aria-hidden="true" data-intro-glow className="intro-glow" />

      <div className="relative flex flex-col items-center px-6">
        {/* Radar rings — the SOS/beacon motif. Decorative, transform+opacity only. */}
        <span aria-hidden="true" className="intro-rings">
          <span data-intro-ring className="intro-ring" />
          <span data-intro-ring className="intro-ring" />
          <span data-intro-ring className="intro-ring" />
        </span>

        {/* Built placeholder mark — concentric beacon, accent red, no asset needed.
            Swap this one <svg> for real artwork when brand files arrive; nothing
            else in the sequence depends on its internals. */}
        <svg
          aria-hidden="true"
          data-intro-mark
          viewBox="0 0 48 48"
          className="intro-mark"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="24" cy="24" r="5" fill="currentColor" stroke="none" />
          <circle cx="24" cy="24" r="12" strokeWidth="2.25" opacity="0.75" />
          <circle cx="24" cy="24" r="19.5" strokeWidth="1.75" opacity="0.4" />
        </svg>

        {/* The brand, exactly as src/content/site.ts records it. The per-letter spans
            are aria-hidden and the full name is given once to assistive tech. */}
        <p className="intro-word-row">
          <span className="sr-only">{site.name}</span>
          <span ref={wordRef} aria-hidden="true" data-intro-word className="intro-word">
            {MARK_LETTERS.map((letter, i) => (
              <span key={`${letter}-${i}`} className="intro-letter-mask">
                <span data-intro-letter className="intro-letter">
                  {letter}
                </span>
              </span>
            ))}
          </span>
        </p>

        <p aria-hidden="true" data-intro-sub className="intro-sub">
          {SUB}
        </p>
      </div>

      {/* The app. A real screenshot in the page's own PhoneFrame — same component,
          same chrome, so the intro and the hero read as one piece of design. */}
      <div data-intro-device className="intro-device">
        <PhoneFrame
          screenshot={INTRO_SCREEN}
          slot="hero-primary"
          sizes={INTRO_SCREEN_SIZES}
          chrome
        />
      </div>

      <button
        type="button"
        data-intro-skip
        onClick={skip}
        className="intro-skip focus-ring-on-accent"
      >
        Skip
      </button>
    </div>
  );
}
