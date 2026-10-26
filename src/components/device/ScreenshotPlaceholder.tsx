import type { Slot } from "@/config/screenshots";

interface ScreenshotPlaceholderProps {
  slot: Slot;
  width: number;
  height: number;
}

/**
 * Honest placeholder for a screenshot slot that has no real image yet. Correct aspect
 * ratio, neutral gradient, no fake UI elements. See
 * .claude/skills/app-screenshot-showcase/SKILL.md ("PhoneFrame component").
 */
export function ScreenshotPlaceholder({ slot, width, height }: ScreenshotPlaceholderProps) {
  return (
    <div
      style={{ aspectRatio: `${width} / ${height}` }}
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-raised to-ink p-6 text-center"
    >
      <p className="text-xs leading-relaxed text-muted-dark">
        Screenshot slot: <span className="font-medium text-text-light">{slot}</span>
        <br />— awaiting real app screen
      </p>
    </div>
  );
}
