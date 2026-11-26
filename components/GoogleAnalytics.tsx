"use client";

import Script from "next/script";
import { useState } from "react";
import AnalyticsPageView from "./AnalyticsPageView";
import { GA_MEASUREMENT_ID, hasAnalyticsConsent, setMeasurementDisabled } from "../lib/analytics";

export default function GoogleAnalytics() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onReady={() => {
          if (!hasAnalyticsConsent()) return;
          setMeasurementDisabled(false);
          window.dataLayer ??= [];
          window.gtag ??= (...args) => { window.dataLayer?.push(args); };
          window.gtag("js", new Date());
          window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
          setReady(true);
        }}
      />
      {ready ? <AnalyticsPageView /> : null}
    </>
  );
}
