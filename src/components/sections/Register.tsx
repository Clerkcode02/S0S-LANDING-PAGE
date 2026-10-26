import { registration, enabledRegistrationSteps } from "@/content/registration";
import { byId } from "@/config/screenshots";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { Reveal } from "@/components/motion/Reveal";
import { PhoneFrame } from "@/components/device/PhoneFrame";

/**
 * How to Register — light. Draft-marked step guide (see
 * .claude/skills/sos-content-accuracy/SKILL.md "Registration guide (draft)") with a
 * screenshot slot per step. Informational only — no store/download CTAs (see
 * CLAUDE.md "Scope").
 */
export function Register() {
  return (
    <section
      id="register"
      aria-labelledby="register-heading"
      className="bg-paper py-[clamp(5rem,10vw,10rem)] text-text-dark"
    >
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-light">HOW TO REGISTER</Eyebrow>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h2 id="register-heading" className="text-[length:var(--text-h2)] text-text-dark">
              Getting Started.
            </h2>
            {registration.status === "draft" && <DraftBadge />}
          </div>
          {registration.status === "draft" && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-light">
              {registration.note}
            </p>
          )}
        </Reveal>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {enabledRegistrationSteps.map((step, i) => {
            const screenshot = byId(step.slot);
            return (
              <li key={step.id}>
                <Reveal delayMs={i * 60}>
                  <div className="max-w-[200px]">
                    <PhoneFrame screenshot={screenshot} slot={step.slot} />
                  </div>
                  <span className="mt-6 block text-sm font-semibold text-accent-strong">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-1 text-[length:var(--text-h3)] text-text-dark">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-light">{step.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
