import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUp,
  CheckCircle,
  CircleHelp,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import Humidity from "@/public/icons/all/humidity.svg"
import Barometer from "@/public/icons/all/barometer.svg"
import Wind5 from "@/public/icons/all/wind-beaufort-5.svg"
import { WeatherIcon } from "@/components/weather-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { TemperatureChart } from "@/components/temperature-chart";
import { WindroseChart } from "@/components/windrose-chart";
import { getData, getWindDirection } from "@/data/weather";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import moment from "moment"
import 'moment/locale/ru'
import { cn } from "@/lib/utils";
import { getWeatherConditionIcon } from "@/data/weatherConditions";
import { DataDownload } from "@/components/data-download";
moment.locale('ru')

export default async function Frame() {

  const windroseData: any = [];
  const { accuracyData, comprasionData, recordData, weatherCondition } = await getData();
  return (
    <div className="flex">
      {/* Main content */}
      <main className="flex-1 p-8 mx-0 lg:mx-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold leading-6">
              Метеорологическая панель
            </h1>
            <p className=" mt-2 ">
              Последнее обновление: {moment(recordData.time).format('DD MMMM YYYY, HH:mm:ss')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DataDownload />
            <ThemeToggle />
          </div>
        </header>

        {/* Weather cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 justify-between">
          <Card className="bg-gradient-main border-0 w-full text-background flex items-center text-center min-w-[150px]">
            <CardContent>
              <Image src={`/icons/all/${getWeatherConditionIcon(recordData.weatherCode, recordData.isDay)}.svg`}
                alt=''
                width={250}
                height={250}
                className='drop-shadow-md mb-5'
              ></Image>
              <p className="text-5xl font-normal">{recordData.temp_e} °C</p>
              <p className="text-lg font-light">{weatherCondition}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p>Влажность</p>
                    <h2 className="text-3xl font-bold mt-1">{recordData.humd_e}%</h2>
                  </div>
                  <WeatherIcon src={Humidity} />
                </div>
                <div className="flex items-center mt-6 gap-1">
                  Уровень дождя:
                  <span className="font-bold">
                    {recordData.rain}
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
                    <h2 className="text-3xl font-bold mt-1">{recordData.pres_e} гПа</h2>
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
                    <h2 className="text-3xl font-bold mt-1">5 м/с</h2>
                  </div>
                  <WeatherIcon src={Wind5} />
                </div>
                <div className="flex items-center mt-6">
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
                    <h2 className="text-3xl font-bold mt-1">{recordData.light} лк</h2>
                  </div>
                  <WeatherIcon src={`/icons/all/uv-index-${recordData.uv}.svg`} />
                </div>
                <div className="flex items-center mt-6 gap-1">
                  УФ индекс:
                  <span className="font-bold">
                    {recordData.uv}
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
                  <h2 className="text-2xl font-bold mt-1">{recordData.aqi}</h2>
                  <p className="text-sm flex items-center gap-2 text-green-700"><CheckCircle width={14} height={14} />Норма</p>
                </div>
                <div>
                  <p>Органические соединения</p>
                  <h2 className="text-2xl font-bold mt-1">{recordData.tvoc} ppb</h2>
                </div>
                <div>
                  <p>Концетрация CO2</p>
                  <h2 className="text-2xl font-bold mt-1">{recordData.eco2} ppm</h2>
                </div>
                <div>
                  <p>Температура</p>
                  <h2 className="text-2xl font-bold mt-1">{recordData.temp_h} °C</h2>
                </div>
                <div>
                  <p>Влажность</p>
                  <h2 className="text-2xl font-bold mt-1">{recordData.humd_h}%</h2>
                </div>
                <div>
                  <p>Давление</p>
                  <h2 className="text-2xl font-bold mt-1">{recordData.pres_h} гПа</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent>
              <h2 className="mb-6 font-bold text-xl  ">
                Сравнение данных
              </h2>
              <div className="flex flex-wrap gap-6 justify-between">
                {comprasionData.map((station, index) => (
                  <div className="min-w-[200px]" key={index}>
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
                          {station.metrics.temp || '?'} °C
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base">Влажность</span>
                        <span className=" font-bold text-base">
                          {station.metrics.humd || '?'}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base">Давление</span>
                        <span className=" font-bold text-base">
                          {station.metrics.pres || '?'} гПа
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accuracy Analysis */}
          <Card className="border  shadow-sm">
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

          {/* <Card className="border  shadow-sm"> */}
          {/* <CardHeader className="pb-0 flex flex-wrap md:flex-nowrap justify-between items-center"> */}
          {/* <CardTitle className="text-lg font-semibold"> */}
          {/* Температурный тренд */}
          {/* </CardTitle> */}
          {/* <ToggleGroup type="single" defaultValue="week"> */}
          {/* <ToggleGroupItem value="week"> */}
          {/* Неделя */}
          {/* </ToggleGroupItem> */}
          {/* <ToggleGroupItem value="month"> */}
          {/* Месяц */}
          {/* </ToggleGroupItem> */}
          {/* </ToggleGroup> */}
          {/* </CardHeader> */}
          {/* <CardContent className="p-6"> */}
          {/* <TemperatureChart /> */}
          {/* </CardContent> */}
          {/* </Card> */}

          {/* Wind Pattern */}
          <WindroseChart windroseData={windroseData} />
        </div>
      </main>
    </div>
  );
}