"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion/preferences";

interface Stage {
  id: string;
  title: string;
}

/**
 * Hero accent: the full Report → Resolve chain is always rendered as real text (no
 * content appears only via animation — see
 * .claude/skills/responsive-accessibility/SKILL.md "Motion"); JS only adds a
 * continuously cycling highlight across the stages, every ~1.8s. Deliberate exception
 * to "prefer one-shot over continuous" in lightweight-motion — requested by the user
 * as a lightweight CSS/JS stand-in for a reference 3D hero animation (see
 * docs/animation-spec.md "Hero"). Reduced motion: no interval runs, first stage stays
 * highlighted.
 */
export function HeroWorkflowCycle({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % stages.length);
    }, 1800);
    return () => clearInterval(id);
  }, [stages.length]);

  return (
    <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-dark">
      {stages.map((stage, i) => (
        <span key={stage.id} className="inline-flex items-center gap-2">
          <span
            className={`transition-colors duration-500 ${
              i === active ? "font-semibold text-accent" : ""
            }`}
          >
            {stage.title}
          </span>
          {i < stages.length - 1 && (
            <ArrowRight aria-hidden="true" size={12} strokeWidth={1.75} className="text-muted-dark/50" />
          )}
        </span>
      ))}
    </p>
  );
}
