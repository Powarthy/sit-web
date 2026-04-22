// One-shot image compression script.
// - Backs up originals to public/images/_originals/ (preserves folder structure)
// - Converts large SVG/JPG/PNG/WebP to optimized .webp
// - Keeps file base names; caller should update references where extension changed
// Usage: node scripts/compress-images.mjs

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public/images");
const BACKUP = path.join(ROOT, "_originals");

const MAX_W = 2400;
const QUALITY = 82;

// Files to skip (already tiny or intentionally kept)
const SKIP = new Set(["_originals"]);

/** @type {{file: string, before: number, after: number, outExt: string}[]} */
const report = [];

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.dirent?.isDirectory?.() ?? e.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

async function backup(file) {
  const rel = path.relative(ROOT, file);
  const target = path.join(BACKUP, rel);
  await ensureDir(path.dirname(target));
  try {
    await fs.access(target);
    // Already backed up; skip to avoid overwriting original with a compressed copy
    return false;
  } catch {
    await fs.copyFile(file, target);
    return true;
  }
}

async function compress(file) {
  const ext = path.extname(file).toLowerCase();
  const base = file.slice(0, -ext.length);
  const stat = await fs.stat(file);
  const before = stat.size;

  // Skip tiny files (< 200 KB) that don't need compression
  if (before < 200 * 1024 && ext !== ".svg") {
    return;
  }

  // SVG: most of these are rasters wrapped in SVG; convert via sharp with density
  if (ext === ".svg") {
    const raw = await fs.readFile(file, "utf8").catch(() => "");
    // If SVG is pure vector (small & no embedded data URI), leave untouched
    if (before < 200 * 1024 && !raw.includes("data:image")) return;
    const outPath = `${base}.webp`;
    try {
      await backup(file);
      await sharp(file, { density: 150 })
        .resize({ width: MAX_W, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath + ".tmp");
      await fs.rename(outPath + ".tmp", outPath);
      // Remove original SVG now that webp exists
      await fs.unlink(file);
      const after = (await fs.stat(outPath)).size;
      report.push({ file: path.relative(ROOT, file), before, after, outExt: ".webp" });
    } catch (err) {
      console.warn("SVG failed:", file, err.message);
    }
    return;
  }

  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".webp") {
    const outPath = `${base}.webp`;
    await backup(file);
    const pipeline = sharp(file).resize({ width: MAX_W, withoutEnlargement: true });
    await pipeline.webp({ quality: QUALITY }).toFile(outPath + ".tmp");
    // If output path == input path (webp), replace
    await fs.rename(outPath + ".tmp", outPath);
    if (outPath !== file) {
      await fs.unlink(file);
    }
    const after = (await fs.stat(outPath)).size;
    report.push({ file: path.relative(ROOT, file), before, after, outExt: ".webp" });
  }
}

async function main() {
  await ensureDir(BACKUP);
  const files = await walk(ROOT);
  for (const f of files) {
    await compress(f).catch((e) => console.warn("FAIL", f, e.message));
  }

  console.log("\n=== COMPRESSION REPORT ===");
  let totalBefore = 0;
  let totalAfter = 0;
  for (const r of report) {
    const mbB = (r.before / 1024 / 1024).toFixed(2);
    const mbA = (r.after / 1024 / 1024).toFixed(2);
    const pct = (((r.before - r.after) / r.before) * 100).toFixed(1);
    totalBefore += r.before;
    totalAfter += r.after;
    console.log(`${r.file.padEnd(50)} ${mbB.padStart(6)} MB → ${mbA.padStart(6)} MB  (-${pct}%)`);
  }
  console.log("\nTOTAL:",
    (totalBefore / 1024 / 1024).toFixed(2), "MB →",
    (totalAfter / 1024 / 1024).toFixed(2), "MB",
    `(-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`);
  console.log("Originals backed up to", BACKUP);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
