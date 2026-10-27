import { categoryGroups, categoryIconComponents } from "@/content/categories";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Reporting Categories — light. 6 approved groups, responsive grid, lucide icons.
 * Exact list/grouping/descriptions come from
 * .claude/skills/sos-content-accuracy/SKILL.md — do not edit copy here.
 */
export function Categories() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-paper py-[clamp(5rem,10vw,10rem)] text-text-dark"
    >
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-light">REPORTING CATEGORIES</Eyebrow>
          <h2 id="features-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-dark">
            Report What Matters, Sorted Clearly.
          </h2>
        </Reveal>

        <div className="mt-16 grid items-start gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {categoryGroups.map((group, gi) => (
            <Reveal
              key={group.id}
              delayMs={Math.min(gi, 4) * 60}
              className="grid row-span-3 grid-rows-subgrid gap-y-0"
            >
              <h3 className="text-[length:var(--text-h3)] text-text-dark">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-light">{group.description}</p>
              <ul className="mt-6 grid auto-rows-fr gap-4">
                {group.items.map((item) => {
                  const Icon = categoryIconComponents[item.icon];
                  return (
                    <li
                      key={item.id}
                      className="hover-lift flex h-full items-start gap-3 rounded-[var(--radius-card)] border border-paper-line p-4 hover:border-accent"
                    >
                      <Icon aria-hidden="true" size={24} strokeWidth={1.5} className="mt-0.5 shrink-0 text-accent-strong" />
                      <div>
                        <p className="text-sm font-semibold text-text-dark">{item.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-light">{item.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
