"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "../lib/analytics";

export default function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const queryString = searchParams.toString();
    const path = `${pathname || "/"}${queryString ? `?${queryString}` : ""}`;

    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}
