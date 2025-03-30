import Image from "next/image";
import rain from "@/public/icons/all/rain.svg"
import * as Weather from "@/data/weather"
import { Card } from "@/components/ui/card";

export default function Home() {

  const temp = Weather.getTemperature()

  return (
    <>
      <div>
        <Card className="bg-gradient-sunny h-[200px] w-[200px] items-center">
          <Image src={rain} alt={""} className="w-25 drop-shadow-xl" />
          <p className="text-3xl text-white font-light">{temp} °C</p>
        </Card>
      </div>
    </>
  );
}
