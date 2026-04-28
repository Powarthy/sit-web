import { NextResponse } from "next/server";
import {
  PlanningHoursPayload,
  validatePlanningHours,
  writePlanningHours,
  readPlanningHours
} from "../../../../lib/planning-hours";

const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim();
};

export async function GET() {
  const data = await readPlanningHours();
  return NextResponse.json({ ok: true, generatedAt: data.generatedAt, count: data.days.length, days: data.days });
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

  let payload: PlanningHoursPayload;
  try {
    payload = (await request.json()) as PlanningHoursPayload;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { isValid, errors } = validatePlanningHours(payload);
  if (!isValid) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
  }

  await writePlanningHours(payload);
  return NextResponse.json({ status: "ok" });
}
