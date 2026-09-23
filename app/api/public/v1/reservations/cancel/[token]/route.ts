import { NextRequest, NextResponse } from "next/server";
import { toquehubReservationsApiUrl } from "../../../../../../../lib/planning-api";

export const dynamic = "force-dynamic";

async function proxy(token: string, method: "GET" | "POST") {
  try {
    const response = await fetch(
      toquehubReservationsApiUrl(
        `/api/public/v1/reservations/cancel/${encodeURIComponent(token)}`,
      ),
      { method, cache: "no-store", redirect: "manual" },
    );
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/html; charset=utf-8",
      },
    });
  } catch {
    return new NextResponse("Reservation service unavailable", { status: 503 });
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  return proxy((await context.params).token, "GET");
}

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  return proxy((await context.params).token, "POST");
}
