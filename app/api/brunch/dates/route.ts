import { NextResponse } from "next/server";
import { buildBrunchDatesResponse } from "../../../../lib/brunch-widget";
import { toquehubFetch } from "../../../../lib/toquehub-fetch";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await toquehubFetch(
      "/api/public/v1/reservations/offers/brunch/availability",
      { cache: "no-store" },
    );
    const offer = await response.json().catch(() => null);
    if (!response.ok || !offer) {
      return NextResponse.json(offer ?? { ok: false }, {
        status: response.status,
      });
    }
    return NextResponse.json(buildBrunchDatesResponse(offer));
  } catch {
    return NextResponse.json(
      { ok: false, error: "toquehub_unavailable" },
      { status: 503 },
    );
  }
}
