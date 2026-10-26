import Image from "next/image";
import type { Screenshot, Slot } from "@/config/screenshots";
import { ScreenshotPlaceholder } from "./ScreenshotPlaceholder";

interface PhoneFrameProps {
  screenshot: Screenshot;
  slot: Slot;
  priority?: boolean;
  sizes?: string;
  dynamicIsland?: boolean;
  className?: string;
}

/**
 * Pure-CSS phone frame — no PNG device mockups. Renders a real screenshot via
 * next/image when available, otherwise an honest ScreenshotPlaceholder at the same
 * aspect ratio. See .claude/skills/app-screenshot-showcase/SKILL.md ("PhoneFrame
 * component").
 */
export function PhoneFrame({
  screenshot,
  slot,
  priority = false,
  sizes = "(min-width: 1024px) 320px, 70vw",
  dynamicIsland = true,
  className = "",
}: PhoneFrameProps) {
  const showPlaceholder = !screenshot.src || !screenshot.privacyChecked;

  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-phone)] bg-ink-raised p-2.5 shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_30px_60px_-20px_rgba(0,0,0,0.55)] ${className}`}
    >
      {dynamicIsland && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-4 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink"
        />
      )}
      <div className="relative overflow-hidden rounded-[calc(var(--radius-phone)-0.6rem)] bg-ink ring-1 ring-inset ring-white/5">
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
