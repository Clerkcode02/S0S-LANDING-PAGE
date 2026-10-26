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

export type HowItWorksStageId =
  | "report"
  | "review"
  | "assign"
  | "respond"
  | "resolve";

export interface HowItWorksStage {
  id: HowItWorksStageId;
  step: number;
  title: string;
  description: string;
  slot: "how-report" | "how-review" | "how-assign" | "how-respond" | "how-resolve";
}

export const howItWorks = {
  eyebrow: "HOW IT WORKS",
  headline: "From Report to Resolution.",
  stages: [
    {
      id: "report",
      step: 1,
      title: "Report",
      description:
        "A citizen opens the app, selects the relevant category, and captures and submits the incident details.",
      slot: "how-report",
    },
    {
      id: "review",
      step: 2,
      title: "Review",
      description:
        "The designated operations center receives the report, and authorized personnel review and assess it.",
      slot: "how-review",
    },
    {
      id: "assign",
      step: 3,
      title: "Assign",
      description:
        "Through the operations center's web view, the report is assigned to the appropriate responders based on personnel's assessment.",
      slot: "how-assign",
    },
    {
      id: "respond",
      step: 4,
      title: "Respond",
      description:
        "The operations center's web view provides responders with incident details, location information, and route guidance to proceed.",
      slot: "how-respond",
    },
    {
      id: "resolve",
      step: 5,
      title: "Resolve",
      description:
        "Status updates and timestamps are recorded as the incident moves toward resolution, supporting transparency and accountability.",
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
      label: "Resolved",
      description: "The incident has been addressed and the report is closed.",
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
