// Site-wide, non-section-specific content: identity, navigation, SEO metadata, and
// every fact that is still unconfirmed. See `.claude/skills/sos-content-accuracy` for
// the rules behind every field here — especially which ones must stay `null`/"draft"
// until the user supplies a real value.

export type DraftStatus = "draft" | "verified";

export interface NavItem {
  label: string;
  href: string; // in-page anchor, matches a section `id`
}

export const site = {
  name: "SOS: COMMUNITY APP",
  shortName: "SOS",
  brandStatement:
    "SOS: COMMUNITY APP — Connecting communities to faster, more coordinated emergency response.",

  nav: [
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "How to Register", href: "#register" },
    { label: "FAQs", href: "#faq" },
  ] satisfies NavItem[],

  // This page introduces and showcases SOS: COMMUNITY APP — it is not an install
  // funnel. No "Download App" / store CTAs anywhere; the nav CTA is informational.
  // See CLAUDE.md "Scope" and sos-content-accuracy "No download/install CTAs".
  exploreCta: { label: "Explore the Features", href: "#features" } satisfies NavItem,

  // Unconfirmed — footer must render these honestly as unavailable, never a dead link.
  contact: {
    email: null as string | null,
    status: "draft" as DraftStatus,
  },
  legal: {
    privacyUrl: null as string | null,
    termsUrl: null as string | null,
  },

  // Coverage/availability is unconfirmed. Keep this as the single source of the
  // placeholder wording so FAQ and the register section stay consistent.
  availability: {
    status: "draft" as DraftStatus,
    text: "Availability details will be announced by the program administrators.",
  },

  // Approved disclaimer copy — do not reword. Short form goes under hero/final CTAs;
  // full form goes in the footer and FAQ.
  disclaimer: {
    short:
      "For immediate, life-threatening emergencies, call your local emergency hotline.",
    full:
      "For immediate, life-threatening emergencies, call your local emergency hotline. SOS: COMMUNITY APP supports community reporting and coordination and is not a guaranteed substitute for established emergency services.",
  },

  seo: {
    title: "SOS: COMMUNITY APP — Connecting Communities to Faster, Coordinated Response",
    description:
      "SOS: COMMUNITY APP helps communities report emergencies and public concerns through a coordinated reporting and response platform.",
    ogImage: "/brand/og-image.jpg", // generated from assets/brand-raw/og-image.png if supplied
  },
} as const;
