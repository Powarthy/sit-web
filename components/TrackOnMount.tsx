"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEventName, type AnalyticsParams } from "../lib/analytics";

export default function TrackOnMount({
  eventName,
  eventParams
}: {
  eventName: AnalyticsEventName;
  eventParams?: AnalyticsParams;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent(eventName, eventParams);
  }, [eventName, eventParams]);

  return null;
}
