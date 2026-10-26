"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion/preferences";
import { loadGsap } from "@/lib/motion/gsap";

const MAX_TILT_DEG = 6;

/**
 * Pointer tilt + scroll parallax for the hero phone stack. Tilt is CSS-var driven (see
 * below); parallax is lazy-loaded GSAP/ScrollTrigger, desktop + no-reduced-motion only,
 * small ranges (translateY ≤ 80px, rotate ≤ 6°). See
 * .claude/skills/lightweight-motion/SKILL.md ("Pointer tilt", "Scroll parallax",
 * "GSAP loading pattern").
 */
export function TiltOnHover({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);

  // Scroll parallax — lazy-loaded only once the hero nears the viewport, and only when
  // motion is actually wanted. Checked here (before the dynamic import even starts),
  // not just inside gsap.matchMedia, so reduced motion means zero GSAP bytes fetched —
  // see .claude/skills/lightweight-motion/SKILL.md ("Reduced motion").
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        const start = () =>
          loadGsap().then(({ gsap }) => {
            if (cancelled) return;
            const mm = gsap.matchMedia();
            mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
              const ctx = gsap.context(() => {
                gsap.fromTo(
                  el,
                  { y: -24 },
                  {
                    y: 24,
                    ease: "none",
                    scrollTrigger: {
                      trigger: el,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.6,
                    },
                  },
                );
              }, el);
              return () => ctx.revert();
            });
            cleanup = () => mm.revert();
          });

        if ("requestIdleCallback" in window) {
          (window as typeof window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(start);
        } else {
          start();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

  // Pointer tilt
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let io: IntersectionObserver | null = null;
    let active = false;

    function onPointerMove(e: PointerEvent) {
      if (!active) return;
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const rect = el!.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return; // avoid division by zero / NaN|Infinity transforms
        const px = Math.min(0.5, Math.max(-0.5, (e.clientX - rect.left) / rect.width - 0.5));
        const py = Math.min(0.5, Math.max(-0.5, (e.clientY - rect.top) / rect.height - 0.5));
        el!.style.setProperty("--ry", `${(px * MAX_TILT_DEG * 2).toFixed(2)}deg`);
        el!.style.setProperty("--rx", `${(-py * MAX_TILT_DEG * 2 + 6).toFixed(2)}deg`);
      });
    }

    function onPointerLeave() {
      el!.style.transition = "transform 400ms cubic-bezier(.2,.7,.2,1)";
      el!.style.removeProperty("--ry");
      el!.style.removeProperty("--rx");
    }

    function attach() {
      el!.addEventListener("pointermove", onPointerMove, { passive: true });
      el!.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    function detach() {
      el!.removeEventListener("pointermove", onPointerMove);
      el!.removeEventListener("pointerleave", onPointerLeave);
    }

    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          active = entry.isIntersecting;
          if (active) attach();
          else detach();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    return () => {
      detach();
      io?.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={ref} className={`perspective-stage ${className}`}>
      {children}
    </div>
  );
}
