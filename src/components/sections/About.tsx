import { ArrowDown, Radio, ShieldCheck, User } from "lucide-react";
import { about } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

const ICONS = { citizen: User, operations: Radio, responder: ShieldCheck } as const;

/**
 * About — light editorial introduction paired with a single, unified workflow
 * diagram. The diagram keeps the complete supporting copy in the reading order.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="overflow-x-clip bg-paper py-[clamp(5rem,10vw,10rem)] text-text-dark"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
          <Reveal className="lg:col-span-5 lg:pt-6">
            <Eyebrow className="text-muted-light">{about.eyebrow}</Eyebrow>
            <h2
              id="about-heading"
              className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-dark"
            >
              {about.headline}
            </h2>
            <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-muted-light">
              {about.body}
            </p>
          </Reveal>

          <Reveal delayMs={100} className="lg:col-span-7">
            <figure className="relative isolate overflow-hidden rounded-[var(--radius-card)] border border-ink-line bg-ink px-5 py-6 text-text-light sm:px-8 sm:py-8 xl:px-10 xl:py-10">
              <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 size-52 rounded-full border border-ink-line sm:size-64" />
              <div aria-hidden="true" className="absolute -right-7 -top-7 -z-10 size-32 rounded-full border border-accent/25 sm:size-40" />

              <div className="flex items-center justify-between gap-4 border-b border-ink-line pb-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-dark uppercase">
                  One coordinated flow
                </p>
                <span aria-hidden="true" className="flex items-center gap-1.5">
                  {about.flow.map((node, index) => (
                    <span
                      key={node.id}
                      className={`block rounded-full ${index === 1 ? "h-1.5 w-7 bg-accent" : "size-1.5 bg-muted-dark"}`}
                    />
                  ))}
                </span>
              </div>

              <ol className="relative mt-1">
                {about.flow.map((node, index) => {
                  const Icon = ICONS[node.id as keyof typeof ICONS];
                  const isLast = index === about.flow.length - 1;

                  return (
                    <li
                      key={node.id}
                      className={`relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6 sm:py-8 ${
                        isLast ? "" : "border-b border-ink-line"
                      }`}
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        {!isLast && (
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-8 left-1/2 top-14 -z-10 w-px bg-ink-line sm:top-16"
                          />
                        )}
                        <span className="flex size-14 items-center justify-center rounded-full border border-accent/35 bg-ink-raised text-accent sm:size-16">
                          <Icon aria-hidden="true" size={28} strokeWidth={1.5} />
                        </span>
                        {!isLast && (
                          <span className="absolute -bottom-10 flex size-6 items-center justify-center rounded-full border border-ink-line bg-ink text-muted-dark">
                            <ArrowDown aria-hidden="true" size={13} strokeWidth={1.5} />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-xs tracking-[0.14em] text-accent">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-[length:var(--text-h3)] text-text-light">
                            {node.title}
                          </h3>
                        </div>
                        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-dark sm:text-base">
                          {node.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <figcaption className="sr-only">
                Citizen to operations center to responder workflow.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
