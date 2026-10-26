// One shared IntersectionObserver for every [data-reveal] element on the page, per
// .claude/skills/lightweight-motion/SKILL.md ("Reveal pattern"). Components register
// via `observeReveal(el)` and get unobserved automatically once revealed.

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

export function observeReveal(el: Element): () => void {
  const obs = getObserver();
  obs.observe(el);
  return () => obs.unobserve(el);
}
