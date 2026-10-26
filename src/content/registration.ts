// Registration guide. Steps 1–4 are confirmed from real app screenshots (2026-10-26
// intake batch — see docs/assets-guide.md intake log). Still `status: "draft"`: the
// remaining fields in the multi-step pre-registration form (beyond the name step) and
// the exact verification mechanism haven't been shown yet, so this isn't the complete
// picture. See `.claude/skills/sos-content-accuracy/SKILL.md` ("Registration guide").

export type RegistrationStatus = "draft" | "verified";

export interface RegistrationStep {
  id: string;
  title: string;
  body: string;
  slot: "register-welcome" | "register-form" | "register-verify" | "register-home";
  conditional?: boolean;
  enabled?: boolean;
}

export const registration = {
  status: "draft" as RegistrationStatus,
  note:
    "These steps are confirmed from the app's actual screens, but the full pre-registration form and verification process aren't shown yet — this guide will be completed as more of the flow is confirmed.",
  steps: [
    {
      id: "signin",
      title: "Open the app",
      body: "Sign in with your phone number, or choose to create a new account.",
      slot: "register-home",
    },
    {
      id: "terms",
      title: "Review and accept the Terms & Conditions",
      body: "Read the terms and privacy policy, then accept to continue.",
      slot: "register-welcome",
    },
    {
      id: "details",
      title: "Complete pre-registration",
      body: "Enter your first name, middle name, and last name (plus a suffix if applicable) as the first step of a short multi-step form.",
      slot: "register-form",
    },
    {
      id: "verify",
      title: "Reach full verification",
      body: "Accounts progress through verification levels — Basic Level, Registered, and Fully Verified — shown on your profile.",
      slot: "register-verify",
      conditional: true,
      enabled: true,
    },
  ] satisfies RegistrationStep[],
} as const;

export const enabledRegistrationSteps = registration.steps.filter(
  (step) => !step.conditional || step.enabled,
);
