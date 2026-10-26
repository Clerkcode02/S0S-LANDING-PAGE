# Where to put screenshots and images

```
your-project/
├── CLAUDE.md
├── .claude/skills/…
└── assets/
    ├── screenshots-raw/   ← PUT APP SCREENSHOTS HERE (original PNG/JPG, full resolution)
    └── brand-raw/         ← PUT LOGO, APP ICON, OG/SHARE IMAGE HERE
```

You can create these two folders yourself before starting, or let Claude Code create them in Phase 1. Don't put anything in `public/` by hand — Claude Code generates the optimized versions there.

## App screenshots → `assets/screenshots-raw/`
- Take them straight from the phone, uncropped, full resolution (PNG preferred).
- Use **dummy data** — no real names, phone numbers, addresses, faces, or plate numbers.
- Naming is optional but helps: `NN-what-it-shows.png`

| Suggested file | Used in |
|---|---|
| `01-home.png` | Hero (main phone), registration "Sign in & explore" |
| `02-category-select.png` | Hero (second phone), How It Works → Report |
| `03-report-form.png` | How It Works → Report, Showcase |
| `04-report-submitted.png` | How It Works → Review, Showcase |
| `05-report-status.png` | Incident Tracking, How It Works → Resolve |
| `06-welcome.png` | How to Register → step 1 |
| `07-register.png` | How to Register → details step |
| `08-verify.png` | How to Register → verification (skip if the app has none) |
| `09-login.png` | How to Register → sign in |
| `10-responder-*.png` / `11-map.png` | How It Works → Assign / Respond, Showcase |

Any other useful screens can go in too — Claude will identify them and suggest a spot.

## Brand images → `assets/brand-raw/`
- `logo.svg` (or PNG with transparent background) — nav and footer
- `app-icon.png` (1024×1024) — favicon / app icon
- `og-image.png` (1200×630) — social share preview

## After dropping files
Paste the "Follow-up prompt" from the bottom of `PROMPT.md` into Claude Code.
