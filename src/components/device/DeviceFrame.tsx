import type { Screenshot, Slot } from "@/config/screenshots";
import { PhoneFrame } from "./PhoneFrame";
import { BrowserFrame } from "./BrowserFrame";

interface DeviceFrameProps {
  screenshot: Screenshot;
  slot: Slot;
  priority?: boolean;
  /** Real rendered width of the image box, so the optimizer picks a right-sized
   *  variant. Worth declaring: several slots render the same screenshot at
   *  different widths, and mismatched `sizes` makes them fetch different variants
   *  of the same file instead of sharing one. */
  sizes?: string;
  className?: string;
}

/**
 * Picks PhoneFrame or BrowserFrame based on `screenshot.device` — so call sites that
 * render a stage/slot generically (How It Works, Showcase) don't need to know which
 * screens are mobile-app vs operations-center-web. See src/config/screenshots.ts.
 */
export function DeviceFrame({ screenshot, slot, priority, sizes, className }: DeviceFrameProps) {
  if (screenshot.device === "web") {
    return (
      <BrowserFrame screenshot={screenshot} slot={slot} priority={priority} sizes={sizes} className={className} />
    );
  }
  return <PhoneFrame screenshot={screenshot} slot={slot} priority={priority} sizes={sizes} className={className} />;
}
