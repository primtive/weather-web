"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useWeather } from './WeatherContext';
import { RecordData } from '@/data/types';
import { toast } from "sonner"

// Типы для контекста WebSocket
interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

// Создаем контекст с начальным значением null
const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const { setRecordData } = useWeather();

  const connect = () => {
    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
    socketRef.current.onopen = () => {
      setConnected(true);
      reconnectAttemptsRef.current = 0; // Сброс счетчика переподключений
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setRecordData({...data, time: new Date(data.time)} as RecordData);
    };

    socketRef.current.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');

      // Попытка переподключения
      if (reconnectAttemptsRef.current < 3) {
        reconnectAttemptsRef.current += 1;
        console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/3)...`);
        setTimeout(connect, 3000);
      }
    };

    socketRef.current.onerror = (error) => {
      console.warn('WebSocket error:', error);
      toast.warning(`Ошибка WebSocket`, {
        description: 'Пожалуйста, проверьте подключение к интернету или серверу.',
        duration: 3000,
      })
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const contextValue: WebSocketContextType = {
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect: () => {
      if (socketRef.current) {
        socketRef.current.close();
        setConnected(false);
        console.log('WebSocket disconnected manually');
      }
    }
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Хук для использования WebSocket в компонентах
export const useWS = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};