import type { CSSProperties } from "react";
import { hero, howItWorks } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { TiltOnHover } from "@/components/motion/TiltOnHover";
import { HeroWorkflowCycle } from "@/components/motion/HeroWorkflowCycle";
import { HeroScrollMotion } from "@/components/motion/HeroScrollMotion";
import { HeroSystemShowcase } from "@/components/sections/HeroSystemShowcase";

/**
 * Hero — dark, cinematic. The headline stays readable immediately while the
 * linked mobile and response-system planes use layered 2.5D motion.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="hero-section relative overflow-x-clip bg-ink pt-[clamp(3rem,8vw,6rem)] pb-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <div aria-hidden="true" className="hero-response-background" />
      <div
        aria-hidden="true"
        data-hero-glow
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18]"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 10%, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      {/* Ambient accents. Kept off [data-hero-glow] so the GSAP scrub tween above and
        * these CSS keyframe loops never contend for the same transform. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <span
          className="hero-blob left-[-10%] top-[-14%] h-[42vw] w-[42vw] max-h-[34rem] max-w-[34rem] bg-accent/12"
          style={{ "--blob-dur": "22s", "--blob-x": "6%", "--blob-y": "4%" } as CSSProperties}
        />
        <span
          className="hero-blob right-[-6%] bottom-[-18%] h-[34vw] w-[34vw] max-h-[28rem] max-w-[28rem] bg-white/5"
          style={
            { "--blob-dur": "18s", "--blob-delay": "-7s", "--blob-x": "-5%", "--blob-y": "-6%" } as CSSProperties
          }
        />
      </div>

      <HeroScrollMotion>
      <Container className="relative z-10 grid items-center gap-16 lg:grid-cols-12">
        <div data-hero-copy className="relative lg:-top-16 lg:col-span-7">
          <Eyebrow className="text-muted-dark">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-[12ch] text-[length:var(--text-hero)] text-text-light">
            <span className="block">Every Second</span>
            <span className="hero-gradient-text block">Matters.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[length:var(--text-lead)] text-text-light/90">
            {hero.sub}
          </p>
          <p className="mt-4 max-w-xl text-[length:var(--text-body)] leading-relaxed text-muted-dark">
            {hero.description}
          </p>

          <HeroWorkflowCycle
            stages={howItWorks.stages.map((s) => ({ id: s.id, title: s.title }))}
          />

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

        <div data-hero-visual className="lg:col-span-5 will-change-transform">
          <TiltOnHover>
            <HeroSystemShowcase />
          </TiltOnHover>
        </div>
      </Container>
      </HeroScrollMotion>
    </section>
  );
}
