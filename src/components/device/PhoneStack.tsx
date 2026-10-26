import type { Screenshot, Slot } from "@/config/screenshots";
import { PhoneFrame } from "./PhoneFrame";

interface PhoneStackProps {
  primary: Screenshot;
  primarySlot: Slot;
  secondary: Screenshot;
  secondarySlot: Slot;
}

/**
 * Dominant front phone + one supporting phone offset behind it, in 2.5D. Two phones
 * max — see .claude/skills/lightweight-motion/SKILL.md ("2.5D depth recipe"). Flat and
 * stacked (no rotation) below 1024px; rotation is applied by the TiltOnHover wrapper
 * via the --rx/--ry custom properties on ≥1024px fine-pointer devices only.
 */
export function PhoneStack({
  primary,
  primarySlot,
  secondary,
  secondarySlot,
}: PhoneStackProps) {
  return (
    // Secondary phone is absolutely positioned (decorative, offset behind) so it never
    // affects layout sizing. Primary phone stays in normal flow — its rendered height
    // is what gives this container real height at every breakpoint (an all-absolute
    // composition here would collapse to zero height at lg+, since aspect-ratio is
    // turned off there to let the primary phone's own intrinsic size take over).
    <div className="preserve-3d relative mx-auto aspect-[3/4] w-full max-w-[420px] lg:aspect-auto lg:w-[420px]">
      <div className="hero-secondary-phone absolute inset-0 hidden lg:flex lg:items-center lg:justify-center">
        <PhoneFrame
          screenshot={secondary}
          slot={secondarySlot}
          dynamicIsland={false}
          className="w-[240px] opacity-80"
        />
      </div>
      <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:w-[320px]">
        <div
          className="hidden lg:block"
          style={{
            transform:
              "rotateY(var(--ry, -8deg)) rotateX(var(--rx, 6deg)) translate3d(0,0,0)",
          }}
        >
          <PhoneFrame screenshot={primary} slot={primarySlot} priority />
        </div>
        <div className="lg:hidden">
          <PhoneFrame screenshot={primary} slot={primarySlot} priority />
        </div>
      </div>
    </div>
  );
}
