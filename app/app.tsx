"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import React, { useEffect } from "react";
import { DataDownload } from "@/components/data-download";
import Dashboard from "./dashboard";
import { format, addMinutes } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useWeather } from "@/contexts/WeatherContext";
import { RawWindroseData, RecordData, TimelineParam, TimelineRecord } from "@/data/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator } from "@/components/ui/select";
import Timeline from "@/components/timeline";
import { useEvents } from "@/contexts/EventContext";

type AppProps = {
  initTimelineData: TimelineRecord[];
  initRecordData: RecordData;
  windroseData: RawWindroseData;
}

export default function App({ initTimelineData, initRecordData, windroseData }: AppProps) {

  const [selectedMode, setSelectedMode] = React.useState<TimelineParam | 'none'>(null);
  const [timelineData, setTimelineData] = React.useState<TimelineRecord[]>(initTimelineData);

  useEffect(() => {
    if (selectedMode && selectedMode !== 'none') {
      fetch(`/api/timeline?mode=${selectedMode}`)
        .then(response => response.json())
        .then(data => {
          setTimelineData(data)
        });
    } else {
      setTimelineData(initTimelineData);
      setSelectedMode(null)
    }
  }, [selectedMode]);

  const { dashboardData, setRecordData } = useWeather();
  const { isEnabled, setEnabled } = useEvents();

  useEffect(() => {
    setRecordData(initRecordData);
  }, [])

  return (
    <div className="flex">
      {/* Main content */}
      <main className="flex-1 py-8 mx-4 lg:mx-10 2xl:mx-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold leading-6">
              Метеорологическая панель
            </h1>
            <p className=" mt-2 " suppressHydrationWarning>
              Последнее обновление: {format(addMinutes(initRecordData.time, 300), 'dd MMMM yyyy, HH:mm:ss', { locale: ru })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DataDownload />
            <ThemeToggle />
          </div>
        </header>

        <div className="md:flex gap-5 mb-5">
          <Timeline data={timelineData} mode={selectedMode as TimelineParam} />
          {/* <Example data={timelineData} mode={selectedMode as TimelineParam} /> */}
          <div className="space-y-3">
            <div className="flex items-center justify-between md:block">
            <Select value={selectedMode || ''} onValueChange={(mode) => setSelectedMode(mode as TimelineParam | 'none')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите показатель" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Нет</SelectItem>
                  <SelectSeparator></SelectSeparator>
                  <SelectLabel>Показатель</SelectLabel>
                  <SelectItem value="temp_e">Температура</SelectItem>
                  <SelectItem value="humd_e">Влажность</SelectItem>
                  <SelectItem value="pres_e">Давление</SelectItem>
                  <SelectItem value="temp_h">Температура в комнате</SelectItem>
                  <SelectItem value="humd_h">Влажность в комнате</SelectItem>
                  <SelectItem value="pres_h">Давление в комнате</SelectItem>
                  <SelectItem value="aqi">ИКВ</SelectItem>
                  <SelectItem value="tvoc">TVOC</SelectItem>
                  <SelectItem value="eco2">CO2</SelectItem>
                  <SelectItem value="light">Яркость</SelectItem>
                  <SelectItem value="wind_speed">Скорость ветра</SelectItem>
                  <SelectItem value="rain">Уровень дождя</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div suppressHydrationWarning>
              <p>Выбранная дата:</p>
              {format(dashboardData!.recordData.time, 'dd MMMM yyyy, HH:mm:ss', { locale: ru })} <br />
            </div>
            </div>
            <div className="flex">
              <div className="flex items-center space-x-2">
                <Switch id="realtime" checked={isEnabled} onCheckedChange={setEnabled} />
                <Label htmlFor="realtime">Обновлять в реальном времени</Label>
              </div>
            </div>
          </div>
        </div>


        <Dashboard data={dashboardData!} windroseData={windroseData} />

      </main >
    </div >
  );
}