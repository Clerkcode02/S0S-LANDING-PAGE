// Lazy GSAP loader. Never import "gsap" at module scope from a component that's part
// of the initial render tree — always call loadGsap() from inside a client-only effect,
// after confirming the user hasn't requested reduced motion. See
// .claude/skills/lightweight-motion/SKILL.md ("GSAP loading pattern").

let p: Promise<{
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
}> | null = null;

export function loadGsap() {
  return (p ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    },
  ));
}
