import * as React from 'react';
import Image from 'next/image';

export const WeatherIcon = ({src}: {src: any}) => {
  return (
    <Image src={src} alt='' className='drop-shadow-sm' width={60} height={60}></Image>
  )
}
