import { NextRequest, NextResponse } from "next/server";
import { isEmailCodePreview, issueBrunchCode } from "../../../../lib/brunch-email-verification";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (request.headers.get("sec-fetch-site") === "cross-site" ||
      typeof body?.email !== "string" ||
      (body.locale !== "fr" && body.locale !== "en" && body.locale !== "fi") ||
      (body.companyWebsite != null && body.companyWebsite !== "")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const result = await issueBrunchCode(body.email.trim(), body.locale, isEmailCodePreview(request.nextUrl));
    if (result.status !== 200) return NextResponse.json({ ok: false }, { status: result.status });
    return NextResponse.json(
      { id: result.id, previewCode: result.previewCode },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const failure = error instanceof Error ? error.name : "UnknownError";
    console.error("Brunch verification code request failed", { failure });
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
