// background from https://github.com/daniel-szulc/react-weather-widget

import React from 'react';
import './styles/styles.scss';
import { RecordData } from '@/data/types';
import { calculateFeelsLike } from '@/data/weather';
import Image from "next/image";
import { getWeatherConditionIcon, WeatherCondition } from '@/data/weatherConditions';
import Counter from './counter';

const WeatherWidget = ({ data, weatherCondition }: { data: RecordData, weatherCondition: WeatherCondition }) => {

  const details = [
    {
      value: data.wind_speed,
      unit: 'м/с',
      icon: 'wind',
      label: 'Ветер',
    },
    {
      value: data.humd_e,
      unit: '%',
      icon: 'humidity',
      label: 'Влажность',
    },
    {
      value: (data.temp_e && data.humd_e && data.wind_speed) && calculateFeelsLike(data.temp_e, data.humd_e, data.wind_speed * 3.6),
      unit: '°C',
      icon: 'thermometer',
      label: 'Ощущается',
    }
  ]

  return (
    <div className="m-0 flex flex-col relative text-white">
      <div className="widget-bg rounded-xl" />
      <h1 className='relative text-center text-xl m-5'>{process.env.NEXT_PUBLIC_LOCATION}</h1>
      <Image src={`/icons/all/${getWeatherConditionIcon(weatherCondition.code, data.isDay)}.svg`}
        alt=''
        width={250}
        height={250}
        className='drop-shadow-md mt-[-35px] mx-auto'
      />
      <div className='mx-auto'>
        <h1 className='text-5xl flex items-center gap-2'>
          <Counter value={data.temp_e} className='font-semibold' />
          <span className="light-font w-0">°C</span>
        </h1>
      </div>
      <h3 className='text-lg text-center my-3'>{weatherCondition.text}</h3>
      <div className="flex mb-5">
        {details.map((detail, index) => (
          <div className="w-1/3" key={index}>
            <h4 className='text-center text-lg'>{detail.label}</h4>
            <div className='flex'>
              <div className='flex items-center mx-auto gap-1 text-3xl'>
                <Counter value={detail.value} className='font-semibold' />
                <span className="light-font">{detail.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherWidget;