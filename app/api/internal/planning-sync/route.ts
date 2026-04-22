import { NextResponse } from "next/server";
import {
  PlanningSyncPayload,
  validatePlanningPayload,
  writePlanningHighlights,
  readPlanningHighlights
} from "../../../../lib/planning-highlights";

const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim();
};

// GET de test pour vérifier que la route existe
export async function GET() {
  const data = await readPlanningHighlights();
  return NextResponse.json({ ok: true, generatedAt: data.generatedAt, count: data.highlights.length });
}

export async function POST(request: Request) {
  const expectedToken = process.env.PLANNING_SYNC_TOKEN;
  const token = getTokenFromRequest(request);

  if (!expectedToken) {
    return NextResponse.json({ error: "Server misconfigured: token not set" }, { status: 500 });
  }

  if (token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: PlanningSyncPayload;

  try {
    payload = (await request.json()) as PlanningSyncPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { isValid, errors } = validatePlanningPayload(payload);

  if (!isValid) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
  }

  await writePlanningHighlights(payload);

  return NextResponse.json({ status: "ok" });
}
