import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * Page-width container: max-w-[1440px] with fluid side padding. See
 * .claude/skills/sos-design-system/SKILL.md ("Layout & spacing").
 */
export function Container({ children, as, className = "" }: ContainerProps) {
  const Tag = (as ?? "div") as ElementType;
  const props: ComponentPropsWithoutRef<typeof Tag> = {
    className: `mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)] ${className}`,
  };
  return <Tag {...props}>{children}</Tag>;
}
