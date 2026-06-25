import { NextRequest, NextResponse } from "next/server";
import { planningApiUrl } from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const response = await fetch(planningApiUrl("/api/public/brunch/reservations"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {})
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { ok: false }, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "planning_api_unavailable" }, { status: 503 });
  }
}
