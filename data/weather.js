import { calculateWindRose } from "@eunchurn/react-windrose";

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function getTemperature() {
  return getRandomInt(-10, 30)
}

export async function getWindroseData() {
  const req = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.767830&longitude=13.41&hourly=wind_speed_10m,wind_direction_10m')
  const data = await req.json()
  return data
}

