import { faq } from "@/content/faq";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Disclosure } from "@/components/ui/Disclosure";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { Reveal } from "@/components/motion/Reveal";

/**
 * FAQ — light. 7 accessible accordions built on native <details>. See
 * .claude/skills/responsive-accessibility/SKILL.md ("FAQ accordions").
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-paper py-[clamp(5rem,10vw,10rem)] text-text-dark">
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-light">FAQ</Eyebrow>
          <h2 id="faq-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-dark">
            Frequently Asked Questions.
          </h2>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {faq.map((item) => (
            <Disclosure
              key={item.id}
              summary={
                <span className="flex items-center gap-3">
                  {item.question}
                  {item.status === "draft" && <DraftBadge className="shrink-0" />}
                </span>
              }
            >
              {item.answer}
            </Disclosure>
          ))}
        </div>
      </Container>
    </section>
  );
}
