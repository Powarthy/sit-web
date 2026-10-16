const PLANNING_API_BASE =
  process.env.PLANNING_API_BASE ||
  process.env.NEXT_PUBLIC_PLANNING_API_BASE ||
  "https://thefrenchcafe-api-v2-staging.fly.dev";

export function planningApiUrl(path: string) {
  const base = PLANNING_API_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function toquehubReservationsApiUrl(path: string) {
  const configured = process.env.TOQUEHUB_RESERVATIONS_API_BASE?.trim();
  if (!configured) {
    throw new Error("TOQUEHUB_RESERVATIONS_API_BASE is not configured");
  }
  const url = new URL(configured);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.protocol !== "https:" &&
      !(
        process.env.NODE_ENV !== "production" && url.hostname === "localhost"
      )) ||
    url.hostname.endsWith(".fly.dev")
  ) {
    throw new Error("Invalid ToqueHub reservations API configuration");
  }
  const base = url.toString().replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
