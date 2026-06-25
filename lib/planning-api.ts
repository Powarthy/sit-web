const PLANNING_API_BASE =
  process.env.PLANNING_API_BASE ||
  process.env.NEXT_PUBLIC_PLANNING_API_BASE ||
  "http://localhost:3000";

export function planningApiUrl(path: string) {
  const base = PLANNING_API_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
