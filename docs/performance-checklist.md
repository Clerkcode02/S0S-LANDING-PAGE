# Performance Checklist

Budget and measurement procedure are defined in
`.claude/skills/performance-audit/SKILL.md` — read that before auditing. This doc is
only the how-to-run-it-here summary and the results log.

## How to audit

```bash
npm run build
npm run start            # keep running in one terminal, serves production build on :3000
npm run audit:lighthouse # in another terminal
```

`audit:lighthouse` runs `scripts/audit-lighthouse.mjs`, which drives
`npx lighthouse` three times against `http://localhost:3000` (mobile preset,
headless Chrome), writes JSON reports to `reports/`, and prints the median
Performance/Accessibility/Best-Practices/SEO scores plus LCP/CLS/TBT.

If Chrome/Lighthouse cannot run in this environment, that must be stated explicitly in
the results log below — never estimate a score.

Also check the build output for:
- Route first-load JS (target ≤ 130 KB gzip, GSAP excluded).
- `gsap` appearing in its own async chunk, not the initial route bundle.

## Results log

| Date | Commit | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-26 | (pre-commit, local build) | 96 | 96 | 100 | 100 | 2.78s | 0.000 | 12ms | Median of 3 mobile runs via `npm run audit:lighthouse` against `npm run start` on localhost. Meets every budget except LCP (2.78s vs ≤2.5s target, ~280ms over). `lcp-breakdown-insight` shows the LCP element (hero `h1`) rendering in ~68ms of actual work (8ms TTFB + 60ms render delay); the gap to the reported 2.78s comes from Lighthouse's simulated-throttling model on a local dev server with no CDN/edge caching/compression — re-measure once deployed to real hosting before treating this as a hard regression. CLS/TBT are excellent (no layout shift, 12ms blocking). Chrome was available via lighthouse's own chrome-launcher in this environment (no system Chrome binary on PATH). |
| 2026-10-27 | (pre-commit, local build) | 94 | 96 | 100 | 100 | 3.16s | 0.000 | 12ms | Median of 3 mobile runs via `npm run audit:lighthouse` against `npm run start` on localhost, after the premium-motion + intro-splash work. Meets Perf/A11y/BP/SEO budgets; **LCP misses at 3.16s vs ≤2.5s** — a 0.38s regression from the 2.78s logged on 2026-10-26. Same caveat as that row applies and is now confirmed in more detail: the trace's actual LCP element is the hero `h1` ("Every Second Matters.") at an **observed 78ms** (5.4ms TTFB + 72.6ms element render delay), and Lighthouse's own `lcp-breakdown-insight` **scores 1/pass**. The reported 3.16s is Lighthouse's simulated-throttling (Lantern) estimate over 405KB/16 requests on a localhost server with no compression, CDN, or HTTP/2 multiplexing, plus 4x CPU throttling against 0.8s of main-thread work. Isolation test: the intro splash costs **nothing** measurable — `INTRO_ENABLED=false` rebuilt and re-audited gives an identical 94 / 3.16s / 0.000 / 13ms. CLS is 0.000 and TBT 12ms, both excellent and unchanged. Re-measure on real hosting before treating the LCP number as a hard regression. |
| 2026-10-27 | (pre-commit, local build) | 95 | 96 | 100 | 100 | 2.93s | 0.000 | 12ms | Median of 3 mobile runs, after working the four open items from the row above. Image delivery fixed (`image-delivery-insight` now passes; image transfer 79KB -> 34KB, total page 405KB -> 360KB), LCP 3.16s -> 2.93s, Perf 94 -> 95. **LCP still misses the ≤2.5s budget** and is still 0.15s above the 2.78s logged on 2026-10-26. The remaining weight is Script 196KB + Font 92KB, both framework/typography baseline — see the attempt log below for what was tried and measured on each. |
| 2026-10-27 | (pre-commit, local build) | 95 | 96 | 100 | 100 | 2.86s | 0.000 | 13ms | Median of 3 mobile runs, after the font pass. Font transfer 92KB -> 70KB, total page 405KB -> 339KB across the whole optimization pass, LCP 3.16s -> 2.86s. Now 0.08s above the 2.78s pre-motion baseline of 2026-10-26, and **still over the ≤2.5s LCP budget**. Remaining weight is Script 196KB (framework baseline) + Font 70KB. CLS 0.000 and TBT 13ms throughout. |
| 2026-10-28 | (pre-commit, local build) | 95 | 96 | 100 | 100 | 2.94s | 0.000 | 27ms | Median of 3 mobile runs after the eight-stage Response System redesign. Placeholder assets are detected at build time, so unavailable final images create no broken requests or console errors. Meets Perf/A11y/BP/SEO/CLS/TBT budgets; **LCP remains over the ≤2.5s target** at 2.94s, consistent with the existing framework/font baseline documented below. |
| 2026-10-28 | (pre-commit, local build) | 93 | 96 | 100 | 100 | 3.16s | 0.000 | 14ms | Median of 3 mobile runs after adding the SDG section, using the production server on port 3100 because port 3000 was already occupied. The new section remains below the fold and its nine optimized images are lazy-loaded. A11y/BP/SEO/CLS/TBT remain at the existing baseline; **LCP remains over the ≤2.5s target**. Lighthouse reported a 6.3MB total page payload, primarily from the existing full-page imagery, which is outside this bounded SDG change. |
| 2026-10-30 | (pre-commit, local build) | 75 | 96 | 100 | 100 | 30.01s* | 0.000 | 36ms | Median of 3 mobile runs after the interactive SOS simulation, against a verified-fresh production server on port 3100. Interaction code keeps TBT low and quality scores at the existing baseline. *Lighthouse's simulated LCP is anomalous: its own `lcp-breakdown-insight` identifies the existing 2.1MB hero background as LCP and records only ~161ms total observed breakdown (10.8ms TTFB + 27.5ms load delay + 38.5ms load + 85.0ms render delay), while `largest-contentful-paint` reports 30.01s. The large existing hero background/Response System assets were not altered as part of this bounded interaction change. |
| 2026-10-30 | (pre-commit, local build) | 75 | 96 | 100 | 100 | 30.23s* | 0.000 | 32ms | Median of 3 mobile runs after removing the hero orbit badges and adding the finite simulated map-marker arrival. TBT improved slightly and quality scores remain unchanged. *The same documented Lighthouse/Lantern anomaly applies: the existing 2.1MB hero background is selected as LCP and receives a ~30s simulated value despite a short observed breakdown. |

