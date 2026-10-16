import { NextResponse } from "next/server";
import {
  buildBrunchDatesResponse,
  buildBrunchMenuResponse,
} from "../../../../lib/brunch-widget";
import { toquehubFetch } from "../../../../lib/toquehub-fetch";

export const dynamic = "force-dynamic";

// A real backend + database read, through the same network path as the widget.
export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    const response = await toquehubFetch(
      "/api/public/v1/reservations/offers/brunch/availability",
    );
    if (!response.ok) throw new Error("upstream");
    const offer = await response.json();
    const dates = buildBrunchDatesResponse(offer);
    if (!dates.items.length) throw new Error("no published dates");
    const menus = dates.items.map(({ date }) => {
      const menu = buildBrunchMenuResponse(offer, date, "fr");
      return {
        date,
        state: menu.items.length ? "published" : "pending",
        itemCount: menu.items.length,
      };
    });
    return NextResponse.json(
      { ok: true, service: "brunch", dateCount: dates.items.length, menus },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { ok: false, service: "brunch" },
      { status: 503, headers },
    );
  }
}
