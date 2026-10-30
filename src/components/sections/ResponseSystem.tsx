import { existsSync } from "node:fs";
import { join } from "node:path";
import { ResponseSystemStory } from "@/components/sections/ResponseSystemStory";
import { responseSystem } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Eight-stage response workflow with a desktop sticky scene and mobile card flow. */
export function ResponseSystem() {
  const steps = responseSystem.steps.map((step) => ({
    ...step,
    imageAvailable: hasPublicAsset(step.image),
  }));
  const backgroundImage = hasPublicAsset(RESPONSE_SYSTEM_BACKGROUND)
    ? RESPONSE_SYSTEM_BACKGROUND
    : null;

  return (
    <section
      id="response-system"
      aria-labelledby="response-system-heading"
      className="response-system-section overflow-clip bg-ink text-text-light"
    >
      <Container className="relative z-10 pb-12 pt-[clamp(5rem,9vw,8rem)] lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="text-accent">{responseSystem.eyebrow}</Eyebrow>
            <h2
              id="response-system-heading"
              className="mt-4 max-w-4xl text-[length:var(--text-h2)] text-text-light"
            >
              {responseSystem.headline}
            </h2>
          </div>
          <p className="max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted-dark lg:col-span-5 lg:pb-2">
            {responseSystem.intro}
          </p>
        </div>
      </Container>

      <ResponseSystemStory steps={steps} backgroundImage={backgroundImage} />
    </section>
  );
}

const RESPONSE_SYSTEM_BACKGROUND = "/images/response-system/response-system.png";

function hasPublicAsset(asset: string) {
  return existsSync(join(process.cwd(), "public", asset.replace(/^\/+/, "")));
}
