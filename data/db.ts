import prisma from "@/data/prisma";
import { RecordData, TimelineData } from "./types";

export async function getTimelineData(): Promise<TimelineData> {
  const records = await prisma.record.findMany({
    orderBy: {
      time: "asc",
    },
    select: {
      time: true,
    },
  });

  return records.map((record) => ({
    date: record.time,
    value: 1,
  }));
}

export async function getLastRecordData(): Promise<RecordData> {
  const latestRecord = await prisma.record.findFirst({
    orderBy: {
      time: "desc",
    },
  });
  return latestRecord!;
}
