import { NextRequest, NextResponse } from "next/server";
import { toquehubReservationsApiUrl } from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const fullName = String(body?.fullName || "").trim();
    const [firstName = "", ...lastNameParts] = fullName
      .split(/\s+/)
      .filter(Boolean);
    const response = await fetch(
      toquehubReservationsApiUrl("/api/public/v1/reservations"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerSlug: "brunch",
          date: body?.date,
          time: body?.time,
          firstName,
          lastName: lastNameParts.join(" "),
          email: body?.email,
          phone: body?.phone,
          allergies: body?.allergies,
          peopleCount: Number(body?.partySize),
          customerLocale: body?.locale,
          availabilityChoice: body?.availabilityChoice,
          alternateTime: body?.alternateTime,
        }),
      },
    );
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { ok: false }, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "toquehub_unavailable" },
      { status: 503 },
    );
  }
}
