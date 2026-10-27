"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { observeReveal } from "@/lib/motion/reveal-observer";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delayMs?: number;
  className?: string;
  "data-label"?: string;
}

/**
 * Entrance-reveal wrapper. Renders fully visible content by default (so it degrades
 * correctly without JS); once hydrated it adds `data-reveal` and registers with the
 * shared IntersectionObserver so CSS handles the actual transition. See
 * .claude/skills/lightweight-motion/SKILL.md.
 */
export function Reveal({ children, as, delayMs = 0, className, "data-label": dataLabel }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
    return observeReveal(el);
  }, [delayMs]);

  const Tag = (as ?? "div") as ElementType;
  const props: ComponentPropsWithoutRef<typeof Tag> = {
    ref,
    className,
    "data-reveal": "",
    "data-label": dataLabel,
  };

  return <Tag {...props}>{children}</Tag>;
}
