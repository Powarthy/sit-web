const PLANNING_API_BASE =
  process.env.PLANNING_API_BASE ||
  process.env.NEXT_PUBLIC_PLANNING_API_BASE ||
  "https://thefrenchcafe-api-v2-staging.fly.dev";

const TOQUEHUB_RESERVATIONS_API_BASE =
  process.env.TOQUEHUB_RESERVATIONS_API_BASE?.trim() || "";

export function planningApiUrl(path: string) {
  const base = PLANNING_API_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function toquehubReservationsEnabled() {
  return Boolean(TOQUEHUB_RESERVATIONS_API_BASE);
}

export function toquehubReservationsApiUrl(path: string) {
  if (!TOQUEHUB_RESERVATIONS_API_BASE) {
    throw new Error("TOQUEHUB_RESERVATIONS_API_BASE is not configured");
  }
  const base = TOQUEHUB_RESERVATIONS_API_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
