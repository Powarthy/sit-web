const PLANNING_API_BASE =
  process.env.PLANNING_API_BASE ||
  process.env.NEXT_PUBLIC_PLANNING_API_BASE ||
  "https://thefrenchcafe-api-v2-staging.fly.dev";

export function planningApiUrl(path: string) {
  const base = PLANNING_API_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
