#!/usr/bin/env node
// Runs Lighthouse mobile 3× against a running production build (npm run build && npm run start)
// and prints the median Performance/Accessibility/Best-Practices/SEO scores plus
// LCP/CLS/TBT. See `.claude/skills/performance-audit/SKILL.md` for the full procedure
// and budget; see docs/performance-checklist.md for the results log to update by hand
// after running this.

import { execFile } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const URL = process.env.AUDIT_URL ?? "http://localhost:3000";
const RUNS = 3;
const REPORTS_DIR = path.join(process.cwd(), "reports");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) reject(new Error(`${cmd} ${args.join(" ")} failed: ${stderr || err.message}`));
      else resolve(stdout);
    });
  });
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  await mkdir(REPORTS_DIR, { recursive: true });

  const results = [];
  for (let i = 1; i <= RUNS; i++) {
    const outPath = path.join(REPORTS_DIR, `lh-mobile-run${i}.json`);
    console.log(`Running Lighthouse mobile pass ${i}/${RUNS} against ${URL} ...`);
    try {
      await run("npx", [
        "lighthouse",
        URL,
        "--form-factor=mobile",
        "--screenEmulation.mobile",
        "--output=json",
        `--output-path=${outPath}`,
        "--chrome-flags=--headless=new",
        "--quiet",
      ]);
    } catch (err) {
      console.error(
        "Lighthouse run failed — Chrome may be unavailable in this environment.\n" +
          String(err.message || err),
      );
      process.exit(1);
    }
    const json = JSON.parse(await readFile(outPath, "utf8"));
    results.push({
      perf: Math.round(json.categories.performance.score * 100),
      a11y: Math.round(json.categories.accessibility.score * 100),
      bp: Math.round(json.categories["best-practices"].score * 100),
      seo: Math.round(json.categories.seo.score * 100),
      lcp: json.audits["largest-contentful-paint"].numericValue,
      cls: json.audits["cumulative-layout-shift"].numericValue,
      tbt: json.audits["total-blocking-time"].numericValue,
    });
  }

  const med = {
    perf: median(results.map((r) => r.perf)),
    a11y: median(results.map((r) => r.a11y)),
    bp: median(results.map((r) => r.bp)),
    seo: median(results.map((r) => r.seo)),
    lcp: median(results.map((r) => r.lcp)) / 1000,
    cls: median(results.map((r) => r.cls)),
    tbt: median(results.map((r) => r.tbt)),
  };

  console.log("\n=== Median of 3 mobile runs ===");
  console.log(`Performance:      ${med.perf}`);
  console.log(`Accessibility:    ${med.a11y}`);
  console.log(`Best Practices:   ${med.bp}`);
  console.log(`SEO:              ${med.seo}`);
  console.log(`LCP:              ${med.lcp.toFixed(2)} s`);
  console.log(`CLS:              ${med.cls.toFixed(3)}`);
  console.log(`TBT:              ${Math.round(med.tbt)} ms`);
  console.log(`\nRaw JSON reports saved in ${path.relative(process.cwd(), REPORTS_DIR)}/`);
  console.log("Copy these numbers into docs/performance-checklist.md with today's date and commit.");
}

main();
