import { byId } from "@/config/screenshots";
import { responseSystem } from "@/content/sections";
import { BrowserFrame } from "@/components/device/BrowserFrame";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Operations-center handoff: assignment first, then a coordinated response. */
export function ResponseSystem() {
  return (
    <section
      id="response-system"
      aria-labelledby="response-system-heading"
      className="response-system-section overflow-hidden bg-ink py-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-accent">{responseSystem.eyebrow}</Eyebrow>
          <h2 id="response-system-heading" className="mt-4 text-[length:var(--text-h2)] text-text-light">
            {responseSystem.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted-dark">
            {responseSystem.intro}
          </p>
        </Reveal>

        <div className="response-system-flow relative mx-auto mt-16 max-w-6xl lg:mt-24">
          <Reveal className="response-system-connector">
            <span aria-hidden="true" />
          </Reveal>

          <ol className="relative z-10 space-y-16 lg:space-y-24">
            {responseSystem.steps.map((step, index) => {
              const screenshot = byId(step.slot);

              return (
                <Reveal
                  as="li"
                  key={step.id}
                  delayMs={index * 140}
                  data-label={step.label}
                  className={`response-system-step grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_4rem_minmax(0,0.9fr)] lg:gap-8 ${
                    index % 2 === 1 ? "response-system-step-reverse" : ""
                  }`}
                >
                  <div className="response-system-visual">
                    <BrowserFrame
                      screenshot={screenshot}
                      slot={step.slot}
                      sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 92vw"
                      className="response-system-browser"
                    />
                  </div>

                  <div className="response-system-node" aria-hidden="true">
                    <span>{step.step}</span>
                  </div>

                  <div className="response-system-copy rounded-[var(--radius-card)] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm lg:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                      Step {step.step}
                    </p>
                    <h3 className="mt-3 text-[length:var(--text-h3)] text-text-light">{step.title}</h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-dark">
                      {step.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${step.label} highlights`}>
                      {step.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-medium text-text-light"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
