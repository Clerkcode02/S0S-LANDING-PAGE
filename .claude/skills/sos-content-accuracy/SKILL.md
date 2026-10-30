---
name: sos-content-accuracy
description: Product facts, approved copy, draft-content handling, and claims rules for SOS COMMUNITY APP. Use whenever writing or editing any user-facing text, FAQ answers, registration steps, CTAs, metadata, alt text, or when the user supplies new product information.
---

# SOS Content Accuracy

This is an emergency-reporting product. Wrong copy can cause real harm. When unsure, say less and mark it draft.

## No download/install CTAs
This page introduces and showcases the app — it is not an install funnel. No "Download App" / "Get the App" / App Store / Google Play buttons, links, sections, or nav items, anywhere on the page. CTAs are informational and route to in-page sections: "Explore the Features", "Learn How It Works", "Discover SOS", etc. There is no `StoreButton` component and no `site.storeLinks` — don't reintroduce them without the user explicitly asking for an install/acquisition flow again. See CLAUDE.md "Scope: showcase, not install funnel".

## Verified product facts (only these may be stated as fact)
- Name: **SOS: COMMUNITY APP** (short form "SOS" after first mention).
- It is a community safety and emergency reporting platform that lets citizens submit incidents to the appropriate local authorities and designated operations center.
- It connects citizen reports with the personnel responsible for reviewing, assigning, responding to, and monitoring incidents.
- Brand statement: "Connecting communities to faster, more coordinated emergency response."
- Workflow: citizen opens app → selects category → captures and submits details → operations center receives → authorized personnel review and assess → appropriate responders assigned → responders receive incident details, location info, notifications → responders use route guidance and available info to proceed → status updates (Pending, Ongoing, Cleared) → timestamps and updates support transparency and accountability.
- Response System detail supplied by the product owner (2026-10-28): a report may include incident type, description, location, contact information, and available photos/video; the operator alert persists until acknowledged; verification may include contacting the reporter or reviewing available camera/dashcam footage; assignments consider incident type, location, urgency, and availability; the operations center can monitor available responder location updates and connected feeds and coordinate additional units; each status change records a timestamp and the authorized person who made it; cleared incidents retain the report, evidence, notes, assignments, status history, and response records for reporting and evaluation.
- SDG alignment supplied by the product owner (2026-10-28): the system addresses SDGs 3, 5, 9, 10, 11, 13, 16, and 17 through its verified emergency and community reporting categories, digital coordination workflow, vulnerable-sector reporting, weather and flooding reports, accountable incident records, and citizen-to-operations-center-to-responder flow. Descriptions must stay within the verified product capabilities listed here and must not name unconfirmed partner agencies.
- **Assign and Respond happen in the operations center's web view, not the citizen mobile app.** Only Report, Review, and Resolve are mobile-app screens. Screenshots for Assign/Respond must be web/desktop captures shown in a `BrowserFrame`, never a `PhoneFrame` — see `app-screenshot-showcase` and `src/config/screenshots.ts` (`device: "web"`).
- Reporting categories (exact list): Rescue; Police; Fire; Other emergency reports; Violence and vulnerable-sector concerns; Incidents involving persons with disabilities and senior citizens; Bullying; Animal concerns; Waste and sanitation issues; Fallen or damaged power lines; Public disturbances; Public intoxication; Video complaints; Traffic incidents; Road obstructions; Flooding; Open or damaged manholes; Typhoon-related incidents.

## Category grouping (approved)
- **Emergency Response:** Rescue, Police, Fire, Other emergency reports
- **Public Safety:** Public disturbances, Public intoxication, Video complaints
- **Vulnerable Community Support:** Violence and vulnerable-sector concerns, Incidents involving persons with disabilities and senior citizens, Bullying
- **Infrastructure Hazards:** Fallen or damaged power lines, Open or damaged manholes
- **Weather & Environment:** Flooding, Typhoon-related incidents, Waste and sanitation issues
- **Traffic & Community Concerns:** Traffic incidents, Road obstructions, Animal concerns

Category descriptions must be generic ("Report situations where someone may need rescue assistance") — never promise who responds or how fast.

