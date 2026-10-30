import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { sdgSection } from "@/content/sdgs";

/**
 * Sustainable Development Goals — dark impact chapter using the official SDG
 * artwork supplied in public/images/sdg-icon. Product contributions are limited
 * to the verified reporting, review, coordination, and record-keeping workflow.
 */
export function SustainableDevelopmentGoals() {
  return (
    <section
      id="sustainable-development-goals"
      aria-labelledby="sdg-heading"
      className="overflow-x-clip bg-ink py-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-8">
            <Eyebrow className="text-muted-dark">{sdgSection.eyebrow}</Eyebrow>
            <h2
              id="sdg-heading"
              className="mt-4 max-w-4xl text-[length:var(--text-h2)] text-text-light"
            >
              {sdgSection.headline}
            </h2>
            <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted-dark">
              {sdgSection.intro}
            </p>
          </Reveal>

          <Reveal delayMs={100} className="lg:col-span-4 lg:justify-self-end">
            <div className="max-w-[20rem] overflow-hidden rounded-[var(--radius-card)] border border-ink-line bg-white p-4 sm:p-5">
              <Image
                src={sdgSection.logo}
                alt="United Nations Sustainable Development Goals"
                width={1311}
                height={776}
                sizes="(min-width: 1024px) 320px, 280px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {sdgSection.goals.map((goal, index) => (
            <Reveal
              key={goal.number}
              delayMs={Math.min(index, 4) * 60}
              className="h-full"
            >
              <article className="hover-lift group flex h-full flex-col rounded-[var(--radius-card)] border border-ink-line bg-ink-raised p-5 hover:border-muted-dark sm:p-6">
                <Image
                  src={goal.icon}
                  alt={`United Nations Sustainable Development Goal ${goal.number}: ${goal.title}`}
                  width={1500}
                  height={1500}
                  sizes="112px"
                  className="size-24 rounded-[var(--radius-control)] sm:size-28"
                />

                <div className="mt-6 border-t border-ink-line pt-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                    SDG {goal.number}
                  </p>
                  <h3 className="mt-2 text-xl leading-tight text-text-light sm:text-2xl">
                    {goal.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-dark">
                  {goal.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
