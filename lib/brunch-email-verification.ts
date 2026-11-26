import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";
import type { Locale } from "../data/site-content";
import { brunchTermsVersion } from "../data/legal-content";
import { isBrunchEmail, type parseBrunchReservation } from "./brunch-reservation";

import { brunchEmailStoreName } from "./brunch-verification-retention";
const lifetime = 10 * 60 * 1000;
const resendDelay = 60 * 1000;
const maxAttempts = 5;
const maxDailySends = 5;
const challengePattern = /^\d{4}-\d{2}-\d{2}\.[0-9a-f-]{36}$/;

type Reservation = NonNullable<ReturnType<typeof parseBrunchReservation>>;
type Challenge = {
  id: string;
  digest: string;
  expiresAt: number;
  sentAt: number;
  sends: number;
  attempts: number;
  state: "sending" | "ready" | "processing" | "conflict" | "used";
  bookingDigest?: string;
};
type Entry = { data: Challenge; etag: string };

const localState = globalThis as typeof globalThis & { brunchEmailChallenges?: Map<string, Entry> };
const memory = localState.brunchEmailChallenges ??= new Map<string, Entry>();
const onNetlify = process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_BLOBS_CONTEXT);

export function isEmailCodePreview(requestUrl: URL) {
  return !onNetlify && process.env.BRUNCH_EMAIL_PREVIEW === "1" &&
    (requestUrl.hostname === "127.0.0.1" || requestUrl.hostname === "localhost");
}

function store() {
  return getStore({
    name: brunchEmailStoreName,
    consistency: "strong",
    // A signal opts out of Next.js fetch deduplication. The Blobs SDK needs
    // to cancel response bodies without waiting for a second reader.
    fetch: (input, init) => fetch(input, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    }),
  });
}

async function read(key: string): Promise<Entry | null> {
  if (!onNetlify) {
    const yesterday = dayOf(Date.now() - 86400000);
    for (const oldKey of memory.keys()) {
      if (oldKey.slice(0, 10) < yesterday) {
        memory.delete(oldKey);
      }
    }
    return memory.get(key) ?? null;
  }
  const entry = await store().getWithMetadata(key, { type: "json" });
  if (!entry) return null;
  if (!entry.etag) throw new Error("Verification store did not return an ETag");
  return { data: entry.data, etag: entry.etag };
}

async function update(key: string, data: Challenge, previous: Entry | null) {
  if (!onNetlify) {
    if ((memory.get(key)?.etag ?? null) !== (previous?.etag ?? null)) return null;
    const etag = randomUUID();
    memory.set(key, { data, etag });
    return etag;
  }
  const result = await store().setJSON(key, data, previous
    ? { onlyIfMatch: previous.etag }
    : { onlyIfNew: true });
  if (!result.modified) return null;
  if (!result.etag) throw new Error("Verification store did not return a new ETag");
  return result.etag;
}

function dayOf(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function digest(...values: string[]) {
  const secret = process.env.BRUNCH_EMAIL_VERIFICATION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Missing verification secret");
  return createHmac("sha256", secret).update(JSON.stringify(values)).digest("hex");
}

function recipientKey(day: string, email: string) {
  return `${day}/${digest("recipient", email.toLowerCase())}`;
}

const emailCopy = {
  fr: ["Votre code de réservation", "Voici votre code de vérification pour le brunch de The French Café.", "Le code est valable 10 minutes."],
  en: ["Your booking verification code", "Here is your verification code for brunch at The French Café.", "The code is valid for 10 minutes."],
  fi: ["Varauksesi vahvistuskoodi", "Tässä on The French Cafén brunssivarauksen vahvistuskoodi.", "Koodi on voimassa 10 minuuttia."],
} satisfies Record<Locale, [string, string, string]>;

async function deliverCode(email: string, locale: Locale, code: string, id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BRUNCH_EMAIL_FROM;
  if (!apiKey || !from || !onNetlify) throw new Error("Verification email delivery is not configured");

  const [subject, intro, expiry] = emailCopy[locale];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `brunch-verification/${id}`,
    },
    body: JSON.stringify({ from, to: [email], subject, text: `${intro}\n\n${code}\n\n${expiry}` }),
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error("Verification email delivery failed");
}

