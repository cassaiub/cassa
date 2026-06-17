#!/usr/bin/env node
// Convert any image to WebP under a target byte budget (default 400 KB),
// using the `sharp` already installed in this project. Quality is lowered
// first; only if min-quality WebP still overflows do we downscale, then
// re-search quality at the smaller size. Prints the final path + size.
//
//   node to-webp.mjs <input> <output.webp> [targetKB]
//
// Exit non-zero (and leave no output file) on failure.
import sharp from "sharp";
import { statSync, unlinkSync } from "node:fs";

const [, , input, output, targetKBArg] = process.argv;
if (!input || !output) {
  console.error("usage: node to-webp.mjs <input> <output.webp> [targetKB]");
  process.exit(2);
}
const targetKB = Number(targetKBArg) || 400;
const targetBytes = targetKB * 1024;

if (!output.toLowerCase().endsWith(".webp")) {
  console.error(`output must end in .webp (got ${output})`);
  process.exit(2);
}

// Encode at a given quality + optional max width; returns byte size written.
async function encode(quality, maxWidth) {
  let img = sharp(input, { failOn: "none" }).rotate(); // honour EXIF orientation
  const meta = await img.metadata();
  if (maxWidth && meta.width && meta.width > maxWidth) {
    img = img.resize({ width: maxWidth, withoutEnlargement: true });
  }
  await img.webp({ quality, effort: 6 }).toFile(output);
  return statSync(output).size;
}

// Binary-search the highest quality in [qLo, qHi] that fits, at a fixed width.
// Returns { size, quality } for the best fitting encode, or null if even qLo
// overflows.
async function searchQuality(maxWidth, qLo = 35, qHi = 90) {
  // If the lowest quality still overflows, this width can't fit.
  const sizeLo = await encode(qLo, maxWidth);
  if (sizeLo > targetBytes) return null;

  let best = { size: sizeLo, quality: qLo };
  let lo = qLo;
  let hi = qHi;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const size = await encode(mid, maxWidth);
    if (size <= targetBytes) {
      best = { size, quality: mid };
      lo = mid + 1; // try higher quality
    } else {
      hi = mid - 1; // too big, drop quality
    }
  }
  // Re-encode at the chosen best quality so the file on disk matches `best`.
  await encode(best.quality, maxWidth);
  return best;
}

try {
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const startWidth = meta.width || 4096;

  // Progressively smaller widths; first one that yields a fitting quality wins.
  const widths = [startWidth, 3000, 2400, 2000, 1600, 1280, 1024, 800].filter(
    (w, i, a) => w <= startWidth && a.indexOf(w) === i,
  );

  let result = null;
  let usedWidth = startWidth;
  for (const w of widths) {
    const r = await searchQuality(w);
    if (r) {
      result = r;
      usedWidth = w;
      break;
    }
  }

  if (!result) {
    // Even 800px @ q35 overflowed — keep that smallest encode but warn loudly.
    result = { size: statSync(output).size, quality: 35 };
    usedWidth = 800;
    console.error(
      `WARNING: could not reach ${targetKB} KB; smallest encode is ${(result.size / 1024).toFixed(0)} KB`,
    );
  }

  const finalMeta = await sharp(output).metadata();
  console.log(
    `OK ${output} — ${(result.size / 1024).toFixed(0)} KB (target ${targetKB}), ` +
      `quality ${result.quality}, ${finalMeta.width}×${finalMeta.height}` +
      (usedWidth < startWidth ? ` (downscaled from ${startWidth}px)` : ""),
  );
} catch (err) {
  try {
    unlinkSync(output);
  } catch {}
  console.error(`FAILED: ${err.message}`);
  process.exit(1);
}
