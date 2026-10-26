import { finalCta } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Final CTA — dark, emotional, minimal. This page introduces and showcases
 * SOS: COMMUNITY APP; it is not an install funnel, so the closing CTA is purely
 * informational (loops back into the page) rather than a download/store action. See
 * .claude/skills/sos-content-accuracy/SKILL.md ("No download/install CTAs").
 */
export function FinalCta() {
  return (
    <section
      id="discover"
      aria-labelledby="final-cta-heading"
      className="relative overflow-x-clip bg-ink py-[clamp(6rem,12vw,11rem)] text-center text-text-light"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, var(--color-accent) 0%, transparent 70%)",
        }}
      />
      <Container className="relative flex flex-col items-center">
        <Reveal>
          <h2 id="final-cta-heading" className="text-[length:var(--text-h2)] text-text-light">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[length:var(--text-lead)] text-text-light/90">
            {finalCta.support}
          </p>
        </Reveal>

        <Reveal delayMs={80} className="mt-10">
          <Button href={finalCta.cta.href} variant="primary">
            {finalCta.cta.label}
          </Button>
        </Reveal>

        <p className="mt-10 max-w-md text-sm leading-relaxed text-muted-dark">
          {finalCta.disclaimer}
        </p>
      </Container>
    </section>
  );
}
