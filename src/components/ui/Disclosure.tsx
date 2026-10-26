import type { ReactNode } from "react";
import { Plus } from "lucide-react";

interface DisclosureProps {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Accessible accordion built on native <details>/<summary> — works without JS, is
 * keyboard-operable by default, and content stays in the DOM (searchable). See
 * .claude/skills/responsive-accessibility/SKILL.md ("FAQ accordions").
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = "",
}: DisclosureProps) {
  return (
    <details
      className={`group border-b border-paper-line py-5 ${className}`}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-text-dark marker:content-none">
        {summary}
        <Plus
          aria-hidden="true"
          size={20}
          strokeWidth={1.5}
          className="shrink-0 text-muted-light transition-transform duration-200 group-open:rotate-45"
        />
      </summary>
      <div className="mt-3 max-w-[70ch] text-[length:var(--text-body)] leading-relaxed text-muted-light">
        {children}
      </div>
    </details>
  );
}