## Unknown — must NOT be invented
Registration fields; whether verification exists and how; coverage areas/cities/LGUs; response times or SLAs; partner organizations or agencies; security/privacy certifications; data retention; pricing; offline capability; languages; number of users; awards; contact details; hotline numbers.

For each unknown, use config-driven draft content:
```ts
// src/content/site.ts
export const site = {
  availability: { status: "draft", text: "Availability details will be announced by the program administrators." },
  contact: { email: null as string | null, status: "draft" },
  legal: { privacyUrl: null as string | null, termsUrl: null as string | null },
  emergencyHotlineNote: "For immediate life-threatening emergencies, contact your local emergency hotline.",
};
```
Draft items render with a `DraftBadge` in non-production or behind `SHOW_DRAFT_BADGES` — and the wording itself must be honest even if the badge is hidden.

## Mandatory language rules
- Say "reports are received and reviewed by authorized personnel" / "assigned to appropriate responders" — never "instantly dispatched", "help is on the way", "guaranteed response", "real-time tracking of responders" (unless confirmed).
- Use "helps", "supports", "designed to" rather than absolute claims.
- "Every Second Matters." is an approved headline — it states urgency, not a speed promise. Don't extend it into a promise ("…so we respond in seconds").
- Status wording: Pending, Ongoing, Cleared — confirmed from the app UI (the terminal state is literally labeled "Cleared", not "Resolved").
- Illustrative components must say "Illustration" / "Example" and must not look like live data (no realistic names, addresses, or plate numbers; use generic labels like "Report #—", "Flooding", relative times like "Submitted").
- No fear-mongering, no graphic imagery, no stereotyping in category descriptions.

## Emergency disclaimer (required)
Approved text:
> **For immediate, life-threatening emergencies, call your local emergency hotline.** SOS: COMMUNITY APP supports community reporting and coordination and is not a guaranteed substitute for established emergency services.

Placements: under hero CTAs (short form), FAQ answer, final CTA area (short form), footer (full form).

## Registration guide (draft)
Steps live in `src/content/registration.ts`. Steps 1–4 are confirmed from real app
screenshots (2026-10-26 intake batch — see `docs/assets-guide.md` intake log):
```ts
export const registration = {
  status: "draft" as "draft" | "verified",
  steps: [
    { id: "signin",  title: "Open the app", body: "…", slot: "register-home" },
    { id: "terms",   title: "Review and accept the Terms & Conditions", body: "…", slot: "register-welcome" },
    { id: "details", title: "Complete pre-registration", body: "First/middle/last name + suffix, step 1 of a multi-step form.", slot: "register-form" },
    { id: "verify",  title: "Reach full verification", body: "Basic Level → Registered → Fully Verified, shown on profile.", slot: "register-verify", conditional: true, enabled: true },
  ],
};
```
- Still `status: "draft"`: the rest of the multi-step pre-registration form (beyond the
  name fields) and the exact verification mechanism haven't been shown yet.
- Do not list specific fields beyond what a real screenshot has confirmed.
- If the real app has no verification, set `enabled: false` and the step and slot disappear.
- The register-verify screenshot itself is still blocked (see app-screenshot-showcase
  intake log) — real photo/name/phone — so that slot renders a placeholder until a
  cleaned version arrives, even though the step's copy is confirmed.

## FAQ answers
Write from verified facts. For "Where is the app available?" and anything about stores/coverage, render the configurable draft text. "Is SOS a replacement for emergency hotlines?" → No, plus disclaimer.

## When the user supplies new facts
1. Add them to this skill's "Verified product facts" (or a new subsection).
2. Update `src/content/*`, flip relevant `status` to `"verified"`, remove draft badges.
3. Update `docs/content-map.md`.

## Review checklist
- [ ] Every factual statement traceable to Verified facts or marked draft
- [ ] No banned phrases (instant, guaranteed, immediately dispatched, 24/7, nationwide, certified, trusted by…)
- [ ] Disclaimer present in all required placements
- [ ] No fake links, fake numbers, fake names, fake UI
- [ ] No download/install CTA — no "Download App", store buttons, or store links
- [ ] Metadata/OG text also accurate
