import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Variant = "primary" | "secondary";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
}

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onAccent?: boolean };
type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; onAccent?: boolean };

type ButtonProps = ButtonAsLink | ButtonAsButton;

// hover-lift supplies the shared 3px rise + token easing, and is a no-op under
// prefers-reduced-motion. See .claude/skills/lightweight-motion ("Easing & timing").
const base =
  "group hover-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-6 text-[0.95rem] font-semibold transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-text-light hover:bg-accent-strong",
  secondary:
    "border border-ink-line text-inherit hover:border-accent hover:text-accent-strong",
};

/**
 * Primary/secondary CTA button. See .claude/skills/sos-design-system/SKILL.md
 * ("Components"). Renders an <a> when `href` is given, otherwise a <button>.
 */
export function Button({
  variant = "primary",
  children,
  showArrow = true,
  className = "",
  onAccent,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${
    variant === "primary" || onAccent ? "focus-ring-on-accent" : ""
  } ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowRight
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="transition-transform duration-200 ease-soft group-hover:translate-x-1"
        />
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return href.startsWith("/") ? (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    ) : (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