### 2026-10-27 optimization pass — four items attempted, measured individually

Each change was audited on its own against a verified-fresh server so the outcome
could be attributed. **One of the four produced a real win; three did not and were
reverted or abandoned.** Measured, not estimated:

| # | Item | Change tried | Result | Kept? |
|---|---|---|---|---|
| 1 | ~26KB oversized images | `images.deviceSizes` + AVIF + accurate `sizes` | **LCP 3.16s -> 2.93s, images 79KB -> 34KB, Perf 94 -> 95, insight passes** | ✅ yes |
| 2 | 120ms render-blocking CSS | `experimental.inlineCss: true` | **Worse: LCP 3.01s -> 3.23s, Perf 95 -> 93.** Clears the audit but grows the HTML document 27KB -> 57KB, and the document is the first request on the critical path | ❌ reverted |
| 3 | ~14KB legacy JS polyfills | modern `browserslist` in package.json | **No change** (Script stayed 196KB, insight still flags 14KB) | ❌ see below |
| 4 | 183KB initial JS over budget | `experimental.optimizePackageImports: ["lucide-react"]` | **No change** — 187KB gzip with and without | ❌ removed |
| 5 | 92KB fonts (added after) | static display instance + real 600 weight | **LCP 2.93s -> 2.86s, fonts 92KB -> 70KB** | ✅ yes |

