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

export interface Screenshot {
  id: string; // e.g. "03-report-form"
  src: string | null; // "/screenshots/03-report-form.webp"; null = placeholder
  width: number;
  height: number; // intrinsic px of the optimized file
  alt: string; // factual description, never a marketing claim
  purpose: ScreenPurpose;
  slots: Slot[];
  caption?: string;
  privacyChecked: boolean; // must be true before `src` is non-null in production
}

// Default placeholder ratio (~9:19.5) used until real screenshot dimensions are known.
const PLACEHOLDER_WIDTH = 1179;
const PLACEHOLDER_HEIGHT = 2556;

function placeholder(
  id: string,
  purpose: ScreenPurpose,
  slots: Slot[],
  alt: string,
): Screenshot {
  return {
    id,
    src: null,
    width: PLACEHOLDER_WIDTH,
    height: PLACEHOLDER_HEIGHT,
    alt,
    purpose,
    slots,
    privacyChecked: false,
  };
}

export const screenshots: Screenshot[] = [
  placeholder("hero-primary", "home", ["hero-primary"], "Home screen of SOS: COMMUNITY APP."),
  placeholder("hero-secondary", "category", ["hero-secondary"], "Category selection screen for submitting a report."),
  placeholder("how-report", "report-form", ["how-report", "showcase"], "Report form screen for capturing and submitting incident details."),
  placeholder("how-review", "submitted", ["how-review", "showcase"], "Confirmation screen shown after a report is submitted."),
  placeholder("how-assign", "notifications", ["how-assign", "showcase"], "Notification screen shown when a report is assigned."),
  placeholder("how-respond", "map", ["how-respond", "showcase"], "Map or route guidance screen used by responders."),
  placeholder("how-resolve", "status", ["how-resolve", "tracking", "showcase"], "Status screen showing a report marked as resolved."),
  placeholder("register-welcome", "welcome", ["register-welcome"], "Welcome screen shown on first opening the app."),
  placeholder("register-form", "register", ["register-form"], "Registration screen for entering account details."),
  placeholder("register-verify", "verify", ["register-verify"], "Verification screen shown during account registration."),
  placeholder("register-home", "login", ["register-home"], "Sign-in screen for returning users."),
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
