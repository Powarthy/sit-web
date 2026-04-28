import { NextResponse } from "next/server";
import {
  getUpcomingBrunch,
  getWeeklyHighlights,
  getWebsiteHighlights,
  readPlanningHighlights
} from "../../../../lib/planning-highlights";

const getTokenFromRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim();
};

export async function GET(request: Request) {
  const expectedToken = process.env.PLANNING_SYNC_TOKEN;
  const token = getTokenFromRequest(request);

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [raw, weekly, brunch, merged] = await Promise.all([
    readPlanningHighlights(),
    getWeeklyHighlights(),
    getUpcomingBrunch(),
    getWebsiteHighlights()
  ]);

  return NextResponse.json({
    ok: true,
    generatedAt: raw.generatedAt,
    total: raw.highlights.length,
    weeklyCount: weekly.length,
    brunch: brunch ?? null,
    weekly,
    merged
  });
}