Details worth not re-discovering:

- **Item 1 took three iterations.** Adding a 420 *and* 480 `deviceSizes` entry made
  things worse than 480 alone: `hero-primary` renders at three different widths across
  the page (hero phone 260/300px, How-It-Works list 200px, showcase 200px), and with
  both variants available the small boxes resolved to 420 while the hero resolved to
  480 — fetching the same file **twice** (25KB + 35KB = 79KB). Unifying `sizes` across
  all three call sites and offering only 480 collapsed it to one shared 34KB request.
  The lesson: when one screenshot is rendered at several sizes, `sizes` has to agree
  across call sites or the optimizer splits the request. `DeviceFrame` gained a `sizes`
  prop for exactly this.
- **`sizes` must describe the image box, not the viewport.** The old
  `"(min-width: 1024px) 320px, 70vw"` over-stated the hero by ~11% because
  `PhoneFrame`'s `p-2.5` takes 20px off the phone's width. 70vw of a 412px viewport is
  288px, but the image actually renders at 260px — enough to push the optimizer up a
  whole variant.
- **Item 3 is not fixable from this project.** The flagged polyfills
  (`Array.prototype.at`, `Object.hasOwn`, `String.prototype.trimStart`, …) are
  feature-detection shims (`Array.prototype.at||(...)`) living inside React-DOM and
  Next's **prebuilt** router runtime chunk. `browserslist` only governs transpilation
  of this project's own source, not Next's vendored bundles. The browserslist entry was
  kept anyway because it documents the real support floor honestly: Tailwind v4 already
  requires Chrome 111 / Safari 16.4 / Firefox 128, so the previous implicit default
  (which included Safari 12) was never true for this site.
- **Item 4 is framework baseline, as the section below already said.** Confirmed by
  measurement rather than assumption: the lucide-react client chunk is only 4KB (named
  imports were already tree-shaken), and the 187KB is React+ReactDOM (70KB gzip),
  Next's router/runtime (47KB), and framework internals (38KB).
#### Item 5 — fonts (done)

The mechanic that matters, because it is not obvious: **a single `weight` string makes
`next/font` fetch a STATIC instance; a `weight` array makes it fetch the VARIABLE
font.** The variable file covers every weight in one download but costs roughly double.
Measured on the basic-latin (`U+??`) subset — the only face an English page downloads:

| Declaration | Result | Basic-latin bytes |
|---|---|---|
| `Inter_Tight weight: ["600","700"]` | one variable file, shared by both weights | 43.9KB |
| `Inter_Tight weight: "700"` | static instance | **22.3KB** |
| `Inter weight: ["400","500"]` | one variable file, shared | 47.3KB |
| `Inter weight: "400"` | static instance | 23.2KB |

So the two families got opposite treatment, each on measurement:

- **Inter Tight -> static `"700"`.** An audit of every `font-weight` in the codebase
  found the display family is *only* ever asked for 700 (`h1/h2/h3` in globals.css and
  `.intro-word`); the 600 it was loading was dead weight. Static instance, **zero
  visual change**, 21.6KB saved — and it is the LCP element's font.
- **Inter -> stays variable, now `["400","500","600"]`.** It genuinely needs three
  weights (400 body, 500 `font-medium` x4, 600 `font-semibold` x16). Three static
  instances would be ~69KB against ~47KB for one variable file, so variable wins.
  **600 was added deliberately**: it was missing, so all 16 `font-semibold` call sites
  were being *synthetically* emboldened by the browser. Adding it costs **zero** extra
  bytes (one variable file serves all three) and renders the real weight — verified at
  runtime: `document.fonts.check("600 16px Inter")` is now `true`, and a `font-semibold`
  node computes to `Inter / 600` against a loaded `Inter 600` face.

