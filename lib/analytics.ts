import { getAnalyticsChoice } from "./cookie-consent";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-LQNTC8XB1B";

export type AnalyticsEventName =
  | "brunch_reservation_started"
  | "brunch_reservation_submitted"
  | "contact_clicked"
  | "instagram_clicked"
  | "menu_viewed"
  | "gift_card_clicked"
  | "language_changed";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type Gtag = (...args: [string, ...unknown[]]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function hasAnalyticsConsent() {
  return typeof window !== "undefined" && getAnalyticsChoice() === "accepted";
}

export function setMeasurementDisabled(disabled: boolean) {
  Object.assign(window, { [`ga-disable-${GA_MEASUREMENT_ID}`]: disabled });
  if (!disabled) return;

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${window.location.hostname}`;
    if (window.location.hostname.endsWith(".kahvilathefrench.cafe")) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=kahvilathefrench.cafe`;
    }
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;

  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`
  });
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  window.gtag?.("event", name, {
    page_path: window.location.pathname,
    ...params
  });
}
