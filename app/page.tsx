
import { Metadata } from "next";
import { getLastRecordData, getTimelineData, getWindroseData } from "@/data/db";
import App from "./app";
import { calculateWeatherCondition } from "@/data/weatherConditions";


export async function generateMetadata(): Promise<Metadata> {
  const recordData = await getLastRecordData();
  const weatherCondition = calculateWeatherCondition(recordData);
  return {
    title: "Метеорологическая панель",
    description: "Панель мониторинга погоды и качества воздуха с актуальными данными, графиками и сравнением с внешними источниками.",
    openGraph: {
      title: "Метеорологическая панель",
      description: "Панель мониторинга погоды и качества воздуха с актуальными данными, графиками и сравнением с внешними источниками.",
      type: "website",
    },
    icons: [{ rel: "icon", url: `/favicons/${recordData.isDay ? weatherCondition.favicon_day : weatherCondition.favicon_night}.svg` }]
  }
}
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const timelineData = await getTimelineData(null);
  const recordData = await getLastRecordData();
  const windroseData = await getWindroseData();
  return <App initTimelineData={timelineData} initRecordData={recordData} windroseData={windroseData} />
}