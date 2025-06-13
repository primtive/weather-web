"use client"
import React from "react";
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


// Кастомный Tooltip для отображения даты
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload.date;
    return (
      <div className="custom-tooltip">
        <p>{format(date, "yyyy-MM-dd HH:mm", { locale: ru })}</p>
      </div>
    );
  }
  return null;
};

const Timeline = ({ data }: { data: { date: Date, value: any }[] }) => {
  const { setSelectedDate } = useWeather();

  return (
    <div style={{ width: "100%", height: 100 }}>
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
          <Tooltip content={<CustomTooltip />} />
          <Area
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