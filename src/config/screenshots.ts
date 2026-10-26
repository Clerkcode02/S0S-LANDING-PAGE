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
  {
    id: "hero-primary",
    src: "/screenshots/hero-primary.webp",
    width: 828,
    height: 1792,
    alt: "Home screen listing quick-report categories including Rescue, Police, Fire, and Others, plus shortcuts for audio call, video call, and hotline.",
    purpose: "home",
    slots: ["hero-primary"],
    device: "mobile",
    privacyChecked: true,
  },
  // hero-secondary: on hold — the supplied file is the Updates/announcements feed,
  // not a category-selection screen. Still a placeholder until the right screenshot
  // arrives. See docs/assets-guide.md intake log 2026-10-26.
  mobilePlaceholder("hero-secondary", "category", ["hero-secondary"], "Category selection screen for submitting a report."),
  // how-report: on hold — supplied screenshot shows a real person's face and a
  // precise street address + GPS coordinates baked into the capture UI. Needs a
  // cleaned version. See docs/assets-guide.md intake log 2026-10-26.
  mobilePlaceholder("how-report", "report-form", ["how-report", "showcase"], "Report form screen for capturing and submitting incident details."),
  {
    id: "how-review",
    src: "/screenshots/how-review.webp",
    width: 828,
    height: 1792,
    alt: "Confirmation screen reading \"Emergency Sent\" after a report is submitted, with a \"View Emergencies\" button.",
    purpose: "submitted",
    slots: ["how-review", "showcase"],
    device: "mobile",
    privacyChecked: true,
  },
  // how-assign: on hold — supplied screenshot shows a real citizen's full name and
  // phone number in the Report Details panel. Needs a cleaned version.
  webPlaceholder("how-assign", "notifications", ["how-assign"], "Operations center web view showing a report being assigned to responders."),
  {
    id: "how-respond",
    src: "/screenshots/how-respond.webp",
    width: 1080,
    height: 612,
    alt: "Operations center web view showing a map with responder units, active reports, and route markers.",
    purpose: "map",
    slots: ["how-respond"],
    device: "web",
    privacyChecked: true,
  },
  // how-resolve: on hold — supplied screenshot includes a specific street address
  // for the report location. Confirming with the user whether that's OK to show
  // before registering. See docs/assets-guide.md intake log 2026-10-26.
  mobilePlaceholder("how-resolve", "status", ["how-resolve", "tracking", "showcase"], "Status screen showing a report marked as resolved."),
  {
    id: "register-welcome",
    src: "/screenshots/register-welcome.webp",
    width: 828,
    height: 1792,
    alt: "Terms & Conditions screen shown before registration, with an \"Accept\" button.",
    purpose: "welcome",
    slots: ["register-welcome"],
    device: "mobile",
    privacyChecked: true,
  },
  {
    id: "register-form",
    src: "/screenshots/register-form.webp",
    width: 828,
    height: 1792,
    alt: "Pre-registration screen asking for first name, middle name, last name, and suffix, step 1 of 3.",
    purpose: "register",
    slots: ["register-form"],
    device: "mobile",
    privacyChecked: true,
  },
  // register-verify: on hold — supplied screenshot shows a real profile photo, full
  // name, and phone number. Needs a cleaned version.
  mobilePlaceholder("register-verify", "verify", ["register-verify"], "Verification screen shown during account registration."),
  {
    id: "register-home",
    src: "/screenshots/register-home.webp",
    width: 828,
    height: 1792,
    alt: "Sign-in screen with a phone number field, \"Sign In\" button, and a \"Use Face ID\" option.",
    purpose: "login",
    slots: ["register-home"],
    device: "mobile",
    privacyChecked: true,
  },
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
