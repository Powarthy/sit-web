// Recover rasters embedded inside the oversized diapo SVGs by regex-extracting
// the base64 payload (librsvg refuses to parse them due to buffer limits).
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve(process.cwd(), "public/images/diapo");
const BACKUP_DIR = path.resolve(process.cwd(), "public/images/_originals/diapo");

const MAX_W = 2400;
const QUALITY = 82;

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  await ensureDir(BACKUP_DIR);
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".svg"));
  const re = /data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=\s]+?)(?=["'])/i;

  let totalBefore = 0;
  let totalAfter = 0;
  for (const f of files) {
    const full = path.join(DIR, f);
    const raw = await fs.readFile(full, "utf8");
    const before = (await fs.stat(full)).size;
    totalBefore += before;

    const m = raw.match(re);
    if (!m) {
      console.warn("No embedded raster in", f);
      continue;
    }
    const buf = Buffer.from(m[2].replace(/\s+/g, ""), "base64");

    // Backup original if not already
    const backupPath = path.join(BACKUP_DIR, f);
    try { await fs.access(backupPath); } catch { await fs.copyFile(full, backupPath); }

    const outPath = path.join(DIR, f.replace(/\.svg$/, ".webp"));
    await sharp(buf)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath + ".tmp");
    await fs.rename(outPath + ".tmp", outPath);

    await fs.unlink(full);
    const after = (await fs.stat(outPath)).size;
    totalAfter += after;
    console.log(`${f.padEnd(40)} ${(before / 1048576).toFixed(2).padStart(6)} MB → ${(after / 1048576).toFixed(2).padStart(6)} MB`);
  }

  console.log("\nTOTAL:",
    (totalBefore / 1048576).toFixed(2), "MB →",
    (totalAfter / 1048576).toFixed(2), "MB",
    `(-${totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : 0}%)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
