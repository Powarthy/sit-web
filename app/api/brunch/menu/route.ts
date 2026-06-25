import { NextRequest, NextResponse } from "next/server";
import { planningApiUrl } from "../../../../lib/planning-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.toString();
  try {
    const response = await fetch(planningApiUrl(`/api/public/brunch/menu${search ? `?${search}` : ""}`), {
      cache: "no-store"
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { ok: false }, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "planning_api_unavailable" }, { status: 503 });
  }
}
