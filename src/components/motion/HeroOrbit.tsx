import type { CSSProperties, ReactNode } from "react";
import { LifeBuoy, Radio, Activity } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Floating depth badges arranged around the hero phone. Server-rendered real text,
 * staggered in on reveal, then drifting on their own slow CSS keyframe loops at
 * different periods so they never move in lockstep.
 *
 * Every string here is drawn from already-verified content (the approved category
 * groups in src/content/categories.ts and the status/coordination copy in
 * src/content/sections.ts) — no response times, user counts, coverage areas, or any
 * other invented fact, per .claude/skills/sos-content-accuracy.
 *
 * The whole cluster is aria-hidden and hidden below 1024px: it restates information
 * that each have their own fully accessible section further down the page, so
 * announcing it again here would only add screen-reader noise.
 */
const BADGES = [
  {
    id: "categories",
    icon: LifeBuoy,
    title: "Emergency Response",
    detail: "Rescue · Police · Fire",
    // position + drift are expressed as CSS custom properties so the keyframes stay
    // shared and only transform is ever animated.
    className: "left-[-14%] top-[12%]",
    style: { "--orbit-dur": "9s", "--orbit-delay": "0s", "--orbit-y": "-10px" },
  },
  {
    id: "operations",
    icon: Radio,
    title: "Operations Center",
    detail: "Review & assignment",
    className: "right-[-16%] top-[38%]",
    style: { "--orbit-dur": "11s", "--orbit-delay": "-3s", "--orbit-y": "9px" },
  },
  {
    id: "status",
    icon: Activity,
    title: "Pending → Ongoing → Cleared",
    detail: "Recorded status updates",
    className: "left-[-8%] bottom-[14%]",
    style: { "--orbit-dur": "10s", "--orbit-delay": "-6s", "--orbit-y": "-8px" },
  },
] as const;

export function HeroOrbit({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {BADGES.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <Reveal
              key={badge.id}
              delayMs={320 + i * 110}
              className={`absolute ${badge.className}`}
            >
              <div
                className="orbit-drift rounded-[var(--radius-card)] border border-white/10 bg-ink-raised/80 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-sm"
                style={badge.style as CSSProperties}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} strokeWidth={1.75} className="shrink-0 text-accent" />
                  <p className="text-xs font-semibold text-text-light">{badge.title}</p>
                </div>
                <p className="mt-1 pl-[1.625rem] text-[0.6875rem] text-muted-dark">
                  {badge.detail}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
