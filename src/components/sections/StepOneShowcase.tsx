"use client";

import { useEffect, useRef, useState } from "react";
import { howItWorks } from "@/content/sections";
import { byId } from "@/config/screenshots";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { loadGsap } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/preferences";

/**
 * Natural page scroll drives this sticky perspective rail sideways through
 * all four stages from Report to Resolve, starting front-and-center on Step 1/4.
 */
export function StepOneShowcase() {
  const stages = howItWorks.stages;
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || prefersReducedMotion()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];
        const render = (progress: number) => {
          const journey = progress * (stages.length - 1);
          const cardGap = Math.min(380, window.innerWidth * 0.22);
          const nextActive = Math.round(journey);
          setActive((current) => (current === nextActive ? current : nextActive));

          cards.forEach((card, index) => {
            // Wrap the rail like a carousel so the first step still has screens on
            // both sides. This removes the empty left half at the start of the scene.
            let distance = index - journey;
            const half = stages.length / 2;
            if (distance >= half) distance -= stages.length;
            if (distance < -half) distance += stages.length;
            const absoluteDistance = Math.abs(distance);
            gsap.set(card, {
              xPercent: -50,
              x: distance * cardGap,
              z: -Math.min(absoluteDistance * 135, 340),
              rotateY: Math.max(-36, Math.min(36, distance * -13)),
              rotateZ: distance * 0.8,
              scale: Math.max(0.72, 1 - absoluteDistance * 0.1),
              opacity: Math.max(0.32, 1 - absoluteDistance * 0.22),
              zIndex: 20 - Math.round(absoluteDistance),
            });
          });
          if (progressRef.current) {
            gsap.set(progressRef.current, { scaleX: progress });
          }
        };

        render(0);
        const scrollTween = gsap.to({}, {
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            onUpdate: (self) => render(self.progress),
          },
        });
        cleanup = () => {
          scrollTween.kill();
          ctx.revert();
        };
      }, scene);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [stages.length]);

  const activeStage = stages[active];

  return (
    <section
      id="how-it-works"
      aria-label="How SOS works"
      className="bg-ink text-text-light"
    >
      {/* Mobile / tablet: stacked steps, own phone each (no pinning on small screens) */}
      <div className="py-[clamp(4rem,8vw,7rem)] lg:hidden">
        <Container>
          <ol className="flex flex-col gap-16">
            {stages.map((stage) => {
              const screenshot = byId(stage.slot);
              return (
                <li key={stage.id}>
                  <Reveal>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Step {stage.step} / {stages.length}
                    </span>
                    <h3 className="mt-2 text-[length:var(--text-h3)] text-text-light">
                      {stage.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-dark">
                      {stage.description}
                    </p>
                    <div
                      className={
                        screenshot.device === "web"
                          ? "mt-6 max-w-[340px]"
                          : "mt-6 max-w-[240px]"
                      }
                    >
                      <DeviceFrame
                        screenshot={screenshot}
                        slot={stage.slot}
                        sizes={screenshot.device === "web" ? "320px" : "220px"}
                      />
                      {screenshot.device === "web" && (
                        <p className="mt-2 text-xs text-muted-dark">
                          Operations center web view
                        </p>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Container>
      </div>

      {/* Desktop: scroll-driven 3D perspective gallery moving sideways */}
      <div ref={sceneRef} className="how-works-scene hidden lg:block">
        <div className="how-works-sticky">
          <div className="how-works-copy">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Step {activeStage.step} / {stages.length}
            </p>
            <h3 className="mt-2 text-[length:var(--text-h3)] text-text-light">
              {activeStage.title}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-dark">
              {activeStage.description}
            </p>
          </div>

          <ol className="how-works-rail" aria-label="How SOS works">
            {stages.map((stage, index) => {
              const screenshot = byId(stage.slot);
              return (
                <li
                  key={stage.id}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={`how-works-card ${
                    index === active ? "is-active" : ""
                  }`}
                  aria-current={index === active ? "step" : undefined}
                >
                  <div className="how-works-card-label">
                    <span>0{stage.step}</span>
                    <span>{stage.title}</span>
                  </div>
                  <div className="w-[48%]">
                    <DeviceFrame screenshot={screenshot} slot={stage.slot} />
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="absolute bottom-[5%] left-1/2 z-30 w-[min(36rem,60vw)] -translate-x-1/2">
            <div className="h-px bg-white/15">
              <div
                ref={progressRef}
                className="h-full origin-left scale-x-0 bg-accent"
              />
            </div>
            <div className="mt-3 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-dark">
              <span>Open App</span>
              <span>Scroll to move</span>
              <span>Track</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
