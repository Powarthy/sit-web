import assert from "node:assert/strict";
import test from "node:test";
import { toquehubReservationsApiUrl } from "../lib/planning-api.ts";
import { toquehubFetch } from "../lib/toquehub-fetch.ts";

test("ToqueHub configuration fails closed and never falls back to Fly", () => {
  const saved = process.env.TOQUEHUB_RESERVATIONS_API_BASE;
  try {
    delete process.env.TOQUEHUB_RESERVATIONS_API_BASE;
    assert.throws(() => toquehubReservationsApiUrl("/x"), /not configured/);
    for (const base of [
      "https://old.fly.dev",
      "https://user:secret@example.com",
      "https://example.com?token=secret",
      "http://100.127.152.41:8080",
    ]) {
      process.env.TOQUEHUB_RESERVATIONS_API_BASE = base;
      assert.throws(() => toquehubReservationsApiUrl("/x"));
    }
    process.env.TOQUEHUB_RESERVATIONS_API_BASE = "https://example.com:8443/";
    assert.equal(
      toquehubReservationsApiUrl("/api/public/v1/reservations"),
      "https://example.com:8443/api/public/v1/reservations",
    );
  } finally {
    if (saved === undefined) delete process.env.TOQUEHUB_RESERVATIONS_API_BASE;
    else process.env.TOQUEHUB_RESERVATIONS_API_BASE = saved;
  }
});

test("network failures retry reads only; writes are never replayed and logs redact tokens", async () => {
  const savedFetch = globalThis.fetch,
    savedLog = console.error;
  const savedBase = process.env.TOQUEHUB_RESERVATIONS_API_BASE;
  const logs: string[] = [];
  let calls = 0;
  try {
    process.env.TOQUEHUB_RESERVATIONS_API_BASE = "https://example.com";
    console.error = (message) => logs.push(String(message));
    globalThis.fetch = async (_url, init) => {
      calls++;
      assert.ok(init?.signal);
      assert.equal(init?.cache, "no-store");
      throw new TypeError("network failure with secret-token");
    };
    await assert.rejects(
      toquehubFetch("/api/public/v1/reservations/offers/brunch"),
    );
    assert.equal(calls, 2);
    calls = 0;
    await assert.rejects(
      toquehubFetch("/api/public/v1/reservations", {
        method: "POST",
        body: "private-customer",
      }),
    );
    assert.equal(calls, 1);
    await assert.rejects(
      toquehubFetch("/api/public/v1/reservations/cancel/secret-token", {
        method: "POST",
      }),
    );
    assert.ok(!logs.join().includes("secret-token"));
    assert.ok(!logs.join().includes("private-customer"));
    assert.ok(logs.every((line) => JSON.parse(line).correlationId));
    calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return new Response("{}", { status: 409 });
    };
    assert.equal(
      (await toquehubFetch("/api/public/v1/reservations", { method: "POST" }))
        .status,
      409,
    );
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = savedFetch;
    console.error = savedLog;
    if (savedBase === undefined)
      delete process.env.TOQUEHUB_RESERVATIONS_API_BASE;
    else process.env.TOQUEHUB_RESERVATIONS_API_BASE = savedBase;
  }
});
