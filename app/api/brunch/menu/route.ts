import { NextRequest, NextResponse } from "next/server";
import {
  BrunchContractError,
  buildBrunchMenuResponse,
} from "../../../../lib/brunch-widget";
import { toquehubReservationsApiUrl } from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") || "";
    const locale = request.nextUrl.searchParams.get("locale") || "fr";
    const response = await fetch(
      toquehubReservationsApiUrl(
        `/api/public/v1/reservations/offers/brunch?locale=${encodeURIComponent(locale)}`,
      ),
      { cache: "no-store" },
    );
    const offer = await response.json().catch(() => null);
    if (!response.ok || !offer) {
      return NextResponse.json(offer ?? { ok: false }, {
        status: response.status,
      });
    }
    return NextResponse.json(buildBrunchMenuResponse(offer, date, locale));
  } catch (error) {
    if (error instanceof BrunchContractError) {
      return NextResponse.json(
        { ok: false, error: error.code },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "toquehub_unavailable" },
      { status: 503 },
    );
  }
}
