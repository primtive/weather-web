import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/data/prisma';
import { getOpenWeatherMapData, getWeatherApiData } from '@/data/weather';
import { broadcastToClients } from './events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Получаем данные из внешних API
      const openWeatherMapData = await getOpenWeatherMapData();
      const weatherApiData = await getWeatherApiData();

      // Собираем итоговый объект
      const data = {
        ...body,
        externalSources: [
          {
            id: 0,
            temp: openWeatherMapData.main.temp,
            humd: openWeatherMapData.main.humidity,
            pres: openWeatherMapData.main.pressure,
          },
          {
            id: 1,
            temp: weatherApiData.current.temp_c,
            humd: weatherApiData.current.humidity,
            pres: weatherApiData.current.pressure_mb,
          },
        ],
        weatherCode: weatherApiData.current.condition.code,
        uv: Math.round(weatherApiData.current.uv),
        isDay: weatherApiData.current.is_day === 1,
      };

      // Сохраняем запись в БД
      await prisma.record.create({ data });

      // Рассылаем обновление всем SSE клиентам
      broadcastToClients(data);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[API] POST /weather error:', err);
      return res.status(500).json({ error: 'Failed to save weather data' });
    }
  }

  if (req.method === 'GET') {
    try {
      const dateStr = req.query.date as string | undefined;
      const date = dateStr ? new Date(dateStr) : new Date();

      const record = await prisma.record.findFirst({
        where: { time: date },
      });

      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      }

      return res.status(200).json(record);
    } catch (err) {
      console.error('[API] GET /weather error:', err);
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }

  // Метод не поддерживается
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
