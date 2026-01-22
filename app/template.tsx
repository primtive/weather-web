"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { EventProvider } from "@/contexts/EventContext";
import { WeatherProvider } from "@/contexts/WeatherContext";

export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider>
      <WeatherProvider>
        <EventProvider>
          {children}
        </EventProvider>
      </WeatherProvider>
    </ThemeProvider>
  );
}
