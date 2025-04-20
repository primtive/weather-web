import prisma from '@/data/prisma';
import { getOpenWeatherMapData, getWeatherApiData } from '@/data/weather';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
) {
  const data = await req.json();

  const openWeatherMapData = await getOpenWeatherMapData()
  const weatherApiData = await getWeatherApiData()

  await prisma.record.create({
    data: {
      ...data, externalSources: [
        {
          id: 0,
          temp: openWeatherMapData.main.temp,
          humd: openWeatherMapData.main.humidity,
          pres: openWeatherMapData.main.pressure
        },
        {
          id: 1,
          temp: weatherApiData.current.temp_c,
          humd: weatherApiData.current.humidity,
          pres: weatherApiData.current.pressure_mb
        }
      ],
      weatherCode: weatherApiData.current.condition.code,
      uv: Math.round(weatherApiData.current.uv),
      isDay: weatherApiData.current.is_day == 1
    }
  })
  return new NextResponse();
}