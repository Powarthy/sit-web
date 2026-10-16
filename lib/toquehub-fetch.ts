import { randomUUID } from "node:crypto";
import { toquehubReservationsApiUrl } from "./planning-api.ts";

// Do not log request bodies, query strings, cancellation tokens or raw errors.
export async function toquehubFetch(path: string, init: RequestInit = {}) {
  const correlationId = randomUUID();
  const started = Date.now();
  const method = init.method ?? "GET";
  const endpoint = path.startsWith("/api/public/v1/reservations/cancel/")
    ? "cancellation"
    : path.split("?")[0];
  let url: string;
  try {
    url = toquehubReservationsApiUrl(path);
  } catch {
    console.error(
      JSON.stringify({
        service: "toquehub",
        endpoint,
        correlationId,
        failure: "configuration",
        at: new Date().toISOString(),
      }),
    );
    throw new Error("TOQUEHUB_CONFIGURATION_ERROR");
  }
  const attempts = method === "GET" ? 2 : 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        cache: "no-store",
        headers: {
          ...Object.fromEntries(new Headers(init.headers)),
          "X-Request-ID": correlationId,
        },
        signal: AbortSignal.timeout(8000),
      });
      if (response.status >= 500) {
        console.error(
          JSON.stringify({
            service: "toquehub",
            endpoint,
            correlationId,
            method,
            status: response.status,
            durationMs: Date.now() - started,
            attempt,
            failure: "upstream_http",
            at: new Date().toISOString(),
          }),
        );
        if (attempt < attempts) {
          await response.body?.cancel();
          continue;
        }
      }
      return response;
    } catch (error) {
      const cause = (error as { cause?: { code?: string } })?.cause?.code;
      const name = (error as { name?: string })?.name;
      const failure =
        name === "TimeoutError"
          ? "timeout"
          : cause === "ENOTFOUND" || cause === "EAI_AGAIN"
            ? "dns"
            : "network";
      console.error(
        JSON.stringify({
          service: "toquehub",
          endpoint,
          correlationId,
          method,
          failure,
          durationMs: Date.now() - started,
          attempt,
          at: new Date().toISOString(),
        }),
      );
      if (attempt === attempts) throw new Error("TOQUEHUB_UNAVAILABLE");
    }
  }
  throw new Error("TOQUEHUB_UNAVAILABLE");
}
