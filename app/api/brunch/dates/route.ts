import { NextResponse } from "next/server";
import {
  planningApiUrl,
  toquehubReservationsApiUrl,
  toquehubReservationsEnabled,
} from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (toquehubReservationsEnabled()) {
      const response = await fetch(
        toquehubReservationsApiUrl("/api/public/v1/reservations/offers/brunch/availability"),
        { cache: "no-store" },
      );
      const offer = await response.json().catch(() => null);
      if (!response.ok || !offer) {
        return NextResponse.json(offer ?? { ok: false }, { status: response.status });
      }
      const metadata = offer.publicMetadata ?? {};
      return NextResponse.json({
        ok: true,
        items: (Array.isArray(offer.dates) ? offer.dates : []).map(
          (date: { date: string; endDate?: string; slots?: string[] }) => ({
            date: date.date,
            endDate: date.endDate || date.date,
            slots: Array.isArray(date.slots) ? date.slots : [],
            title: metadata.titleI18n?.fr || "Brunch",
            titleI18n: metadata.titleI18n,
          }),
        ),
      });
    }
    const response = await fetch(planningApiUrl("/api/public/brunch/dates"), {
      cache: "no-store"
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { ok: false }, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "planning_api_unavailable" }, { status: 503 });
  }
}
