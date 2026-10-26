import { hero } from "@/content/sections";
import { byId } from "@/config/screenshots";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PhoneStack } from "@/components/device/PhoneStack";
import { TiltOnHover } from "@/components/motion/TiltOnHover";

/**
 * Hero — dark, cinematic. Headline is never animated (see
 * .claude/skills/lightweight-motion/SKILL.md: "Hero headline must be readable
 * immediately"). Phones get a 2.5D entrance + pointer tilt on desktop only.
 */
export function Hero() {
  const primary = byId("hero-primary");
  const secondary = byId("hero-secondary");

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-x-clip bg-ink pt-[clamp(3rem,8vw,6rem)] pb-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 10%, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      <Container className="relative grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow className="text-muted-dark">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[length:var(--text-display)] text-text-light">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-[length:var(--text-lead)] text-text-light/90">
            {hero.sub}
          </p>
          <p className="mt-4 max-w-xl text-[length:var(--text-body)] leading-relaxed text-muted-dark">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={hero.primaryCta.href} variant="primary">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="secondary" showArrow={false}>
              {hero.secondaryCta.label}
            </Button>
          </div>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-dark">
            {hero.disclaimer}
          </p>
        </div>

        <div className="lg:col-span-5">
          <TiltOnHover>
            <PhoneStack
              primary={primary}
              primarySlot="hero-primary"
              secondary={secondary}
              secondarySlot="hero-secondary"
            />
          </TiltOnHover>
        </div>
      </Container>
    </section>
  );
}
