import { site } from "@/content/site";
import Link from "next/link";

// Static build-time value — avoids pulling the footer into dynamic rendering just for
// a copyright year. Bump manually (or wire up a build step) when it's worth the cost.
const COPYRIGHT_YEAR = 2026;

const footerNav = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "How to Register", href: "/#register" },
  { label: "FAQs", href: "/#faq" },
  { label: "Book Demo", href: "/book-demo" },
];

/**
 * Footer renders Contact/Privacy/Terms honestly as unavailable until configured —
 * never a dead `href="#"` link. See .claude/skills/sos-content-accuracy/SKILL.md.
 */
export function Footer() {
  return (
    <footer className="bg-ink text-text-light">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)] py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold">{site.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-dark">
              {site.brandStatement.replace(`${site.name} — `, "")}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-dark">
              Explore
            </h2>
            <ul className="mt-4 space-y-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-text-light/90 hover:text-text-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-dark">
              Contact &amp; Legal
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-dark">
              <li>
                Contact:{" "}
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`} className="text-text-light/90 hover:text-text-light">
                    {site.contact.email}
                  </a>
                ) : (
                  <span>Unavailable — not yet configured</span>
                )}
              </li>
              <li>
                Privacy Policy:{" "}
                {site.legal.privacyUrl ? (
                  <a href={site.legal.privacyUrl} className="text-text-light/90 hover:text-text-light">
                    View policy
                  </a>
                ) : (
                  <span>Unavailable — not yet configured</span>
                )}
              </li>
              <li>
                Terms of Service:{" "}
                {site.legal.termsUrl ? (
                  <a href={site.legal.termsUrl} className="text-text-light/90 hover:text-text-light">
                    View terms
                  </a>
                ) : (
                  <span>Unavailable — not yet configured</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 max-w-[70ch] border-t border-ink-line pt-6 text-sm leading-relaxed text-muted-dark">
          {site.disclaimer.full}
        </p>

        <p className="mt-6 text-xs text-muted-dark">
          © {COPYRIGHT_YEAR} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
