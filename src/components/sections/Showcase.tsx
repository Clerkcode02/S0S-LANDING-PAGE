import { showcase } from "@/content/sections";
import { bySlot } from "@/config/screenshots";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ShowcaseDepth } from "@/components/motion/ShowcaseDepth";
import { PhoneFrame } from "@/components/device/PhoneFrame";

// Static depth offsets for the desktop floating arrangement — at most 4 composited
// phones in view per .claude/skills/performance-audit/SKILL.md ("Rendering cost").
const DESKTOP_OFFSETS = [
  "translate-y-6 rotate-[-4deg]",
  "translate-y-0 rotate-[2deg]",
  "translate-y-10 rotate-[-2deg]",
  "translate-y-2 rotate-[3deg]",
];

/**
 * App Showcase — dark, full-bleed. Desktop: floating phones with static depth offsets
 * (gentle reveal, no continuous motion). Mobile/tablet: native horizontal
 * scroll-snap gallery, no 3D. See .claude/skills/lightweight-motion/SKILL.md
 * ("Showcase") and .claude/skills/app-screenshot-showcase/SKILL.md.
 */
export function Showcase() {
  const items = bySlot("showcase").slice(0, 4);

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="overflow-x-clip bg-ink py-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-dark">{showcase.eyebrow}</Eyebrow>
          <h2 id="showcase-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-light">
            {showcase.headline}
          </h2>
          <p className="mt-4 max-w-xl text-[length:var(--text-body)] leading-relaxed text-muted-dark">
            {showcase.body}
          </p>
        </Reveal>

        {/* Desktop: floating phones, static depth + gentle scroll parallax */}
        <ShowcaseDepth className="mt-16 hidden items-end justify-center gap-6 lg:flex">
          {items.map((shot, i) => (
            <Reveal
              key={shot.id}
              delayMs={i * 60}
              className={DESKTOP_OFFSETS[i % DESKTOP_OFFSETS.length]}
            >
              <div data-showcase-phone>
                <PhoneFrame screenshot={shot} slot={shot.slots[0]} sizes="200px" className="w-[220px]" />
              </div>
            </Reveal>
          ))}
        </ShowcaseDepth>

        {/* Mobile / tablet: native horizontal scroll-snap gallery */}
        <div
          role="region"
          aria-label="SOS: COMMUNITY APP screenshot gallery"
          tabIndex={0}
          className="snap-gallery mt-16 flex gap-5 px-1 lg:hidden"
        >
          {items.map((shot) => (
            <div key={shot.id} className="w-[220px] shrink-0 first:ml-4 last:mr-4">
              <PhoneFrame screenshot={shot} slot={shot.slots[0]} sizes="200px" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
