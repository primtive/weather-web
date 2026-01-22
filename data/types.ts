import { WeatherCondition } from "./weatherConditions";

export type RawWindroseData = {
  direction: number[];
  speed: number[];
};

export type TimelineParam =
  | null
  | "temp_h"
  | "temp_e"
  | "humd_h"
  | "humd_e"
  | "pres_h"
  | "pres_e"
  | "aqi"
  | "tvoc"
  | "eco2"
  | "light"
  | "wind_speed"
  | "rain";

export type TimelineRecord = {
  time: number;
  value: number;
};

export type DashboardData = {
  recordData: RecordData;
  comprasionData: MetricData[];
  accuracyData: AccuracyResult[];
  weatherCondition: WeatherCondition;
};

export interface MetricData {
  source: string;
  isExternal: boolean;
  metrics: {
    temp: number | null;
    humd: number | null;
    pres: number | null;
  };
}

export interface AccuracyResult {
  metric: string;
  value: number;
}

type ExternalSource = {
  temp: number;
  humd: number;
  pres: number;
  id: number;
};

export type RecordData = {
  temp_h: number | null;
  humd_h: number | null;
  pres_h: number | null;
  temp_e: number | null;
  humd_e: number | null;
  pres_e: number | null;
  aqi: number | null;
  tvoc: number | null;
  eco2: number | null;
  light: number | null;
  wind_dir: number | null;
  wind_speed: number | null;
  rain: number | null;
  time: Date;
  externalSources: ExternalSource[];
  weatherCode: number;
  uv: number;
  isDay: boolean;
};

export const nullRecordData: RecordData = {
  temp_h: null,
  humd_h: null,
  pres_h: null,
  temp_e: null,
  humd_e: null,
  pres_e: null,
  aqi: null,
  tvoc: null,
  eco2: null,
  light: null,
  wind_dir: null,
  wind_speed: null,
  rain: null,
  time: new Date(),
  externalSources: [],
  weatherCode: 0,
  uv: 0,
  isDay: true,
};
