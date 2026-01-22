"use client";
import { DashboardData, nullRecordData, RecordData } from "@/data/types";
import { getDashboardData } from "@/data/weather";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner"

interface WeatherContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  dashboardData: DashboardData | null;
  setRecordData: (data: RecordData) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [recordData, setRecordData] = useState<RecordData>(nullRecordData);
  const dashboardData = useMemo(() => {
    return recordData && getDashboardData(recordData);
  }, [recordData]);


  useEffect(() => {
    const fetchData = async () => {
      if (selectedDate) {
        const req = await fetch(`/api/weather?date=${selectedDate.toISOString()}`)
        if (req.status !== 200) {
          toast('/api/weather error')
          return
        }
        const recordData = await req.json() as RecordData
        setRecordData(recordData);
      }
    };
    fetchData();
  }, [selectedDate]);

  return (
    <WeatherContext.Provider value={{ selectedDate, setSelectedDate, dashboardData, setRecordData }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};