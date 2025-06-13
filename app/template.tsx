"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </WeatherProvider>
    </ThemeProvider>
  );
}
