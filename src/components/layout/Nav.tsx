"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Sticky, minimal glass nav bar with an accessible mobile menu. See
 * .claude/skills/responsive-accessibility/SKILL.md ("Navigation") for the
 * focus/Esc/close-on-click rules this implements.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 h-[var(--nav-h)] border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[clamp(1.25rem,4vw,4rem)]">
        <a href="#top" className="text-sm font-semibold tracking-tight text-text-light">
          {site.shortName}
          <span className="text-muted-dark">: COMMUNITY APP</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-text-light/90 transition-colors hover:text-text-light"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={site.exploreCta.href} variant="primary" showArrow={false} className="min-h-10 px-5 text-sm">
            {site.exploreCta.label}
          </Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring-on-accent flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] text-text-light lg:hidden"
        >
          {open ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        role="region"
        aria-label="Mobile navigation"
        hidden={!open}
        className="border-t border-white/10 bg-ink px-[clamp(1.25rem,4vw,4rem)] py-6 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {site.nav.map((item, i) => (
            <li key={item.href}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block min-h-11 py-2.5 text-base font-medium text-text-light"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Button
          href={site.exploreCta.href}
          variant="primary"
          showArrow={false}
          className="mt-4 w-full"
          onClick={() => setOpen(false)}
        >
          {site.exploreCta.label}
        </Button>
      </div>
    </header>
  );
}
