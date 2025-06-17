import prisma from "@/data/prisma";
import { RecordData, TimelineRecord, TimelineParam, RawWindroseData } from "./types";
import { Prisma } from "@prisma/client";
import { ChartData } from "@eunchurn/react-windrose";

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

export async function getWindroseData(): Promise<RawWindroseData> {
  const records = await prisma.record.findMany({
    select: {
      wind_dir: true,
      wind_speed: true,
    },
    where: {
      wind_dir: {
        not: null,
      },
      wind_speed: {
        not: null,
      },
      time: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });
  return {
    direction: records.map((record) => record.wind_dir!),
    speed: records.map((record) => record.wind_speed! / 3.6),
  };
}
