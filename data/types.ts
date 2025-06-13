import { WeatherCondition } from "./weatherConditions";

export type TimelineData = Array<
  {
    date: Date;
    value: number;
  }
>;

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
    temp: number;
    humd: number;
    pres: number;
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