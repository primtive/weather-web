import { getTimelineData } from "@/data/db";
import { TimelineParam } from "@/data/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode") as TimelineParam;
  const timelineData = await getTimelineData(mode);
  return NextResponse.json(timelineData);
}
