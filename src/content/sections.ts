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
  secondaryCta: { label: "How CAD Works", href: "#response-system" },
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
  headline: "One Report. One Coordinated Response.",
  intro:
    "Follow an incident from the citizen's first report through review, responder coordination, status updates, and the final response record.",
  steps: [
    {
      id: "citizen-report",
      step: 1,
      shortLabel: "Citizen report",
      title: "A citizen submits an incident report.",
      description:
        "The SOS: COMMUNITY APP captures the incident type, description, location, contact details, and any available supporting photos or videos.",
      details: ["Incident details", "Location information", "Available evidence"],
      image: "/images/response-system/step-01-citizen-report.png",
      alt: "Citizen using a smartphone to submit an incident report with a map location.",
    },
    {
      id: "operator-alert",
      step: 2,
      shortLabel: "Operator alert",
      title: "The operations center receives the alert.",
      description:
        "A new report is highlighted for the operator and remains active until it is opened and acknowledged.",
      details: ["New incident notification", "Persistent alert", "Operator acknowledgement"],
      image: "/images/response-system/step-02-operator-alert.png",
      alt: "Operations dashboard highlighting a newly received incident alert.",
    },
    {
      id: "verification",
      step: 3,
      shortLabel: "Verification",
      title: "The report is reviewed and verified.",
      description:
        "The operator checks the submitted details, location, and evidence, then contacts the reporter or reviews available camera footage when more context is needed.",
      details: ["Report review", "Evidence check", "Additional context"],
      image: "/images/response-system/step-03-report-verification.png",
      alt: "Operator reviewing incident details, a map, and available supporting evidence.",
    },
    {
      id: "assignment",
      step: 4,
      shortLabel: "Assignment",
      title: "The appropriate responder is assigned.",
      description:
        "After review, the operator assigns an appropriate responder or agency based on the incident, location, urgency, and available units.",
      details: ["Incident assessment", "Available units", "Responder handoff"],
      image: "/images/response-system/step-04-responder-assignment.png",
      alt: "Dispatch dashboard assigning a reviewed incident to an available responder.",
    },
    {
      id: "navigation",
      step: 5,
      shortLabel: "Navigation",
      title: "The responder acknowledges and proceeds.",
      description:
        "The assigned responder reviews the incident and location, acknowledges the assignment, and uses available route guidance to proceed.",
      details: ["Assignment received", "Incident location", "Route guidance"],
      image: "/images/response-system/step-05-responder-navigation.png",
      alt: "Responder reviewing an assignment and route to the reported location.",
    },
    {
      id: "monitoring",
      step: 6,
      shortLabel: "Coordination",
      title: "Operators coordinate the active response.",
      description:
        "The operations center monitors the active incident, available responder locations, and connected camera feeds, coordinating additional units when needed.",
      details: ["Active incident map", "Responder updates", "Additional coordination"],
      image: "/images/response-system/step-06-realtime-monitoring.png",
      alt: "Command dashboard with an incident map, responder markers, and monitoring panels.",
    },
    {
      id: "status",
      step: 7,
      shortLabel: "Status updates",
      title: "Every change is reflected in the incident status.",
      description:
        "Authorized operators or responders move the incident through three clear states, with each change recording its time and the person responsible.",
      details: ["Pending", "Ongoing", "Cleared"],
      image: "/images/response-system/step-07-incident-status.png",
      alt: "Incident interface showing the Pending, Ongoing, and Cleared status progression.",
    },
    {
      id: "records",
      step: 8,
      shortLabel: "Incident records",
      title: "The completed response becomes a lasting record.",
      description:
        "After an incident is cleared, its report, evidence, verification notes, assignments, status history, and response records remain organized for reporting and evaluation.",
      details: ["Response timeline", "Supporting records", "Reporting history"],
      image: "/images/response-system/step-08-incident-records.png",
      alt: "Incident history view organizing completed reports, response timelines, and supporting records.",
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
