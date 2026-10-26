interface EyebrowProps {
  children: string;
  className?: string;
}

/**
 * Small uppercase label with a short accent rule, used above section headlines.
 * See .claude/skills/sos-design-system/SKILL.md ("Typography" / "Components").
 */
export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-[length:var(--text-eyebrow)] font-medium uppercase tracking-[0.18em] ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-accent" />
      {children}
    </span>
  );
}
