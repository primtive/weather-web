import { getTimelineData } from "@/data/db";
import { TimelineParam } from "@/data/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let mode = req.nextUrl.searchParams.get("mode");
  const minDate = req.nextUrl.searchParams.get("min");
  const maxDate = req.nextUrl.searchParams.get("max");
  if (mode === 'null') mode = null
  const timelineData = minDate && maxDate
    ?
    await getTimelineData(mode as TimelineParam, parseInt(minDate), parseInt(maxDate))
    :
    await getTimelineData(mode as TimelineParam);
  return NextResponse.json(timelineData);
}
