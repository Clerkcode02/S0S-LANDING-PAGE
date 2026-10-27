// One shared IntersectionObserver for every [data-reveal] element on the page, per
// .claude/skills/lightweight-motion/SKILL.md ("Reveal pattern"). Components register
// via `observeReveal(el)` and get unobserved automatically once revealed.
//
// Registrations are held while the intro splash is playing. IntersectionObserver has
// no concept of occlusion, so without this gate every above-the-fold reveal would
// fire behind the opaque overlay and already be finished by the time the visitor can
// see the page. See src/lib/motion/intro.ts.

import { introSettled, onIntroDone } from "./intro";

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
  }
  return observer;
}

const held = new Set<Element>();
let releaseScheduled = false;

export function observeReveal(el: Element): () => void {
  if (!introSettled()) {
    held.add(el);
    if (!releaseScheduled) {
      releaseScheduled = true;
      onIntroDone(() => {
        const obs = getObserver();
        for (const pending of held) obs.observe(pending);
        held.clear();
      });
    }
    return () => held.delete(el);
  }

  const obs = getObserver();
  obs.observe(el);
  return () => obs.unobserve(el);
}
