import prisma from "@/data/prisma";
import {
  RecordData,
  TimelineRecord,
  TimelineParam,
  RawWindroseData,
} from "./types";
import { Prisma } from "@prisma/client";


const TIMELINE_SIZE = 100;

export async function getTimelineData(
  mode: TimelineParam,
  minDate?: number,
  maxDate?: number,
): Promise<TimelineRecord[]> {

  let min, max;

  if (minDate && maxDate) {
    min = minDate;
    max = maxDate;
  } else {
    const dateRange = await prisma.record.aggregate({
      _min: { time: true },
      _max: { time: true },
    });
    min = dateRange._min.time!.getTime();
    max = dateRange._max.time!.getTime();
  }

  const totalDuration = max - min;
  const interval = totalDuration / (TIMELINE_SIZE - 1);

  const targetDates = [];
  for (let i = 0; i < TIMELINE_SIZE; i++) {
    targetDates.push(new Date(min + interval * i));
  }

  const select = {
    time: true,
    ...(mode ? { [mode]: true } : {}),
  } satisfies Prisma.RecordSelect;

  const allRecords = await prisma.record.findMany({
    where: {
      time: {
        gt: new Date(min),
        lt: new Date(max)
      }
    },
    select,
    orderBy: {
      time: 'asc'
    }
  });

  if (allRecords.length <= TIMELINE_SIZE) {
    return allRecords.map(r => ({
      time: r.time.getTime(),
      value: mode
        ? (r as Record<string, any>)[mode]
        : 1
    }))
  }

  const results = targetDates.map(targetDate => {
    let closestRecord: (typeof allRecords)[number] | null = null;
    let smallestDiff = Infinity;

    for (const record of allRecords) {
      if (!record.time) continue;

      const diff = Math.abs(record.time.getTime() - targetDate.getTime());

      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestRecord = record;
      }
    }

    return {
      time: closestRecord!.time.getTime(),
      value: mode && closestRecord
        ? (closestRecord as Record<string, any>)[mode]
        : 1
    };
  }).filter(Boolean);

  // Drop duplicates by 'time'
  const uniqueResults = Array.from(
    new Map(results.map(item => [item.time, item])).values()
  );

  return uniqueResults;
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
