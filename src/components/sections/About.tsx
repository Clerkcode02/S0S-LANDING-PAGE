import { User, Radio, ShieldCheck, ArrowRight } from "lucide-react";
import { about } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

const ICONS = { citizen: User, operations: Radio, responder: ShieldCheck } as const;

/**
 * About — light. Citizen → operations center → responder as a clean 3-node visual.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="bg-paper py-[clamp(5rem,10vw,10rem)] text-text-dark">
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-light">{about.eyebrow}</Eyebrow>
          <h2 id="about-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-dark">
            {about.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted-light">
            {about.body}
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-4">
          {about.flow.map((node, i) => {
            const Icon = ICONS[node.id as keyof typeof ICONS];
            return (
              <div key={node.id} className="flex flex-1 items-center gap-4 lg:gap-6">
                <Reveal delayMs={i * 80} className="flex-1">
                  <div className="hover-lift h-full rounded-[var(--radius-card)] border border-paper-line p-6 hover:border-accent/40">
                    <Icon aria-hidden="true" size={28} strokeWidth={1.5} className="text-accent-strong" />
                    <h3 className="mt-4 text-[length:var(--text-h3)] text-text-dark">{node.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-light">{node.description}</p>
                  </div>
                </Reveal>
                {i < about.flow.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    size={24}
                    strokeWidth={1.5}
                    className="hidden shrink-0 text-muted-light lg:block"
                  />
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
