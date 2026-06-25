import { NextResponse } from "next/server";
import { planningApiUrl } from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(planningApiUrl("/api/public/brunch/dates"), {
      cache: "no-store"
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { ok: false }, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "planning_api_unavailable" }, { status: 503 });
  }
}
