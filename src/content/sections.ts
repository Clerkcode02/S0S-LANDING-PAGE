// Section copy for every part of the page except categories, registration, and FAQ
// (which have their own files). Copy marked "verbatim" below is required word-for-word
// by the brief — do not rephrase it. Everything else must still trace back to
// `.claude/skills/sos-content-accuracy` verified facts.

import { site } from "./site";

export const hero = {
  eyebrow: "COMMUNITY SAFETY, CONNECTED", // verbatim
  headline: "Every Second Matters.", // verbatim, approved — states urgency, not a speed promise
  sub: "Report incidents. Connect with responders. Stay informed.", // verbatim
  description:
    "SOS: COMMUNITY APP helps communities report emergencies and public concerns through a coordinated reporting and response platform.", // verbatim
  primaryCta: { label: "Discover the App", href: "#features" },
  secondaryCta: { label: "How It Works", href: "#how-it-works" },
  disclaimer: site.disclaimer.short,
};

export const about = {
  eyebrow: "ABOUT",
  headline: "A Safer Community Starts With a Report.", // verbatim
  body:
    "SOS: COMMUNITY APP connects citizens, operations centers, and responders in one coordinated flow — from the moment an incident is reported to the moment it's resolved.",
  flow: [
    {
      id: "citizen",
      title: "Citizen",
      description:
        "A community member selects a category, captures the details, and submits a report from the app.",
    },
    {
      id: "operations",
      title: "Operations Center",
      description:
        "Authorized personnel receive the report, review and assess it, and assign it to the appropriate responders.",
    },
    {
      id: "responder",
      title: "Responder",
      description:
        "Responders receive the incident details, location information, and notifications needed to proceed.",
    },
  ],
};

export const responseSystem = {
  eyebrow: "RESPONSE SYSTEM",
  headline: "How Our Response System Works",
  intro: "Two connected steps turn an incoming SOS report into a coordinated response.",
  steps: [
    {
      id: "assign",
      step: 1,
      label: "ASSIGN",
      title: "Match the report with the right responder.",
      description:
        "The operations center reviews the incident alongside available units on the map, then assigns an appropriate responder to the report.",
      highlights: ["Review the report", "See available units", "Assign a responder"],
      slot: "how-assign",
    },
    {
      id: "respond",
      step: 2,
      label: "RESPOND",
      title: "Keep the response moving and visible.",
      description:
        "The assigned responder receives the incident location and proceeds to it, while the operations center follows the response on the shared map.",
      highlights: ["Share the location", "Track the response", "Follow progress"],
      slot: "how-respond",
    },
  ],
} as const;

export type HowItWorksStageId =
  | "open"
  | "report"
  | "confirmation"
  | "track";

export interface HowItWorksStage {
  id: HowItWorksStageId;
  step: number;
  title: string;
  description: string;
  slot: "hero-primary" | "how-report" | "how-review" | "how-resolve";
}

export const howItWorks = {
  eyebrow: "HOW IT WORKS",
  headline: "From Report to Resolution.",
  stages: [
    {
      id: "open",
      step: 1,
      title: "Open the App",
      description:
        "Open the SOS: COMMUNITY APP main screen and choose the report category that best matches the situation.",
      slot: "hero-primary",
    },
    {
      id: "report",
      step: 2,
      title: "Capture & Report",
      description:
        "Capture the incident and submit the available details through the app.",
      slot: "how-report",
    },
    {
      id: "confirmation",
      step: 3,
      title: "Get Confirmation",
      description:
        "After submission, the app confirms that the emergency report was sent and provides access to the user's emergencies.",
      slot: "how-review",
    },
    {
      id: "track",
      step: 4,
      title: "Track Resolution",
      description:
        "Follow recorded status updates and timestamps as the report moves from Pending toward Cleared.",
      slot: "how-resolve",
    },
  ] satisfies HowItWorksStage[],
};

export const showcase = {
  eyebrow: "SEE IT IN ACTION",
  headline: "See SOS in Action.",
  body:
    "A closer look at the reporting and tracking experience, screen by screen, as real app screenshots are added.",
};

export const tracking = {
  eyebrow: "INCIDENT TRACKING",
  headline: "Know Where a Report Stands.",
  body:
    "Each report moves through a clear status so citizens and responders share the same picture of where things stand. Timestamps and updates support transparency and accountability.",
  illustrationLabel: "Illustration — not live data",
  statuses: [
    {
      id: "pending",
      label: "Pending",
      description: "The report has been submitted and is awaiting review.",
    },
    {
      id: "ongoing",
      label: "Ongoing",
      description: "The report has been assigned and a response is in progress.",
    },
    {
      id: "resolved",
      label: "Cleared",
      description: "The incident has been addressed and the report is marked Cleared.",
    },
  ],
};

export const coordination = {
  eyebrow: "RESPONDER COORDINATION",
  headline: "One Coordinated Response.",
  body:
    "Behind every report is a coordinated handoff — from the operations center, through review and assignment, to the responder on site.",
  nodes: [
    { id: "operations", title: "Operations Center", description: "Receives the incoming report." },
    { id: "review", title: "Review", description: "Authorized personnel assess the report." },
    { id: "assignment", title: "Assignment", description: "The report is routed to appropriate responders." },
    { id: "onsite", title: "On-Site", description: "Responders proceed using the details and location info provided." },
  ],
};

export const finalCta = {
  headline: "Stronger Communities. Safer Tomorrows.", // verbatim
  support:
    "Connecting citizens and responders through better emergency reporting and coordination.", // verbatim
  // Informational close, not an install CTA — this page showcases the app, it doesn't
  // distribute it. See sos-content-accuracy "No download/install CTAs".
  cta: { label: "Discover SOS", href: "#features" },
  disclaimer: site.disclaimer.short,
};
