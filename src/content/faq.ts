// FAQ copy. Answers are written from `.claude/skills/sos-content-accuracy/SKILL.md`
// verified facts; anything not yet confirmed uses the shared draft text instead of a
// specific claim. See that skill's "FAQ answers" section before editing.

import { site } from "./site";

export type FaqAnswerStatus = "verified" | "draft";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  status: FaqAnswerStatus;
}

export const faq: FaqItem[] = [
  {
    id: "what-is-sos",
    question: "What is SOS: COMMUNITY APP?",
    answer:
      "SOS: COMMUNITY APP is a community safety and emergency reporting platform that lets citizens submit incidents to the appropriate local authorities and designated operations center.",
    status: "verified",
  },
  {
    id: "how-to-report",
    question: "How do I report an incident?",
    answer:
      "Open the app, select the category that matches the situation, then capture and submit the incident details requested by the app.",
    status: "verified",
  },
  {
    id: "what-happens-after",
    question: "What happens after I submit a report?",
    answer:
      "Your report is received by the designated operations center, where authorized personnel review and assess it before assigning it to appropriate responders.",
    status: "verified",
  },
  {
    id: "track-status",
    question: "Can I track the status of my report?",
    answer:
      "Reports move through clear statuses — Pending, Ongoing, and Resolved — with timestamps and updates that support transparency and accountability.",
    status: "verified",
  },
  {
    id: "replacement-for-hotlines",
    question: "Is SOS: COMMUNITY APP a replacement for emergency hotlines?",
    answer: `No. ${site.disclaimer.full}`,
    status: "verified",
  },
  {
    id: "where-available",
    question: "Where is the app available?",
    answer: site.availability.text,
    status: "draft",
  },
  {
    id: "need-account",
    question: "Do I need to create an account to use the app?",
    answer:
      "Registration steps are a general guide at this stage and will be updated to match the final app — see the How to Register section below.",
    status: "draft",
  },
];
