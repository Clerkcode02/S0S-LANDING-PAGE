"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Activity, CheckCircle2, type LucideIcon } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion/preferences";

interface StatusItem {
  id: string;
  label: string;
  description: string;
}

const ICONS: Record<string, LucideIcon> = {
  pending: Clock,
  ongoing: Activity,
  resolved: CheckCircle2,
};

const COLORS: Record<string, string> = {
  pending: "var(--color-status-pending)",
  ongoing: "var(--color-status-ongoing)",
  resolved: "var(--color-status-resolved)",
};

/**
 * Pending → Ongoing → Resolved, advancing once on reveal, then stopping. Labeled
 * "Illustration" — never looping, never implying live data. Reduced motion (and the
 * no-JS fallback, via the initial state below) shows the final, fully annotated state
 * immediately. See .claude/skills/lightweight-motion/SKILL.md ("Tracking").
 */
export function StatusSequence({
  statuses,
  label,
}: {
  statuses: StatusItem[];
  label: string;
}) {
  const [activeIndex, setActiveIndex] = useState(statuses.length - 1);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            setActiveIndex(0);
            let i = 0;
            const id = setInterval(() => {
              i += 1;
              if (i >= statuses.length) {
                clearInterval(id);
                return;
              }
              setActiveIndex(i);
            }, 650);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [statuses.length]);

  return (
    <div ref={ref}>
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted-dark">
        {label}
      </p>
      <ol className="flex flex-col gap-4">
        {statuses.map((status, i) => {
          const Icon = ICONS[status.id] ?? Clock;
          const isReached = i <= activeIndex;
          return (
            <li
              key={status.id}
              className="flex items-start gap-4 rounded-[var(--radius-card)] border border-ink-line p-4 transition-colors duration-300"
            >
              <span
                style={{ color: isReached ? COLORS[status.id] : "var(--color-muted-dark)" }}
                className="mt-0.5 transition-colors duration-300"
              >
                <Icon aria-hidden="true" size={22} strokeWidth={1.5} />
              </span>
              <div>
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isReached ? "text-text-light" : "text-muted-dark"
                  }`}
                >
                  {status.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-dark">
                  {status.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
