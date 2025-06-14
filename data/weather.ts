import { MetricData, AccuracyResult, RecordData, DashboardData } from "./types";
import { calculateWeatherCondition } from "./weatherConditions";

const calculateAccuracy = (data: MetricData[]): AccuracyResult[] => {
  const local = data.find((d) => !d.isExternal);
  const externals = data.filter((d) => d.isExternal);

  if (!local || !externals.length) return [];

  const avgMetrics = {
    temp:
      externals.reduce((sum, e) => sum + e.metrics.temp!, 0) / externals.length,
    humd:
      externals.reduce((sum, e) => sum + e.metrics.humd!, 0) / externals.length,
    pres:
      externals.reduce((sum, e) => sum + e.metrics.pres!, 0) / externals.length,
  };

  const metricNames = {
    temp: "Точность температуры",
    humd: "Точность влажности",
    pres: "Точность давления",
  };

  return (Object.keys(avgMetrics) as Array<keyof typeof avgMetrics>).map(
    (key) => {
      if (local.metrics[key] === null)
        return { metric: metricNames[key], value: 0 };
      const diff = Math.abs(local.metrics[key] - avgMetrics[key]);
      const accuracy =
        local.metrics[key] && key === "humd"
          ? 100 - diff
          : 100 - (diff / avgMetrics[key]) * 100;

      return {
        metric: metricNames[key],
        value: Math.round(accuracy * 10) / 10,
      };
    }
  );
};

export function getWindDirection(angle: number): string {
  // Нормализуем угол в диапазон 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // Определяем направления
  if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return "Северный";
  if (normalizedAngle >= 22.5 && normalizedAngle < 67.5)
    return "Северо-восточный";
  if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return "Восточный";
  if (normalizedAngle >= 112.5 && normalizedAngle < 157.5)
    return "Юго-восточный";
  if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return "Южный";
  if (normalizedAngle >= 202.5 && normalizedAngle < 247.5)
    return "Юго-западный";
  if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return "Западный";
  if (normalizedAngle >= 292.5 && normalizedAngle < 337.5)
    return "Северо-западный";

  return "?";
}

export function getDashboardData(recordData: RecordData): DashboardData {
  const weatherApiData = recordData.externalSources.find((x) => x.id == 0);
  const openWeatherMapData = recordData.externalSources.find((x) => x.id == 1);

  const comprasionData: MetricData[] = [
    {
      source: "Локальная станция",
      isExternal: false,
      metrics: {
        temp: recordData.temp_e,
        humd: recordData.humd_e,
        pres: recordData.pres_e,
      },
    },
    {
      source: "WeatherAPI",
      isExternal: true,
      metrics: {
        temp: weatherApiData?.temp || null,
        humd: weatherApiData?.humd || null,
        pres: weatherApiData?.pres || null,
      },
    },
    {
      source: "OpenWeatherMap",
      isExternal: true,
      metrics: {
        temp: openWeatherMapData?.temp || null,
        humd: openWeatherMapData?.humd || null,
        pres: openWeatherMapData?.pres || null,
      },
    },
  ];
  const accuracyData = calculateAccuracy(comprasionData);
  return {
    recordData,
    comprasionData,
    accuracyData,
    // weatherCondition: getWeatherCondition(recordData.weatherCode),
    weatherCondition: calculateWeatherCondition(recordData),
  };
}

export async function getOpenWeatherMapData() {
  const lat = process.env.LAT;
  const long = process.env.LONG;

  const req = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`
  );
  return await req.json();
}

export async function getWeatherApiData() {
  const lat = process.env.LAT;
  const long = process.env.LONG;

  const req = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${long}`
  );
  return await req.json();
}

/**
 * Рассчитывает ощущаемую температуру (feels-like) на основе:
 * @param temperature - температура в °C
 * @param humidity - влажность в % (0-100)
 * @param windSpeed - скорость ветра в км/ч
 * @returns ощущаемая температура в °C
 */
export function calculateFeelsLike(
  temperature: number,
  humidity: number = 50,
  windSpeed: number = 0
): number {
  // Если очень жарко и влажно → считаем Heat Index
  if (temperature >= 20 && humidity >= 40) {
    return calculateHeatIndex(temperature, humidity);
  }
  // Если холодно и ветрено → считаем Wind Chill
  else if (temperature <= 10 && windSpeed >= 5) {
    return calculateWindChill(temperature, windSpeed);
  }
  // Иначе возвращаем фактическую температуру
  return temperature;
}

/**
 * Рассчитывает Heat Index (ощущаемую температуру в жару)
 * Формула: https://en.wikipedia.org/wiki/Heat_index
 */
function calculateHeatIndex(temperature: number, humidity: number): number {
  const c1 = -8.78469475556;
  const c2 = 1.61139411;
  const c3 = 2.33854883889;
  const c4 = -0.14611605;
  const c5 = -0.012308094;
  const c6 = -0.0164248277778;
  const c7 = 0.002211732;
  const c8 = 0.00072546;
  const c9 = -0.000003582;

  const T = temperature;
  const R = humidity;

  const heatIndex =
    c1 +
    c2 * T +
    c3 * R +
    c4 * T * R +
    c5 * T * T +
    c6 * R * R +
    c7 * T * T * R +
    c8 * T * R * R +
    c9 * T * T * R * R;

  return Math.round(heatIndex * 10) / 10; // Округляем до 1 знака после запятой
}

/**
 * Рассчитывает Wind Chill (ощущаемую температуру на ветру)
 * Формула: https://en.wikipedia.org/wiki/Wind_chill
 */
function calculateWindChill(temperature: number, windSpeed: number): number {
  const windChill =
    13.12 +
    0.6215 * temperature -
    11.37 * Math.pow(windSpeed, 0.16) +
    0.3965 * temperature * Math.pow(windSpeed, 0.16);

  return Math.round(windChill * 10) / 10; // Округляем до 1 знака после запятой
}
