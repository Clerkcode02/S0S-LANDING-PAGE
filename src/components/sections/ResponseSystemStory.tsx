"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type ResponseStep = {
  readonly id: string;
  readonly step: number;
  readonly shortLabel: string;
  readonly title: string;
  readonly description: string;
  readonly details: readonly string[];
  readonly image: string;
  readonly alt: string;
  readonly imageAvailable: boolean;
};

interface ResponseSystemStoryProps {
  steps: readonly ResponseStep[];
  backgroundImage: string | null;
}

function StepVisual({ step, active }: { step: ResponseStep; active: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="response-story-visual"
      data-loaded={loaded ? "true" : "false"}
      data-active={active ? "true" : "false"}
    >
      <div className="response-story-placeholder" aria-hidden={loaded}>
        <span className="response-story-placeholder-mark">{String(step.step).padStart(2, "0")}</span>
        <div>
          <p>Process image placeholder</p>
          <span>{step.image.split("/").at(-1)}</span>
        </div>
      </div>
      {step.imageAvailable ? (
        <Image
          src={step.image}
          alt={step.alt}
          fill
          unoptimized
          sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 54vw, 100vw"
          className="response-story-image"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      ) : null}
      <span className="response-story-image-label">
        {loaded ? "Response system view" : "Illustrative placeholder"}
      </span>
    </div>
  );
}

export function ResponseSystemStory({ steps, backgroundImage }: ResponseSystemStoryProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!desktop.matches) return;

      const bounds = scene.getBoundingClientRect();
      const scrollable = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / scrollable));
      const nextIndex = Math.min(steps.length - 1, Math.round(progress * (steps.length - 1)));
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    desktop.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktop.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [steps.length]);

  const goToStep = useCallback(
    (index: number) => {
      const scene = sceneRef.current;
      if (!scene) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sceneTop = window.scrollY + scene.getBoundingClientRect().top;
      const scrollable = Math.max(0, scene.offsetHeight - window.innerHeight);
      const target = sceneTop + (scrollable * index) / Math.max(1, steps.length - 1);
      window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
      setActiveIndex(index);
    },
    [steps.length],
  );

  return (
    <div
      ref={sceneRef}
      className="response-story-scene"
      style={{ "--response-step-count": steps.length } as CSSProperties}
    >
      <div className="response-story-sticky">
        <div
          className="response-story-backdrop"
          aria-hidden="true"
          style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : undefined}
        />
        <div className="response-story-grid" aria-hidden="true" />

        <div className="response-story-shell">
          <div className="response-story-steps">
            {steps.map((step, index) => {
              const active = activeIndex === index;
              return (
                <article
                  key={step.id}
                  className="response-story-step"
                  data-active={active ? "true" : "false"}
                >
                  <StepVisual step={step} active={active} />
                  <div className="response-story-copy" data-active={active ? "true" : "false"}>
                    <div className="response-story-step-row">
                      <span className="response-story-step-number">
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <span className="response-story-step-total">/ {String(steps.length).padStart(2, "0")}</span>
                    </div>
                    <p className="response-story-kicker">{step.shortLabel}</p>
                    <h3>{step.title}</h3>
                    <p className="response-story-description">{step.description}</p>
                    <ul aria-label={`${step.title} details`}>
                      {step.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          <nav className="response-story-progress" aria-label="Response workflow steps">
            <div className="response-story-progress-heading">
              <span>Workflow</span>
              <span aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>
            <ol>
              {steps.map((step, index) => (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    aria-label={`Go to step ${step.step}: ${step.shortLabel}`}
                    aria-current={activeIndex === index ? "step" : undefined}
                  >
                    <span>{String(step.step).padStart(2, "0")}</span>
                    <span>{step.shortLabel}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}
