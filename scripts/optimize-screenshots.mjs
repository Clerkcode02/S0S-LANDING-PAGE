#!/usr/bin/env node
// Reads every image in assets/screenshots-raw/, writes optimized WebP + AVIF versions
// into public/screenshots/ (max width 1080px, metadata stripped), and prints a
// ready-to-paste manifest stub (with real width/height) for
// src/config/screenshots.ts. See `.claude/skills/app-screenshot-showcase/SKILL.md`
// for the full intake workflow — this script only handles the optimization step.

import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "assets", "screenshots-raw");
const OUT_DIR = path.join(ROOT, "public", "screenshots");
const MAX_WIDTH = 1080;
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 60;

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg"]);

function slugify(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  let entries;
  try {
    entries = await readdir(SRC_DIR, { withFileTypes: true });
  } catch {
    console.error(`Could not read ${SRC_DIR}. Create it and drop screenshots in first.`);
    process.exit(1);
  }

  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort();

  if (files.length === 0) {
    console.log(`No images found in ${path.relative(ROOT, SRC_DIR)}/. Nothing to do.`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  const manifestEntries = [];

  for (const file of files) {
    const id = slugify(file);
    const inputPath = path.join(SRC_DIR, file);
    const image = sharp(inputPath).rotate(); // auto-orient, then strip EXIF by re-encoding without .withMetadata()
    const metadata = await image.metadata();

    const resizeOpts =
      metadata.width && metadata.width > MAX_WIDTH
        ? { width: MAX_WIDTH }
        : undefined;

    const pipeline = resizeOpts ? image.clone().resize(resizeOpts) : image.clone();

    const webpPath = path.join(OUT_DIR, `${id}.webp`);
    const avifPath = path.join(OUT_DIR, `${id}.avif`);

    const webpInfo = await pipeline
      .clone()
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    await pipeline.clone().avif({ quality: AVIF_QUALITY }).toFile(avifPath);

    manifestEntries.push({
      id,
      width: webpInfo.width,
      height: webpInfo.height,
      sourceFile: file,
    });

    console.log(
      `✓ ${file} → ${id}.webp / ${id}.avif (${webpInfo.width}×${webpInfo.height})`,
    );
  }

  console.log("\n--- Paste into src/config/screenshots.ts (adjust purpose/slots/alt) ---\n");
  for (const entry of manifestEntries) {
    console.log(
      `placeholder.toReal("${entry.id}", {\n` +
        `  src: "/screenshots/${entry.id}.webp",\n` +
        `  width: ${entry.width},\n` +
        `  height: ${entry.height},\n` +
        `  // from: ${entry.sourceFile}\n` +
        `}),`,
    );
  }
  console.log(
    "\nManually match each id above to an existing Screenshot entry (or add a new one),\n" +
      "set src/width/height, fill in alt text, and set privacyChecked: true once reviewed.",
  );
}

main();
