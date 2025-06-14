import prisma from "@/data/prisma";
import { RecordData, TimelineRecord, TimelineParam } from "./types";
import { Prisma } from "@prisma/client";

export async function getTimelineData(
  param: TimelineParam
): Promise<TimelineRecord[]> {
  const select = {
    time: true,
    ...(param ? { [param]: true } : {}),
  } satisfies Prisma.RecordSelect;

  const records = await prisma.record.findMany({
    orderBy: {
      time: "asc",
    },
    select,
    ...(param
      ? {
          where: {
            [param]: {
              not: null,
            },
          },
        }
      : {}),
  });

  return records.map((record) => ({
    date: record.time,
    value: param ? (record as Record<string, any>)[param] : 1,
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
