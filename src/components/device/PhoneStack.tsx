import type { Screenshot, Slot } from "@/config/screenshots";
import { PhoneFrame } from "./PhoneFrame";
import { PhoneShowcase, type ShowcaseScreen } from "./PhoneShowcase";

interface PhoneStackProps {
  /** Screens the dominant front phone cycles through — real screenshots only. */
  screens: ShowcaseScreen[];
  secondary: Screenshot;
  secondarySlot: Slot;
}

/**
 * Dominant front phone + one supporting phone offset behind it, in 2.5D. Two phones
 * max — see .claude/skills/lightweight-motion/SKILL.md ("2.5D depth recipe"). Flat and
 * stacked (no rotation) below 1024px; rotation is applied by the TiltOnHover wrapper
 * via the --rx/--ry custom properties on ≥1024px fine-pointer devices only.
 *
 * The front phone is a PhoneShowcase (stateful auto-cycling screens), so unlike the
 * previous version it is mounted exactly once and the desktop rotation comes from the
 * .hero-phone-tilt media query rather than from a duplicated subtree.
 */
export function PhoneStack({ screens, secondary, secondarySlot }: PhoneStackProps) {
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
        {/* Three nested elements, three independent transforms: tilt (pointer),
          * float (idle keyframes), entrance (GSAP, inside PhoneShowcase). Keeping
          * them separate is what stops them overwriting each other. */}
        <div className="hero-phone-tilt">
          <div className="phone-float">
            <PhoneShowcase screens={screens} />
          </div>
        </div>
      </div>
    </div>
  );
}
