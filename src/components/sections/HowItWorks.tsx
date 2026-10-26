import { howItWorks } from "@/content/sections";
import { byId } from "@/config/screenshots";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { HowItWorksDesktop } from "./HowItWorksDesktop";

/**
 * How It Works — dark. 5-stage storytelling. Mobile/tablet: stacked steps, each with
 * its own phone, fully readable top-to-bottom with no JS. Desktop: sticky phone that
 * swaps per stage (see HowItWorksDesktop) — no scroll-jacking, no pin.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-ink py-[clamp(5rem,10vw,10rem)] text-text-light"
    >
      <Container>
        <Reveal>
          <Eyebrow className="text-muted-dark">{howItWorks.eyebrow}</Eyebrow>
          <h2 id="how-it-works-heading" className="mt-4 max-w-3xl text-[length:var(--text-h2)] text-text-light">
            {howItWorks.headline}
          </h2>
        </Reveal>

        {/* Mobile / tablet: stacked steps, own phone each */}
        <ol className="mt-16 flex flex-col gap-16 lg:hidden">
          {howItWorks.stages.map((stage) => {
            const screenshot = byId(stage.slot);
            return (
              <li key={stage.id}>
                <Reveal>
                  <span className="text-sm font-semibold text-muted-dark">Step {stage.step}</span>
                  <h3 className="mt-2 text-[length:var(--text-h3)] text-text-light">{stage.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-dark">
                    {stage.description}
                  </p>
                  <div className={screenshot.device === "web" ? "mt-6 max-w-[340px]" : "mt-6 max-w-[220px]"}>
                    <DeviceFrame screenshot={screenshot} slot={stage.slot} />
                    {screenshot.device === "web" && (
                      <p className="mt-2 text-xs text-muted-dark">Operations center web view</p>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* Desktop: sticky phone + active-step highlight */}
        <div className="mt-16 hidden lg:block">
          <HowItWorksDesktop stages={howItWorks.stages} />
        </div>
      </Container>
    </section>
  );
}
