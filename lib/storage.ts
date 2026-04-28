import fs from "fs/promises";
import path from "path";

/**
 * Storage adapter for planning sync data.
 * - Production (Netlify): uses Netlify Blobs (persistent across function invocations).
 * - Local dev: uses local JSON files under ./data.
 *
 * Netlify Blobs are auto-configured when the function runs on Netlify
 * (NETLIFY=true). Locally we fall back to filesystem.
 */
const isNetlify = process.env.NETLIFY === "true" || !!process.env.NETLIFY_BLOBS_CONTEXT;

const STORE_NAME = "planning";
const localDir = path.join(process.cwd(), "data");

async function getStoreSafe() {
  try {
    const mod = await import("@netlify/blobs");
    return mod.getStore({ name: STORE_NAME, consistency: "strong" });
  } catch (err) {
    console.error("[storage] Failed to load @netlify/blobs", err);
    return null;
  }
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (isNetlify) {
    const store = await getStoreSafe();
    if (store) {
      try {
        const data = (await store.get(key, { type: "json" })) as T | null;
        if (data) return data;
      } catch (err) {
        console.error(`[storage] readJson(${key}) blob error`, err);
      }
    }
    // Fallback: bundled seed file shipped with the build (read-only).
    try {
      const filePath = path.join(localDir, `${key}.json`);
      const raw = await fs.readFile(filePath, "utf-8");
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  try {
    const filePath = path.join(localDir, `${key}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  if (isNetlify) {
    const store = await getStoreSafe();
    if (!store) {
      throw new Error("[storage] Netlify Blobs unavailable; cannot persist data");
    }
    await store.setJSON(key, value);
    return;
  }

  const filePath = path.join(localDir, `${key}.json`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
}