Net 91.2KB -> 69.5KB of font bytes. `adjustFontFallback` metric overrides survive the
switch to a static instance, so CLS stayed 0.000.

**Still not attempted:** narrowing the unicode subsets. The build emits Cyrillic,
Greek, Vietnamese and latin-ext faces despite `subsets: ["latin"]`, but each carries a
`unicode-range`, so an English page never downloads them — they cost nothing at
runtime and removing them would only shrink the build output.

### 2026-10-27 audit — what was investigated

Recorded so the next person doesn't repeat the dead ends:

- **Measurement hazard found.** `npm run start` after a rebuild can fail with
  `EADDRINUSE` while an older server still holds :3000, and Lighthouse then audits the
  **stale build** — serving HTML that references deleted chunks, which shows up as a
  `500` on a `/_next/static/chunks/*.js` request and a spurious Best-Practices drop to
  96 (`errors-in-console`). Two of this session's runs were invalidated that way before
  it was caught. Always confirm the server actually started and that every chunk the
  HTML references returns 200 before trusting a run.
- **The intro splash is not the cause** of the LCP number. Rebuilt and re-audited with
  `INTRO_ENABLED = false`: identical 94 / 3.16s. The pre-paint `data-intro` approach
  means the overlay is a sibling of `<main>`, so it never defers the hero's images, and
  it adds no LCP candidate of its own.
- **Payload reduction applied.** The hero phone's 2nd and 3rd cycling screenshots are
  no longer fetched on load — they mount only once the visitor engages (the same signal
  the cycle itself waits for, a full dwell before either is needed on screen). Initial
  image bytes went from ~108KB to 79KB. See `PhoneShowcase` (`loadRest`).
- **Still open, if LCP must be fixed:** `image-delivery-insight` reports ~26KB of
  remaining waste because Next's default smallest `deviceSizes` entry is 640, so the
  hero screenshot downloads at 640w for a 455w display box. Adding a smaller entry
  (e.g. 480) to `images.deviceSizes` in `next.config.ts` would address it, but it
  changes variant selection for every image on the site — not done unilaterally.
  `render-blocking-insight` reports 120ms from the single 10.6KB stylesheet, and
  `legacy-javascript-insight` ~14KB of Turbopack polyfills.

### Initial JS payload (measured, this build)

Summed gzip size of every script tag referenced in the initial HTML response (`curl` +
`gzip -c \| wc -c` per chunk, 2026-10-26): **~183 KB gzip**, vs the ≤130 KB budget —
about 53 KB over. (2026-10-27 re-measure from the Lighthouse network log: **196 KB**
of script transfer across the whole load, i.e. roughly +13 KB for the new motion
components and the intro splash. Total page transfer 405 KB: Script 196, Font 92,
Image 79, Document 26, Stylesheet 10.) Confirmed by inspecting chunk contents:
- The two largest chunks are React/React-DOM runtime (~72 KB gzip) and Next.js's own
  router/runtime internals (~48 KB gzip) — framework baseline, not app code.
- A third chunk (~39 KB gzip) is a polyfill bundle Turbopack includes automatically.
- `gsap`/`ScrollTrigger` are confirmed absent from all of these — verified separately by
  diffing `performance.getEntriesByType('resource')` under `prefers-reduced-motion:
  reduce` (zero gsap bytes fetched) vs `no-preference` (gsap chunks fetch lazily after
  first paint). See the GSAP lazy-chunk check below.
- No extra UI kit, chart library, or unoptimized dependency was added — `gsap` and
  `lucide-react` (tree-shaken named imports) are the only non-framework runtime deps.

The gap to budget is React/Next framework weight, not something fixable by trimming
this project's own code without ejecting from those defaults (e.g. React Compiler
wasn't enabled, no React Server Components streaming tuning attempted). Flagged
honestly rather than hidden; revisit if the budget is a hard requirement.

Append one row per audit run. Never overwrite a prior row; never record a score that
wasn't actually measured in this environment.
