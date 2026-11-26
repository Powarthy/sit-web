import { NextRequest, NextResponse } from "next/server";
import { toquehubFetch } from "../../../../lib/toquehub-fetch";
import { parseBrunchReservation } from "../../../../lib/brunch-reservation";
import { claimBrunchCode } from "../../../../lib/brunch-email-verification";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null);
  const body = parseBrunchReservation(input);
  if (!body || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ ok: false, error: "invalid_reservation" }, { status: 400 });
  }

  try {
    const claim = await claimBrunchCode(body, input.verificationId, input.emailCode, input.acceptedTerms);
    if (claim.status !== 200) {
      return NextResponse.json({ ok: false, error: claim.error }, { status: claim.status });
    }
    const response = await toquehubFetch("/api/public/v1/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);
    await claim.finish(response.status === 409).catch(() => {
      console.error("Could not finalize brunch verification state");
    });
    return NextResponse.json(payload ?? { ok: false }, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "reservation_unavailable" },
      { status: 503 },
    );
  }
}
