import type { Screenshot, Slot } from "@/config/screenshots";
import { PhoneFrame } from "./PhoneFrame";
import { BrowserFrame } from "./BrowserFrame";

interface DeviceFrameProps {
  screenshot: Screenshot;
  slot: Slot;
  priority?: boolean;
  className?: string;
}

/**
 * Picks PhoneFrame or BrowserFrame based on `screenshot.device` — so call sites that
 * render a stage/slot generically (How It Works, Showcase) don't need to know which
 * screens are mobile-app vs operations-center-web. See src/config/screenshots.ts.
 */
export function DeviceFrame({ screenshot, slot, priority, className }: DeviceFrameProps) {
  if (screenshot.device === "web") {
    return (
      <BrowserFrame screenshot={screenshot} slot={slot} priority={priority} className={className} />
    );
  }
  return <PhoneFrame screenshot={screenshot} slot={slot} priority={priority} className={className} />;
}
