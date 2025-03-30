import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CheckCircle,
  Download,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import Humidity from "@/public/icons/all/humidity.svg"
import Barometer from "@/public/icons/all/barometer.svg"
import ClearDay from "@/public/icons/all/clear-day.svg"
import Wind5 from "@/public/icons/all/wind-beaufort-5.svg"
import AirQuality from "@/public/icons/all/smoke.svg"
import { WeatherIcon } from "@/components/weather-icon";
import { DirectionArrow } from "@/components/direction-arrow";
import { ThemeToggle } from "@/components/theme-toggle";
import { TemperatureChart } from "@/components/temperature-chart";
import { WindroseChart } from "@/components/windrose-chart";
import { getWindroseData } from "@/data/weather";

export default async function Frame() {

  const weatherData = [
    {
      source: "Локальная станция",
      isExternal: false,
      metrics: [
        { name: "Температура", value: "24°C" },
        { name: "Влажность", value: "65%" },
        { name: "Давление", value: "1013 гПа" },
      ],
    },
    {
      source: "WeatherAPI",
      isExternal: true,
      metrics: [
        { name: "Температура", value: "23.5°C" },
        { name: "Влажность", value: "63%" },
        { name: "Давление", value: "1012 гПа" },
      ],
    },
    {
      source: "OpenWeatherMap",
      isExternal: true,
      metrics: [
        { name: "Температура", value: "24.2°C" },
        { name: "Влажность", value: "64%" },
        { name: "Давление", value: "1013 гПа" },
      ],
    },
  ];

  // Comparison data
  const comparisonData = [
    { metric: "Температура", station: "23°C", official: "22.8°C" },
    { metric: "Влажность", station: "65%", official: "63%" },
    { metric: "Давление", station: "1013 гПа", official: "1013.2 гПа" },
  ];

  // Accuracy data
  const accuracyData = [
    { metric: "Точность температуры", value: 99 },
    { metric: "Точность влажности", value: 97 },
    { metric: "Точность давления", value: 99.8 },
  ];

  const windroseData = await getWindroseData();

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
              Последнее обновление: 15 марта 2025 09:30
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Экспорт данных
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Weather cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 justify-between">
          <Card className="bg-gradient-sunny border-0 w-full text-background flex items-center text-center min-w-[150px]">
            <CardContent>
              <Image src={ClearDay} alt='' className='drop-shadow-md h-[250px] w-[250px] mb-5'></Image>
              <p className="text-5xl font-normal">16 °C</p>
              <p className="text-lg font-light">Солнечно</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p>Влажность</p>
                    <h2 className="text-3xl font-bold mt-1">23%</h2>
                  </div>
                  <div><WeatherIcon src={Humidity} /></div>
                </div>
                <div className="flex items-center mt-6">
                  <DirectionArrow value="" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p>Давление</p>
                    <h2 className="text-3xl font-bold mt-1">1013 гПа</h2>
                  </div>
                  <div><WeatherIcon src={Barometer} /></div>
                </div>
                <div className="flex items-center mt-6">
                  <DirectionArrow value="up" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p>Скорость ветра</p>
                    <h2 className="text-3xl font-bold mt-1">5 м/с</h2>
                  </div>
                  <div><WeatherIcon src={Wind5} /></div>
                </div>
                <div className="flex items-center mt-6">
                  <DirectionArrow value="" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <p>Качество воздуха</p>
                    <h2 className="text-3xl font-bold mt-1">110 ppm</h2>
                  </div>
                  <div><WeatherIcon src={AirQuality} /></div>
                </div>
                <div className="flex items-center mt-6">
                  <DirectionArrow value="" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-home border-0">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <p>Влажность</p>
                  <h2 className="text-3xl font-bold mt-1">23%</h2>
                </div>
                <div><WeatherIcon src={Humidity} /></div>
              </div>
              <div className="flex items-center mt-6">
                <DirectionArrow value="" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent>
              <h2 className="mb-6 font-bold text-xl  ">
                Сравнение данных
              </h2>
              <div className="flex flex-wrap gap-6 justify-between">
                {weatherData.map((station, index) => (
                  <div className="min-w-[200px]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base">
                        {station.source}
                      </span>
                      {station.isExternal && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>

                    <div className="space-y-4">
                      {station.metrics.map((metric, metricIndex) => (
                        <div
                          key={metricIndex}
                          className="flex justify-between items-center"
                        >
                          <span className="text-base">
                            {metric.name}
                          </span>
                          <span className=" font-bold text-base">
                            {metric.value}
                          </span>
                        </div>
                      ))}
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

          {/* Charts */}
          {/* Temperature Trend */}
          <Card className="border  shadow-sm">
            <CardHeader className="pb-0 flex flex-wrap md:flex-nowrap justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                Температурный тренд
              </CardTitle>
              <ToggleGroup type="single" defaultValue="week">
                <ToggleGroupItem value="week">
                  Неделя
                </ToggleGroupItem>
                <ToggleGroupItem value="month">
                  Месяц
                </ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent className="p-6">
              <TemperatureChart />
            </CardContent>
          </Card>

          {/* Wind Pattern */}
          <Card className="border  shadow-sm">
            <CardHeader className="pb-0 flex justify-between items-center">
              <CardTitle className="text-lg font-semibold  ">
                Ветровой режим
              </CardTitle>
              <ToggleGroup type="single" defaultValue="24h">
                <ToggleGroupItem value="24h">
                  24ч
                </ToggleGroupItem>
                <ToggleGroupItem value="week">
                  Неделя
                </ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent className="p-6">
              <WindroseChart windroseData={windroseData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}