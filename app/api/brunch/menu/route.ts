import { NextRequest, NextResponse } from "next/server";
import {
  planningApiUrl,
  toquehubReservationsApiUrl,
  toquehubReservationsEnabled,
} from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.toString();
  try {
    if (toquehubReservationsEnabled()) {
      const date = request.nextUrl.searchParams.get("date") || "";
      const response = await fetch(
        toquehubReservationsApiUrl("/api/public/v1/reservations/offers/brunch"),
        { cache: "no-store" },
      );
      const offer = await response.json().catch(() => null);
      if (!response.ok || !offer) {
        return NextResponse.json(offer ?? { ok: false }, { status: response.status });
      }
      const dateEntry = (Array.isArray(offer.dates) ? offer.dates : []).find(
        (entry: { date?: string }) => entry.date === date,
      );
      const menu = dateEntry?.occurrences?.[0]?.menu;
      const items = (Array.isArray(menu?.items) ? menu.items : []).map(
        (item: {
          id: string;
          publicContent?: {
            category?: string;
            name?: Record<string, string>;
            description?: Record<string, string>;
          };
          product?: { name?: string };
          technicalSheet?: { name?: string };
        }) => {
          const fallbackName = item.technicalSheet?.name || item.product?.name || "";
          return {
            id: item.id,
            category: item.publicContent?.category || "savory",
            name: item.publicContent?.name || {
              fr: fallbackName,
              en: fallbackName,
              fi: fallbackName,
            },
            description: item.publicContent?.description || { fr: "", en: "", fi: "" },
          };
        },
      );
      return NextResponse.json({ ok: true, items });
    }
    const response = await fetch(planningApiUrl(`/api/public/brunch/menu${search ? `?${search}` : ""}`), {
      cache: "no-store"
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { ok: false }, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "planning_api_unavailable" }, { status: 503 });
  }
}
