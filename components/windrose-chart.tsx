"use client"

import React from "react";
import { calculateWindRose, Chart } from "@eunchurn/react-windrose";


export const WindroseChart = ({ windroseData }: any) => {


  const { hourly: { wind_direction_10m, wind_speed_10m } } = windroseData;
  const chartData = (
    calculateWindRose({
      direction: wind_direction_10m,
      speed: wind_speed_10m.map((speed: number) => speed / 3.6), // km/h => m/s
    })
  );

  return <Chart
    chartData={chartData}
    responsive
    height={400}
    width={400}
    legendGap={0}
    className="w-fit"
  />
};