export async function issueBrunchCode(email: string, locale: Locale, preview: boolean) {
  if (!isBrunchEmail(email)) return { status: 400 } as const;
  const now = Date.now();
  const day = dayOf(now);
  const key = recipientKey(day, email);
  const current = await read(key);
  if (current && (now - current.data.sentAt < resendDelay || current.data.sends >= maxDailySends ||
      (current.data.state === "processing" && now < current.data.expiresAt))) {
    return { status: 429 } as const;
  }

  const id = `${day}.${randomUUID()}`;
  const code = String(randomInt(100000, 1000000));
  const entry: Challenge = {
    id,
    digest: digest("code", id, code),
    expiresAt: now + lifetime,
    sentAt: now,
    sends: (current?.data.sends ?? 0) + 1,
    attempts: 0,
    state: "sending",
  };

  if (!await update(key, entry, current)) return { status: 429 } as const;
  if (!preview) await deliverCode(email, locale, code, id);

  const issued = await read(key);
  if (!issued || issued.data.id !== id || !await update(key, { ...entry, state: "ready" }, issued)) {
    throw new Error("Could not activate verification code");
  }
  return { status: 200, id, previewCode: preview ? code : undefined } as const;
}

export async function claimBrunchCode(
  body: Reservation,
  id: unknown,
  code: unknown,
  acceptedTerms: unknown,
) {
  if (acceptedTerms !== brunchTermsVersion) return { status: 400, error: "terms_required" } as const;
  if (typeof id !== "string" || !challengePattern.test(id) || typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return { status: 400, error: "code_invalid" } as const;
  }
  const now = Date.now();
  const day = id.slice(0, 10);
  if (day !== dayOf(now) && day !== dayOf(now - lifetime)) {
    return { status: 400, error: "code_invalid" } as const;
  }
  const key = recipientKey(day, body.email);
  const current = await read(key);
  if (!current || current.data.id !== id || current.data.expiresAt <= now || current.data.attempts >= maxAttempts) {
    return { status: 400, error: "code_invalid" } as const;
  }
  if (current.data.state !== "ready" && current.data.state !== "conflict") {
    return { status: 429, error: "code_unavailable" } as const;
  }

  const attempt = { ...current.data, attempts: current.data.attempts + 1 };
  const etag = await update(key, attempt, current);
  if (!etag) return { status: 429, error: "code_unavailable" } as const;
  const expected = Buffer.from(current.data.digest, "hex");
  const supplied = Buffer.from(digest("code", id, code), "hex");
  if (!timingSafeEqual(expected, supplied)) {
    return { status: 400, error: "code_invalid" } as const;
  }

  const bookingDigest = digest("booking", body.date, body.time, String(body.peopleCount), body.email.toLowerCase());
  if (current.data.state === "conflict" && (!body.availabilityChoice || current.data.bookingDigest !== bookingDigest)) {
    return { status: 400, error: "code_invalid" } as const;
  }
  if (current.data.state === "ready" && body.availabilityChoice) {
    return { status: 400, error: "code_invalid" } as const;
  }
  const processing: Challenge = { ...current.data, state: "processing", bookingDigest };
  if (!await update(key, processing, { data: attempt, etag })) return { status: 429, error: "code_unavailable" } as const;

  if (onNetlify) {
    try {
      await store().setJSON(`acceptance/${day}/${id}`, {
        acceptedAt: new Date(now).toISOString(),
        termsVersion: brunchTermsVersion,
        bookingDigest,
      }, { onlyIfNew: true });
    } catch (error) {
      const latest = await read(key);
      if (latest?.data.id === id && latest.data.state === "processing") {
        await update(key, current.data, latest);
      }
      throw error;
    }
  }

  return {
    status: 200,
    async finish(conflict: boolean) {
      const latest = await read(key);
      if (latest?.data.id !== id || latest.data.state !== "processing") return;
      await update(key, { ...latest.data, state: conflict ? "conflict" : "used" }, latest);
    },
  } as const;
}
