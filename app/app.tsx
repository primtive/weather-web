"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import React from "react";
import { DataDownload } from "@/components/data-download";
import Timeline from "@/components/timeline";
import Dashboard from "./dashboard";
import { format, addMinutes } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useWeather } from "@/contexts/WeatherContext";
import { useWS } from "@/contexts/WebSocketContext";
import { DashboardData, TimelineData } from "@/data/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AppProps = {
  timelineData: TimelineData;
  initDashboardData: DashboardData;
}

export default function App({ timelineData, initDashboardData }: AppProps) {

  const { dashboardData } = useWeather();
  const { isConnected, connect, disconnect } = useWS();

  return (
    <div className="flex">
      {/* Main content */}
      <main className="flex-1 p-8 mx-0 lg:mx-10 2xl:mx-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold leading-6">
              Метеорологическая панель
            </h1>
            <p className=" mt-2 ">
              Последнее обновление: {format(addMinutes(initDashboardData.recordData.time, 300), 'dd MMMM yyyy, HH:mm:ss', { locale: ru })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DataDownload />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex gap-5 mb-5">
          <Timeline data={timelineData} />
          <div className="space-y-3">
            <div>
              <p>Выбранная дата:</p>
              {format(dashboardData?.recordData.time || initDashboardData.recordData.time, 'dd MMMM yyyy, HH:mm:ss', { locale: ru })} <br />
            </div>
            <div className="flex">
              <div className="flex items-center space-x-2">
                <Switch id="realtime" checked={isConnected} onCheckedChange={(val) => val ? connect() : disconnect()} />
                <Label htmlFor="realtime">Обновлять в реальном времени</Label>
              </div>
            </div>
          </div>
        </div>


        <Dashboard data={dashboardData || initDashboardData} />

      </main >
    </div >
  );
}