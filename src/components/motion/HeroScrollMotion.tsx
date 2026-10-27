"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { loadGsap } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/preferences";

/** Makes the hero visibly react to the first viewport of scrolling. */
export function HeroScrollMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section || prefersReducedMotion()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const copy = root.querySelector("[data-hero-copy]");
        const visual = root.querySelector("[data-hero-visual]");
        const glow = section.querySelector("[data-hero-glow]");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.8 },
        });

        timeline
          .to(copy, { y: -100, opacity: 0.25, ease: "none" }, 0)
          .to(visual, { y: 150, x: 70, scale: 0.82, rotateZ: 4, rotateY: -9, opacity: 0.55, ease: "none" }, 0)
          .to(glow, { scale: 1.45, opacity: 0.05, ease: "none" }, 0);
      }, root);
      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
