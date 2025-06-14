"use client"
import React, { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useWeather } from "@/contexts/WeatherContext";
import { ru } from 'date-fns/locale';
import { TimelineParam } from "@/data/types";
import { cn } from "@/lib/utils";


// Кастомный Tooltip для отображения даты
const CustomTooltip = ({ active, payload, displayData }: any) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload.date;
    return (
      <div className="custom-tooltip">
        <p>{format(date, "d MMM HH:mm", { locale: ru })}</p>
        {displayData &&
          <p>{payload[0].payload.value}</p>}
      </div>
    );
  }
  return null;
};

type TimelineProps = {
  data: { date: Date, value: any }[];
  mode: TimelineParam;
};

const Timeline = ({ data, mode }: TimelineProps) => {
  const { setSelectedDate } = useWeather();

  return (
    <div className={cn('w-full', mode ? '' : 'h-[100]')}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          // margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onClick={(e) => {
            if (e && e.activePayload) {
              const date = e.activePayload[0].payload.date;
              setSelectedDate(date);
            }
          }}
        >
          <XAxis
            dataKey="date"
            scale="time"
            tickFormatter={(dateStr) => format(dateStr, "d MMM", { locale: ru })}
          />
          <YAxis domain={[0, 2]} hide={true} />
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Timeline;