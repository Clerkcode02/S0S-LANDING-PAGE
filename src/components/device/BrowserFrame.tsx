import Image from "next/image";
import type { Screenshot, Slot } from "@/config/screenshots";
import { ScreenshotPlaceholder } from "./ScreenshotPlaceholder";

interface BrowserFrameProps {
  screenshot: Screenshot;
  slot: Slot;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Pure-CSS browser-window frame — no PNG device mockups, three plain chrome dots (no
 * fake URL bar or fabricated browser UI). Used for the operations center's web-view
 * screens (Assign, Respond), which are not part of the citizen mobile app — see
 * .claude/skills/sos-content-accuracy/SKILL.md "Verified product facts" and
 * .claude/skills/app-screenshot-showcase/SKILL.md "PhoneFrame component" (same
 * placeholder/real-screenshot rules apply here).
 */
export function BrowserFrame({
  screenshot,
  slot,
  priority = false,
  sizes = "(min-width: 1024px) 480px, 90vw",
  className = "",
}: BrowserFrameProps) {
  const showPlaceholder = !screenshot.src || !screenshot.privacyChecked;

  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-card)] bg-ink-raised p-2 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_30px_60px_-20px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="flex items-center gap-1.5 px-2 py-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-line" />
      </div>
      <div className="relative overflow-hidden rounded-[calc(var(--radius-card)-0.3rem)] bg-ink ring-1 ring-inset ring-white/5">
        {showPlaceholder ? (
          <ScreenshotPlaceholder
            slot={slot}
            width={screenshot.width}
            height={screenshot.height}
          />
        ) : (
          <Image
            src={screenshot.src as string}
            alt={screenshot.alt}
            width={screenshot.width}
            height={screenshot.height}
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            loading={priority ? undefined : "lazy"}
            className="h-auto w-full"
          />
        )}
      </div>
    </div>
  );
}
