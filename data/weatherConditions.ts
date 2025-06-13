import { RecordData } from "./types";

export interface WeatherCondition {
  text: string;
  code: number;
  icon_day: string;
  icon_night: string;
  favicon_day?: string;
  favicon_night?: string;
}

const weatherConditions: WeatherCondition[] = [
  // with favicons
  {
    text: "Ясно", code: 1000, icon_day: "clear-day", icon_night: "clear-night",
    favicon_day: 'sun', favicon_night: 'moon'
  },
  {
    text: "Переменная облачность", code: 1006, icon_day: "partly-cloudy-day", icon_night: "partly-cloudy-night",
    favicon_day: 'cloud-sun', favicon_night: 'cloud-moon'
  },
  {
    text: "Пасмурно", code: 1009, icon_day: "partly-cloudy-day", icon_night: "partly-cloudy-night",
    favicon_day: 'cloud', favicon_night: 'cloud'
  },
  {
    text: "Дождь", code: 1066, icon_day: "rain", icon_night: "rain",
    favicon_day: 'umbrella', favicon_night: 'umbrella'
  },
  // without favicons
  { text: "Преимущественно ясно", code: 1003, icon_day: "clear-day", icon_night: "clear-night" },
  { text: "Туман", code: 1030, icon_day: "fog-day", icon_night: "fog-night" },
  { text: "Легкий туман", code: 1135, icon_day: "mist", icon_night: "mist" },
  { text: "Плотный туман", code: 1147, icon_day: "fog", icon_night: "fog" },
  { text: "Легкий дождь", code: 1063, icon_day: "partly-cloudy-day-rain", icon_night: "partly-cloudy-night-rain" },
  { text: "Дождь", code: 1066, icon_day: "rain", icon_night: "rain" },
  { text: "Сильный дождь", code: 1069, icon_day: "rain", icon_night: "rain" },
  { text: "Легкий моросящий дождь", code: 1072, icon_day: "drizzle", icon_night: "drizzle" },
  { text: "Умеренный моросящий дождь", code: 1087, icon_day: "drizzle", icon_night: "drizzle" },
  { text: "Легкий замерзающий дождь", code: 1114, icon_day: "sleet", icon_night: "sleet" },
  { text: "Умеренный замерзающий дождь", code: 1117, icon_day: "sleet", icon_night: "sleet" },
  { text: "Легкий снег", code: 1150, icon_day: "partly-cloudy-day-snow", icon_night: "partly-cloudy-night-snow" },
  { text: "Умеренный снег", code: 1153, icon_day: "snow", icon_night: "snow" },
  { text: "Сильный снег", code: 1168, icon_day: "snow", icon_night: "snow" },
  { text: "Легкий снег с дождем", code: 1171, icon_day: "partly-cloudy-day-sleet", icon_night: "partly-cloudy-night-sleet" },
  { text: "Умеренный снег с дождем", code: 1180, icon_day: "sleet", icon_night: "sleet" },
  { text: "Легкий ливень", code: 1183, icon_day: "partly-cloudy-day-rain", icon_night: "partly-cloudy-night-rain" },
  { text: "Умеренный ливень", code: 1186, icon_day: "rain", icon_night: "rain" },
  { text: "Сильный ливень", code: 1189, icon_day: "rain", icon_night: "rain" },
  { text: "Легкий снежный ливень", code: 1192, icon_day: "snow", icon_night: "snow" },
  { text: "Умеренный снежный ливень", code: 1195, icon_day: "snow", icon_night: "snow" },
  { text: "Сильный снежный ливень", code: 1198, icon_day: "snow", icon_night: "snow" },
  { text: "Легкая гроза", code: 1201, icon_day: "thunderstorms-day", icon_night: "thunderstorms-night" },
  { text: "Умеренная гроза", code: 1204, icon_day: "thunderstorms", icon_night: "thunderstorms" },
  { text: "Сильная гроза", code: 1207, icon_day: "thunderstorms", icon_night: "thunderstorms" },
  { text: "Легкая гроза с дождем", code: 1210, icon_day: "thunderstorms-day-rain", icon_night: "thunderstorms-night-rain" },
  { text: "Умеренная гроза с дождем", code: 1213, icon_day: "thunderstorms-rain", icon_night: "thunderstorms-rain" },
  { text: "Сильная гроза с дождем", code: 1216, icon_day: "thunderstorms-rain", icon_night: "thunderstorms-rain" },
  { text: "Легкая гроза со снегом", code: 1219, icon_day: "thunderstorms-day-snow", icon_night: "thunderstorms-night-snow" },
  { text: "Умеренная гроза со снегом", code: 1222, icon_day: "thunderstorms-snow", icon_night: "thunderstorms-snow" },
  { text: "Сильная гроза со снегом", code: 1225, icon_day: "thunderstorms-snow", icon_night: "thunderstorms-snow" },
  { text: "Легкий ледяной дождь", code: 1237, icon_day: "hail", icon_night: "hail" },
  { text: "Умеренный ледяной дождь", code: 1240, icon_day: "hail", icon_night: "hail" },
  { text: "Легкий снегопад", code: 1243, icon_day: "snow", icon_night: "snow" },
  { text: "Умеренный снегопад", code: 1246, icon_day: "snow", icon_night: "snow" },
  { text: "Пыльная буря", code: 1252, icon_day: "dust-wind", icon_night: "dust-wind" },
  { text: "Гроза", code: 1255, icon_day: "thunderstorms", icon_night: "thunderstorms" },
  { text: "Гроза с градом", code: 1258, icon_day: "thunderstorms-hail", icon_night: "thunderstorms-hail" },
  { text: "Гроза с сильным градом", code: 1261, icon_day: "thunderstorms-hail", icon_night: "thunderstorms-hail" },
  { text: "Шторм", code: 1264, icon_day: "hurricane", icon_night: "hurricane" },
  { text: "Тропический шторм", code: 1273, icon_day: "hurricane", icon_night: "hurricane" },
  { text: "Ураган", code: 1276, icon_day: "hurricane", icon_night: "hurricane" },
  { text: "Торнадо", code: 1279, icon_day: "tornado", icon_night: "tornado" },
  { text: "Вулканический пепел", code: 1282, icon_day: "smoke", icon_night: "smoke" }
];

export function getWeatherCondition(code: number): WeatherCondition {
  return weatherConditions.find(x => x.code == code)!
}

export function getWeatherConditionIcon(code: number, isDay: boolean) {
  const weatherCondition = weatherConditions.find(x => x.code == code)
  return isDay ? weatherCondition?.icon_day : weatherCondition?.icon_night
}


/**
 * Определяет состояние погоды по данным метеостанции.
 * Возможные состояния: Ясно, Переменная облачность, Пасмурно, Дождь
 */
export function calculateWeatherCondition({ humd_e, light, rain }: RecordData): WeatherCondition {

  // Дождь
  if (rain! > 400) return getWeatherCondition(1066); // Дождь

  // Ясно
  if (light! > 400 && humd_e! < 70) return getWeatherCondition(1000); // Ясно

  // Переменная облачность
  if (light! > 100 && humd_e! < 80) return getWeatherCondition(1006); // Переменная облачность

  // Пасмурно
  return getWeatherCondition(1009); // Пасмурно
}