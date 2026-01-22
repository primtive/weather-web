"use client"
import React, { use, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

import { useWeather } from "@/contexts/WeatherContext";
import { da, ru } from 'date-fns/locale';
import { TimelineParam, TimelineRecord } from "@/data/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Undo } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";


// Кастомный Tooltip для отображения даты
const CustomTooltip = ({ active, payload, displayData }: any) => {
  if (active && payload && payload.length) {
    const timeNum = payload[0].payload.time;
    return (
      <div className="custom-tooltip">
        <p>{format(new Date(timeNum), "d MMM HH:mm", { locale: ru })}</p>
        {displayData &&
          <p>{payload[0].payload.value}</p>}
      </div>
    );
  }
  return null;
};

type TimelineProps = {
  data: TimelineRecord[];
  mode: TimelineParam;
};

const Timeline = ({ data, mode }: TimelineProps) => {
  const { setSelectedDate } = useWeather();
  const { setEnabled } = useEvents();
  const [refAreaLeft, setRefAreaLeft] = React.useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = React.useState<number | null>(null);
  const [left, setLeft] = React.useState<number | string>('dataMin');
  const [right, setRight] = React.useState<number | string>('dataMax');
  const [zoomed, setZoomed] = React.useState<boolean>(false);
  const [innerData, setInnerData] = React.useState<TimelineRecord[]>([]);

  function zoom() {

    setRefAreaLeft(null);
    setRefAreaRight(null);
    if (refAreaLeft === refAreaRight || refAreaRight === null
    ) {
      setEnabled(false);
      setSelectedDate(new Date(refAreaLeft!))
      return;
    }

    setZoomed(true);
    // xAxis domain
    if (refAreaLeft! > refAreaRight) {
      setLeft(refAreaRight);
      setRight(refAreaLeft!);
      return
    }
    setLeft(refAreaLeft!);
    setRight(refAreaRight);
  }

  function unzoom() {
    setLeft('dataMin');
    setRight('dataMax');
    setZoomed(false);
    setInnerData([])
  }

  useEffect(() => {
    fetch(`/api/timeline?mode=${mode}&min=${left}&max=${right}`)
      .then(response => response.json())
      .then(data => {
        setInnerData(data)
      });
  }, [left, mode])

  return <>
    <div className={cn('w-full relative', mode ? '' : 'h-[100]')}>
      {zoomed && <Button
        onClick={unzoom}
        variant={'outline'}
        className="w-8 absolute top-0 left-0 m-2 z-10"
      >
        <Undo className="w-4 h-4" />
      </Button>}
      <ResponsiveContainer>
        <AreaChart
          data={zoomed ? innerData || data : data}
          // margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onClick={(e) => {
            if (e && e.activePayload) {
              const date = e.activePayload[0].payload.date;
              setSelectedDate(date);
            }
          }}
          onMouseDown={(e) => { setRefAreaLeft(typeof e?.activeLabel === "number" ? e.activeLabel : null) }}
          onMouseMove={(e) => refAreaLeft && setRefAreaRight(typeof e?.activeLabel === "number" ? e.activeLabel : null)}
          onMouseUp={zoom}
        >
          <XAxis
            allowDataOverflow
            dataKey="time"
            scale="time"
            type="number"
            domain={[left, right]}
            tickFormatter={(dateStr) => format(dateStr, "d MMM", { locale: ru })}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            hide={true}
            type="number"
          />
          <Tooltip content={<CustomTooltip displayData={mode} />} />
          <Area
            animationDuration={100}
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-1))"
            activeDot={{ r: 6 }}
            dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
            fill="hsl(var(--chart-2))"
          />

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </>
};

export default Timeline;