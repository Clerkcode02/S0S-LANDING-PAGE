#!/usr/bin/env node
// One-off: blur specific PII regions (face/name/phone/address) in the held-back raw
// screenshots, requested explicitly by the user. Only blurs the named rectangles —
// never redraws, retouches, or otherwise alters the UI. See
// .claude/skills/app-screenshot-showcase/SKILL.md.
//
// Each region is applied against a fully-materialized buffer (toBuffer -> new sharp()
// on the next step) rather than chaining further ops onto a pipeline that already has
// a pending composite queued — chaining silently failed to apply later regions.

import sharp from "sharp";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

const DIR = path.join(process.cwd(), "assets", "screenshots-raw");

// Regions as { left, top, width, height } in the source image's own pixel space.
const JOBS = [
  {
    file: "how-report.png",
    label: "face/body + address/GPS/timestamp overlay",
    regions: [{ left: 0, top: 960, width: 828, height: 650 }],
  },
  {
    file: "how-assign.png",
    label: "REPORTED BY name + CONTACT phone number + chat thread name",
    regions: [
      { left: 480, top: 860, width: 480, height: 260 },
      { left: 1000, top: 1140, width: 500, height: 80 },
    ],
  },
  {
    file: "register-verify.png",
    label: "profile photo + name + phone number",
    regions: [{ left: 10, top: 100, width: 660, height: 190 }],
  },
  {
    file: "how-resolve.png",
    label: "street address line",
    regions: [{ left: 140, top: 295, width: 650, height: 95 }],
  },
];

async function blurRegion(buffer, region) {
  const meta = await sharp(buffer).metadata();
  const left = Math.max(0, Math.min(region.left, meta.width - 1));
  const top = Math.max(0, Math.min(region.top, meta.height - 1));
  const width = Math.min(region.width, meta.width - left);
  const height = Math.min(region.height, meta.height - top);

  const blurredChunk = await sharp(buffer).extract({ left, top, width, height }).blur(35).toBuffer();

  return sharp(buffer).composite([{ input: blurredChunk, left, top }]).png().toBuffer();
}

for (const job of JOBS) {
  const filePath = path.join(DIR, job.file);
  let buffer = await readFile(filePath);
  for (const region of job.regions) {
    buffer = await blurRegion(buffer, region);
  }
  await writeFile(filePath, buffer);
  console.log(`✓ ${job.file} — blurred: ${job.label}`);
}
