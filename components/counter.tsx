"use client";
import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";

/**
 * Возвращает количество значащих цифр после запятой после округления до указанного количества знаков,
 * не включая ведущие нули.
 * 
 * @param num - Число с плавающей точкой
 * @param decimals - Количество знаков после запятой для округления
 * @returns Количество значащих цифр после запятой (без учета ведущих нулей)
 * 
 * Примеры:
 * - countSignificantDecimals(1.001, 2) => 0 (число округляется до 1)
 * - countSignificantDecimals(12.01, 3) => 2 (число округляется до 12.01)
 * - countSignificantDecimals(12.01, 1) => 0 (число округляется до 12)
 */
function countSignificantDecimals(num: number, decimals: number): number {
  // Округляем число до указанного количества знаков после запятой
  const rounded = Number(num.toFixed(decimals));
  
  // Преобразуем число в строку
  const numStr = rounded.toString();
  
  // Если в строке нет точки, значит, число целое
  if (!numStr.includes('.')) {
    return 0;
  }
  
  // Получаем часть после запятой
  const decimalPart = numStr.split('.')[1];
  
  // Удаляем конечные нули
  const trimmed = decimalPart.replace(/0+$/, '');
  
  // Возвращаем длину оставшейся строки
  return trimmed.length;
}

interface CounterProps {
  value: number | null;
  decimals?: number;
  className?: string;
}

export default function Counter({ value, decimals = 0, className }: CounterProps) {
  const [oldVal, setOldVal] = useState(0);
  const prevValueRef = useRef(value);

  useEffect(() => {
    setOldVal(prevValueRef.current || 0);
    prevValueRef.current = value;
  }, [value]);

  return (
    value !== null ?
      <CountUp
        start={oldVal}
        separator=""
        end={value}
        duration={1}
        className={className}
        decimals={decimals === 0 ? 0 : countSignificantDecimals(value, decimals)}
      />
      : <span>?</span>
  );
}