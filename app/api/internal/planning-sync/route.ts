import { NextResponse } from "next/server";
import {
  PlanningSyncPayload,
  validatePlanningPayload,
  writePlanningHighlights
} from "../../../../lib/planning-highlights";

const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim();
};

export async function POST(request: Request) {
  const expectedToken = process.env.PLANNING_SYNC_TOKEN;
  const token = getTokenFromRequest(request);

  if (!expectedToken || token !== expectedToken) {
    console.warn("[planning-sync] Unauthorized attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: PlanningSyncPayload;

  try {
    payload = (await request.json()) as PlanningSyncPayload;
  } catch (error) {
    console.error("[planning-sync] Invalid JSON payload", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { isValid, errors } = validatePlanningPayload(payload);

  if (!isValid) {
    console.error("[planning-sync] Validation failed", errors);
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
  }

  await writePlanningHighlights(payload);
  console.info("[planning-sync] Highlights updated", {
    generatedAt: payload.generatedAt,
    count: payload.highlights.length
  });

  return NextResponse.json({ status: "ok" });
}
