"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { loadGsap } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/preferences";

/**
 * Gentle scroll-linked depth transition for the desktop showcase phones — each phone
 * drifts a small amount as the section scrolls past, settling once scrolled through.
 * Lazy-loaded GSAP, desktop + no-reduced-motion only, small ranges. See
 * .claude/skills/lightweight-motion/SKILL.md ("Showcase", "Scroll parallax").
 */
export function ShowcaseDepth({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    // Reduced motion is checked before the dynamic import, not just inside
    // gsap.matchMedia, so reduced motion means zero GSAP bytes fetched.
    if (!el || prefersReducedMotion()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        loadGsap().then(({ gsap }) => {
          if (cancelled) return;
          const mm = gsap.matchMedia();
          mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
            const ctx = gsap.context(() => {
              const phones = gsap.utils.toArray<HTMLElement>("[data-showcase-phone]", el);
              phones.forEach((phone, i) => {
                gsap.fromTo(
                  phone,
                  { y: i % 2 === 0 ? 30 : -30 },
                  {
                    y: i % 2 === 0 ? -30 : 30,
                    ease: "none",
                    scrollTrigger: {
                      trigger: el,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.6,
                    },
                  },
                );
              });
            }, el);
            return () => ctx.revert();
          });
          cleanup = () => mm.revert();
        });
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

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
