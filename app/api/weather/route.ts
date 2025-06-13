import prisma from "@/data/prisma";
import { getOpenWeatherMapData, getWeatherApiData } from "@/data/weather";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const openWeatherMapData = await getOpenWeatherMapData();
  const weatherApiData = await getWeatherApiData();

  const record = {
    ...data,
    externalSources: [
      {
        id: 0,
        temp: openWeatherMapData.main.temp,
        humd: openWeatherMapData.main.humidity,
        pres: openWeatherMapData.main.pressure,
      },
      {
        id: 1,
        temp: weatherApiData.current.temp_c,
        humd: weatherApiData.current.humidity,
        pres: weatherApiData.current.pressure_mb,
      },
    ],
    weatherCode: weatherApiData.current.condition.code,
    uv: Math.round(weatherApiData.current.uv),
    isDay: weatherApiData.current.is_day == 1,
  };

  await prisma.record.create({
    data: record,
  });
  await fetch(process.env.WEBSOCKET_SERVER_URL!, {
    method: "POST",
    body: JSON.stringify(record),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return new NextResponse();
}

export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get("date");
  const date: Date = dateStr ? new Date(dateStr) : new Date();

  const record = await prisma.record.findFirst({
    where: {
      time: date,
    },
  });
  if (!record) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
  return NextResponse.json(record);
}
