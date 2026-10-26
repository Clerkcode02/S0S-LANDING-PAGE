// Draft registration guide. See `.claude/skills/sos-content-accuracy/SKILL.md`
// ("Registration guide (draft)") — do not list specific fields (name, phone, address,
// etc.) until the user supplies them, and do not state whether verification exists
// beyond this `enabled` flag. Flip `status` to "verified" and remove the draft note
// once the real steps are confirmed.

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
  note: "Registration steps are a general guide and will be updated to match the final app.",
  steps: [
    {
      id: "download",
      title: "Download and open the app",
      body: "Install SOS: COMMUNITY APP and open it to get started.",
      slot: "register-welcome",
    },
    {
      id: "select",
      title: "Select the registration option",
      body: "Choose to create a new account from the welcome screen.",
      slot: "register-form",
    },
    {
      id: "details",
      title: "Complete the required details",
      body: "Enter the information requested by the app.",
      slot: "register-form",
    },
    {
      id: "verify",
      title: "Complete any required verification",
      body: "Follow any verification step the app presents before your account is activated.",
      slot: "register-verify",
      conditional: true,
      enabled: true,
    },
    {
      id: "signin",
      title: "Sign in and explore",
      body: "Sign in with your new account and explore the app's features.",
      slot: "register-home",
    },
  ] satisfies RegistrationStep[],
} as const;

export const enabledRegistrationSteps = registration.steps.filter(
  (step) => !step.conditional || step.enabled,
);
