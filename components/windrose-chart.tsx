"use client";

import React, { useMemo } from "react";
import { calculateWindRose, Chart, ChartData } from "@eunchurn/react-windrose";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { RawWindroseData } from "@/data/types";

async function getWindroseData() {
  const req = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=51.767830&longitude=13.41&hourly=wind_speed_10m,wind_direction_10m"
  );
  const data = await req.json();
  const {
    hourly: { wind_direction_10m, wind_speed_10m },
  } = data;
  const chartData = calculateWindRose({
    direction: wind_direction_10m,
    speed: wind_speed_10m.map((speed: number) => speed / 3.6), // km/h => m/s
  });
  return chartData;
}

export const WindroseChart = ({ windroseData }: { windroseData: RawWindroseData }) => {
  const [mode, setMode] = React.useState("local");
  const [fetched, setFetched] = React.useState(false);
  const [officialChartData, setOfficialChartData] = React.useState<ChartData[]>(
    calculateWindRose({ direction: [], speed: [] })
  );
  const localChartData = useMemo(() => calculateWindRose(windroseData), [windroseData]);
  React.useEffect(() => {
    if (mode == "official" && !fetched) {
      setFetched(true);
      getWindroseData().then((data) => {
        setOfficialChartData(data);
      });
    }
  }, [mode]);

  return (
    <>
      <Card className="border  shadow-sm">
        <CardHeader className="pb-0 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold  ">
            Ветровой режим (24ч)
          </CardTitle>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => setMode(val)}
          >
            <ToggleGroupItem value="local">Станция</ToggleGroupItem>
            <ToggleGroupItem value="official">Интернет</ToggleGroupItem>
          </ToggleGroup>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Chart
            chartData={mode == "local" ? localChartData : officialChartData}
            responsive
            height={550}
            width={550}
            legendGap={20}
            className="ml-[-60px] scale-[0.9] my-[-60px]"
          />
        </CardContent>
      </Card>
    </>
  );
};


