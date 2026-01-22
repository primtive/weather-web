"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useWeather } from './WeatherContext';
import { RecordData } from '@/data/types';

interface EventContextType {
  isEnabled: boolean;
  setEnabled: (val: boolean) => void;
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEnabled, setEnabled] = useState(true);
  const { setRecordData } = useWeather();

  useEffect(() => {
    const es = new EventSource('/api/events', { withCredentials: false });

    es.onmessage = (e) => {
      try {
        if (!isEnabled) return;
        const data = JSON.parse(e.data);
        console.log(data);
        setRecordData({ ...data, time: new Date() } as RecordData);
      } catch (err) {
        console.error('[SSE] Invalid JSON:', e.data);
      }
    };
  })

  const contextValue: EventContextType = {
    isEnabled,
    setEnabled
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within a EventProvider');
  }
  return context;
};