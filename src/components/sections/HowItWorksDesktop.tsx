"use client";

import { useEffect, useRef, useState } from "react";
import type { HowItWorksStage } from "@/content/sections";
import { byId } from "@/config/screenshots";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { loadGsap } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/preferences";

/**
 * Desktop (≥1024px) How It Works layout: a sticky phone that swaps screenshot as the
 * active stage changes. Active stage is driven by IntersectionObserver (which step is
 * centered) — see .claude/skills/lightweight-motion/SKILL.md ("How It Works"). No
 * `position: sticky` scroll-jacking: the phone simply stays in place for the height of
 * the step list, which is a plain CSS behavior independent of JS. The thin progress
 * line is a decorative GSAP/ScrollTrigger scrub (scaleY only), lazy-loaded and gated to
 * desktop + no-reduced-motion — it never affects which content is readable.
 */
export function HowItWorksDesktop({ stages }: { stages: HowItWorksStage[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Decorative scroll progress line alongside the step list. Reduced motion is checked
  // before the dynamic import, not just inside gsap.matchMedia, so reduced motion means
  // zero GSAP bytes fetched — see .claude/skills/lightweight-motion/SKILL.md.
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill || prefersReducedMotion()) return;

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
              gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
              gsap.to(fill, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: list,
                  start: "top center",
                  end: "bottom center",
                  scrub: 0.6,
                },
              });
            }, list);
            return () => ctx.revert();
          });
          cleanup = () => mm.revert();
        });
      },
      { rootMargin: "200px" },
    );
    io.observe(list);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

  const activeStage = stages[active];
  const screenshot = byId(activeStage.slot);

  return (
    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-5">
        <div className="sticky top-[calc(var(--nav-h)+3rem)]">
          <DeviceFrame screenshot={screenshot} slot={activeStage.slot} />
          <p className="mt-6 text-sm text-muted-dark">
            Step {activeStage.step} of {stages.length}
            {screenshot.device === "web" && " — operations center web view"}
          </p>
        </div>
      </div>

      <div className="relative col-span-7">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[2px] bg-ink-line"
        >
          <div ref={fillRef} className="h-full w-full origin-top bg-accent" />
        </div>
        <ol ref={listRef} className="flex flex-col gap-24">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="pl-8"
            >
              <span className="text-sm font-semibold text-muted-dark">Step {stage.step}</span>
              <h3
                className={`mt-2 text-[length:var(--text-h3)] transition-colors duration-300 ${
                  i === active ? "text-text-light" : "text-muted-dark"
                }`}
              >
                {stage.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-dark">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
