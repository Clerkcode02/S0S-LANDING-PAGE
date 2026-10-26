/**
 * Marks unconfirmed content honestly. See
 * .claude/skills/sos-content-accuracy/SKILL.md — draft content must never be
 * presented as verified, badge or no badge; the wording itself stays honest.
 */
export function DraftBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[color:var(--color-status-pending)] px-3 py-1 text-xs font-semibold text-[color:var(--color-status-pending)] ${className}`}
    >
      Draft — pending confirmation
    </span>
  );
}
