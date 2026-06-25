export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-LQNTC8XB1B";

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
  // TODO: connect this to the future analytics cookie consent banner before loading/sending GA4.
  return true;
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;

  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: window.location.href
  });
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  window.gtag?.("event", name, {
    page_path: window.location.pathname,
    ...params
  });
}
