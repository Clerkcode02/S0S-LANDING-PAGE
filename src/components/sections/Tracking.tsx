import { tracking } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { StatusSequence } from "@/components/motion/StatusSequence";

/**
 * Incident Tracking — dark. Illustration only, never presented as live data. See
 * .claude/skills/sos-content-accuracy/SKILL.md ("Illustrative components must say
 * 'Illustration'...") and .claude/skills/responsive-accessibility/SKILL.md
 * ("Status ... always has text label + icon, not color only").
 */
export function Tracking() {
  return (
    <section
      id="tracking"
      aria-labelledby="tracking-heading"
      className="bg-ink py-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-dark">{tracking.eyebrow}</Eyebrow>
          <h2 id="tracking-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-light">
            {tracking.headline}
          </h2>
          <p className="mt-4 max-w-xl text-[length:var(--text-body)] leading-relaxed text-muted-dark">
            {tracking.body}
          </p>
        </Reveal>

        <div className="mt-16 max-w-2xl">
          <StatusSequence statuses={tracking.statuses} label={tracking.illustrationLabel} />
        </div>
      </Container>
    </section>
  );
}
