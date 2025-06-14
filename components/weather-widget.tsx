// https://github.com/daniel-szulc/react-weather-widget/blob/master/src/lib/components/WeatherWidget.js

import React, { use } from 'react';
import './styles/styles.scss';
import { RecordData } from '@/data/types';
import { calculateFeelsLike } from '@/data/weather';
import Image from "next/image";
import { getWeatherConditionIcon, WeatherCondition } from '@/data/weatherConditions';
import Counter from './counter';

const WeatherWidget = ({ data, weatherCondition }: { data: RecordData, weatherCondition: WeatherCondition }) => {

  return (
    <div className="daniel-szulc-weather-widget">
      <div className={"weather-widget"}>
        <div className="background rounded-xl" />
        <div className="content">
          <h2>{process.env.NEXT_PUBLIC_LOCATION}</h2>
        </div>
        <div className="weather-icon">
          <Image src={`/icons/all/${getWeatherConditionIcon(weatherCondition.code, data.isDay)}.svg`}
            alt=''
            width={250}
            height={250}
            className='drop-shadow-md mt-[-35px] mx-auto'
          ></Image>
        </div>
        <div className="current-weather">
          <h1>
            <Counter value={data.temp_e} />
            <span className="light-font">°C</span>
          </h1>
          <h3>{weatherCondition.text}</h3>
        </div>
        <div className="details">
          <div className="detail-item">
            <div>
              <h4>Ветер</h4>
            </div>
            <div>
              <h2>
                <Counter value={data.wind_speed} />
                <span className="light-font">м/c</span>
              </h2>
            </div>
          </div>
          <div className="detail-item">
            <div>
              <h4>Влажность</h4>
            </div>
            <div>
              <h2>
                <Counter value={data.humd_e} />
                <span className="light-font">%</span>
              </h2>
            </div>
          </div>
          <div className="detail-item">
            <div>
              <h4>Ощущается</h4>
            </div>
            <div>
              <h2>
                <Counter value={(data.temp_e && data.humd_e && data.wind_speed) && calculateFeelsLike(data.temp_e, data.humd_e, data.wind_speed)} />
                <span className="light-font">°C</span>
              </h2>
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;