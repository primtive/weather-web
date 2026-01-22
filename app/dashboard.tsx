"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUp,
  CheckCircle,
  CircleHelp,
} from "lucide-react";
import Humidity from "@/public/icons/all/humidity.svg"
import Barometer from "@/public/icons/all/barometer.svg"
import { WeatherIcon } from "@/components/weather-icon";
import { WindroseChart } from "@/components/windrose-chart";
import { getWindDirection } from "@/data/weather";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import Counter from "@/components/counter";
import { DashboardData, RawWindroseData } from "@/data/types";
import WeatherWidget from "@/components/weather-widget";

type DashboardProps = {
  data: DashboardData;
  windroseData: RawWindroseData;
}

export default function Dashboard({ data: { accuracyData, comprasionData, recordData, weatherCondition }, windroseData }: DashboardProps) {
  const windSpeed = Math.round(recordData.wind_speed!);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-between">
      <WeatherWidget data={recordData} weatherCondition={weatherCondition} />

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <p>Влажность</p>
                <h2 className="text-3xl font-bold mt-1">
                  <Counter value={recordData.humd_e} />
                  %
                </h2>
              </div>
              <WeatherIcon src={Humidity} />
            </div>
            <div className="flex items-center mt-2 gap-1">
              Уровень дождя:
              <span className="font-bold">
                <Counter value={recordData.rain} />
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><CircleHelp className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent>
                    <p>Влажность сенсора дождя (0-1000)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <p>Давление</p>
                <h2 className="text-3xl font-bold mt-1">
                  <Counter value={recordData.pres_e} /> гПа
                </h2>
                <div className="flex items-center mt-2 gap-1">
                  <span className="font-bold">
                    <Counter value={recordData.pres_e && recordData.pres_e * 0.750062} />
                  </span>
                  мм рт. ст.
                </div>
              </div>
              <WeatherIcon src={Barometer} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <p>Ветер</p>
                <h2 className="text-3xl font-bold mt-1">
                  <Counter value={windSpeed} /> м/с
                </h2>
              </div>
              <WeatherIcon src={`/icons/all/${0 <= windSpeed && windSpeed <= 12 ? `wind-beaufort-${windSpeed}` : 'wind'}.svg`} />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className={cn(`transform rotate-[${recordData.wind_dir || 0}deg]`)} />
              {getWindDirection(recordData.wind_dir || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <p>Солнце</p>
                <h2 className="text-3xl font-bold mt-1">
                  <Counter value={recordData.light} /> лк
                </h2>
              </div>
              <WeatherIcon src={`/icons/all/uv-index-${Math.min(Math.max(recordData.uv, 1), 11)}.svg`} />
            </div>
            <div className="flex items-center mt-2 gap-1">
              УФ индекс:
              <span className="font-bold">
                <Counter value={recordData.uv} />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-home border-0">
        <CardContent>
          <h2 className="text-3xl mb-3">Дом</h2>
          <div className="grid  grid-cols-3 gap-5">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><p>ИКВ</p></TooltipTrigger>
                  <TooltipContent>
                    <p>Индекс качества воздуха</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <h2 className="text-2xl font-bold mt-1">
                <Counter value={recordData.aqi} />
              </h2>
              <p className="text-sm flex items-center gap-2 text-green-700">
                <CheckCircle width={14} height={14} />Норма
              </p>
            </div>
            <div>
              <p>Органические соединения</p>
              <h2 className="text-2xl font-bold mt-1">
                <Counter value={recordData.tvoc} /> ppb
              </h2>
            </div>
            <div>
              <p>Концетрация CO2</p>
              <h2 className="text-2xl font-bold mt-1">
                <Counter value={recordData.eco2} /> ppm
              </h2>
            </div>
            <div>
              <p>Температура</p>
              <h2 className="text-2xl font-bold mt-1">
                <Counter value={recordData.temp_h} /> °C
              </h2>
            </div>
            <div>
              <p>Влажность</p>
              <h2 className="text-2xl font-bold mt-1">
                <Counter value={recordData.humd_h} />%
              </h2>
            </div>
            <div>
              <p>Давление</p>
              <h2 className="text-2xl font-bold mt-1">
                <Counter value={recordData.pres_h} /> гПа
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent>
          <h2 className="mb-6 font-bold text-xl  ">
            Сравнение данных
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-between">
            {comprasionData.map((station, index) => (
              <div className="min-w-[170px] w-full" key={index}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base">
                    {station.source}
                  </span>
                  {station.isExternal && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base">Температура</span>
                    <span className=" font-bold text-base">
                      <Counter value={station.metrics.temp} decimals={1} /> °C
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base">Влажность</span>
                    <span className=" font-bold text-base">
                      <Counter value={station.metrics.humd} />%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base">Давление</span>
                    <span className=" font-bold text-base">
                      <Counter value={station.metrics.pres} /> гПа
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Analysis */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold  ">
            Анализ точности
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {accuracyData.map((item, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className=" ">
                  {item.metric}
                </span>
                <span className=" ">
                  {item.value}%
                </span>
              </div>
              <Progress
                value={item.value}
                className="h-2 bg-blue-100"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Wind Pattern */}
      <WindroseChart windroseData={windroseData} />
    </div>
  )
}