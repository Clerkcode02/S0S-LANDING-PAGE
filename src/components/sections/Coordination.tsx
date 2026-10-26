import { Radio, Search, UserCheck, MapPin } from "lucide-react";
import { coordination } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

const ICONS = {
  operations: Radio,
  review: Search,
  assignment: UserCheck,
  onsite: MapPin,
} as const;

/**
 * Responder Coordination — light. Operations center → review → assignment → on-site,
 * with a simple SVG connector that draws in once on reveal (CSS only). See
 * .claude/skills/lightweight-motion/SKILL.md ("Coordination").
 */
export function Coordination() {
  const nodeCount = coordination.nodes.length;

  return (
    <section
      id="coordination"
      aria-labelledby="coordination-heading"
      className="bg-paper py-[clamp(5rem,10vw,10rem)] text-text-dark"
    >
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-light">{coordination.eyebrow}</Eyebrow>
          <h2 id="coordination-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-dark">
            {coordination.headline}
          </h2>
          <p className="mt-4 max-w-xl text-[length:var(--text-body)] leading-relaxed text-muted-light">
            {coordination.body}
          </p>
        </Reveal>

        <Reveal as="div" className="relative mt-20 hidden lg:block">
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 2"
            preserveAspectRatio="none"
            className="absolute left-0 top-9 h-[2px] w-full text-accent"
          >
            <path
              className="connector-path"
              d="M0,1 L1200,1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <div className="relative grid grid-cols-4 gap-6">
            {coordination.nodes.map((node) => {
              const Icon = ICONS[node.id as keyof typeof ICONS];
              return (
                <div key={node.id} className="flex flex-col items-start">
                  <span className="flex size-16 items-center justify-center rounded-full border border-paper-line bg-paper">
                    <Icon aria-hidden="true" size={28} strokeWidth={1.5} className="text-accent-strong" />
                  </span>
                  <h3 className="mt-5 text-[length:var(--text-h3)] text-text-dark">{node.title}</h3>
                  <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-muted-light">
                    {node.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Mobile / tablet: stacked, vertical connector */}
        <div className="relative mt-16 flex flex-col gap-10 lg:hidden">
          <Reveal as="div" className="absolute left-9 top-2 h-[calc(100%-1rem)] w-[2px]">
            <svg
              aria-hidden="true"
              viewBox="0 0 2 600"
              preserveAspectRatio="none"
              className="h-full w-full text-accent"
            >
              <path
                className="connector-path"
                d="M1,0 L1,600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </Reveal>
          {coordination.nodes.map((node, i) => {
            const Icon = ICONS[node.id as keyof typeof ICONS];
            return (
              <Reveal key={node.id} delayMs={i * 60} className="relative flex items-start gap-5 pl-0">
                <span className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full border border-paper-line bg-paper">
                  <Icon aria-hidden="true" size={26} strokeWidth={1.5} className="text-accent-strong" />
                </span>
                <div className="pt-3">
                  <h3 className="text-[length:var(--text-h3)] text-text-dark">{node.title}</h3>
                  <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-muted-light">
                    {node.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="sr-only">{nodeCount} coordination stages shown above.</p>
      </Container>
    </section>
  );
}
