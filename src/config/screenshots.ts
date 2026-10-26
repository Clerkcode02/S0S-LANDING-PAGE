// Single source of truth for every screenshot slot on the page. See
// `.claude/skills/app-screenshot-showcase/SKILL.md` for the schema, naming, intake
// workflow, and placement mapping. Every entry starts as a placeholder (`src: null`)
// until `npm run optimize:screenshots` produces real files and this file is updated
// with the printed manifest stub.

export type ScreenPurpose =
  | "welcome"
  | "register"
  | "verify"
  | "login"
  | "home"
  | "category"
  | "report-form"
  | "capture"
  | "submitted"
  | "status"
  | "notifications"
  | "responder"
  | "map"
  | "other";

export type Slot =
  | "hero-primary"
  | "hero-secondary"
  | "how-report"
  | "how-review"
  | "how-assign"
  | "how-respond"
  | "how-resolve"
  | "showcase"
  | "register-welcome"
  | "register-form"
  | "register-verify"
  | "register-home"
  | "tracking";

// Assign and Respond happen in the operations center's web view, not the citizen
// mobile app — confirmed by the user. Those two slots render in a BrowserFrame
// (landscape) instead of a PhoneFrame (portrait); everything else is the mobile app.
// See .claude/skills/sos-content-accuracy/SKILL.md "Verified product facts".
export type Device = "mobile" | "web";

export interface Screenshot {
  id: string; // e.g. "03-report-form"
  src: string | null; // "/screenshots/03-report-form.webp"; null = placeholder
  width: number;
  height: number; // intrinsic px of the optimized file
  alt: string; // factual description, never a marketing claim
  purpose: ScreenPurpose;
  slots: Slot[];
  device: Device;
  caption?: string;
  privacyChecked: boolean; // must be true before `src` is non-null in production
}

// Default placeholder ratios until real screenshot dimensions are known.
const MOBILE_PLACEHOLDER = { width: 1179, height: 2556 }; // ~9:19.5
const WEB_PLACEHOLDER = { width: 1600, height: 1000 }; // ~16:10

function mobilePlaceholder(
  id: string,
  purpose: ScreenPurpose,
  slots: Slot[],
  alt: string,
): Screenshot {
  return { id, src: null, ...MOBILE_PLACEHOLDER, alt, purpose, slots, device: "mobile", privacyChecked: false };
}

function webPlaceholder(
  id: string,
  purpose: ScreenPurpose,
  slots: Slot[],
  alt: string,
): Screenshot {
  return { id, src: null, ...WEB_PLACEHOLDER, alt, purpose, slots, device: "web", privacyChecked: false };
}

export const screenshots: Screenshot[] = [
  mobilePlaceholder("hero-primary", "home", ["hero-primary"], "Home screen of SOS: COMMUNITY APP."),
  mobilePlaceholder("hero-secondary", "category", ["hero-secondary"], "Category selection screen for submitting a report."),
  mobilePlaceholder("how-report", "report-form", ["how-report", "showcase"], "Report form screen for capturing and submitting incident details."),
  mobilePlaceholder("how-review", "submitted", ["how-review", "showcase"], "Confirmation screen shown after a report is submitted."),
  webPlaceholder("how-assign", "notifications", ["how-assign"], "Operations center web view showing a report being assigned to responders."),
  webPlaceholder("how-respond", "map", ["how-respond"], "Operations center web view showing responder route guidance and location information."),
  mobilePlaceholder("how-resolve", "status", ["how-resolve", "tracking", "showcase"], "Status screen showing a report marked as resolved."),
  mobilePlaceholder("register-welcome", "welcome", ["register-welcome"], "Welcome screen shown on first opening the app."),
  mobilePlaceholder("register-form", "register", ["register-form"], "Registration screen for entering account details."),
  mobilePlaceholder("register-verify", "verify", ["register-verify"], "Verification screen shown during account registration."),
  mobilePlaceholder("register-home", "login", ["register-home"], "Sign-in screen for returning users."),
];

export const bySlot = (slot: Slot): Screenshot[] =>
  screenshots.filter((s) => s.slots.includes(slot));

export const byId = (id: string): Screenshot => {
  const found = screenshots.find((s) => s.id === id);
  if (!found) {
    throw new Error(`No screenshot registered with id "${id}" in src/config/screenshots.ts`);
  }
  return found;
};
