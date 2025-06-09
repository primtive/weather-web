import { calculateWindRose } from "@eunchurn/react-windrose";
import prisma from "@/data/prisma";
import { calculateWeatherCondition, getWeatherCondition } from "./weatherConditions";

type ExternalSource = {
  temp: number
  humd: number
  pres: number
  id: number
}

export type RecordData = {
  temp_h: number | null,
  humd_h: number | null,
  pres_h: number | null,
  temp_e: number | null,
  humd_e: number | null,
  pres_e: number | null,
  aqi: number | null,
  tvoc: number | null,
  eco2: number | null,
  light: number | null,
  wind_dir: number | null,
  wind_speed: number | null,
  rain: number | null,
  time: Date,
  externalSources: ExternalSource[]
  weatherCode: number,
  uv: number,
  isDay: boolean
}

export interface MetricData {
  source: string;
  isExternal: boolean;
  metrics: {
    temp: number;
    humd: number;
    pres: number;
  };
}

export interface AccuracyResult {
  metric: string;
  value: number;
}

const calculateAccuracy = (data: MetricData[]): AccuracyResult[] => {
  const local = data.find((d) => !d.isExternal);
  const externals = data.filter((d) => d.isExternal);

  if (!local || !externals.length) return [];

  const avgMetrics = {
    temp: externals.reduce((sum, e) => sum + e.metrics.temp, 0) / externals.length,
    humd: externals.reduce((sum, e) => sum + e.metrics.humd, 0) / externals.length,
    pres: externals.reduce((sum, e) => sum + e.metrics.pres, 0) / externals.length,
  };

  const metricNames = {
    temp: "Точность температуры",
    humd: "Точность влажности",
    pres: "Точность давления",
  };

  return (Object.keys(avgMetrics) as Array<keyof typeof avgMetrics>).map((key) => {
    const diff = Math.abs(local.metrics[key] - avgMetrics[key]);
    const accuracy = local.metrics[key] && key === "humd"
      ? 100 - diff
      : 100 - (diff / avgMetrics[key] * 100);

    return {
      metric: metricNames[key],
      value: Math.round(accuracy * 10) / 10,
    };
  });
};

export function getWindDirection(angle: number): string {
  // Нормализуем угол в диапазон 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // Определяем направления
  if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'Северный';
  if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'Северо-восточный';
  if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'Восточный';
  if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'Юго-восточный';
  if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'Южный';
  if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'Юго-западный';
  if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'Западный';
  if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) return 'Северо-западный';

  return '?';
}

async function getRecordData(): Promise<RecordData> {
  const latestRecord = await prisma.record.findFirst({
    orderBy: {
      time: 'desc'
    }
  })
  return latestRecord!
}

export async function getData() {
  const recordData = await getRecordData();

  const weatherApiData = recordData.externalSources.find(x => x.id == 0)
  const openWeatherMapData = recordData.externalSources.find(x => x.id == 1)

  const comprasionData: MetricData[] = [
    {
      source: "Локальная станция",
      isExternal: false,
      metrics: {
        temp: recordData.temp_e!,
        humd: recordData.humd_e!,
        pres: recordData.pres_e!,
      },
    },
    {
      source: "WeatherAPI",
      isExternal: true,
      metrics: {
        temp: weatherApiData!.temp,
        humd: weatherApiData!.humd,
        pres: weatherApiData!.pres,
      },
    },
    {
      source: "OpenWeatherMap",
      isExternal: true,
      metrics: {
        temp: openWeatherMapData!.temp,
        humd: openWeatherMapData!.humd,
        pres: openWeatherMapData!.pres,
      },
    },
  ];
  const accuracyData = calculateAccuracy(comprasionData)
  return {
    recordData,
    comprasionData,
    accuracyData,
    // weatherCondition: getWeatherCondition(recordData.weatherCode),
    weatherCondition: calculateWeatherCondition(recordData)
  }
}

export async function getOpenWeatherMapData() {
  const lat = process.env.LAT
  const long = process.env.LONG

  const req = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`)
  return (await req.json())
}

export async function getWeatherApiData() {
  const lat = process.env.LAT
  const long = process.env.LONG

  const req = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${long}`)
  return (await req.json())
}