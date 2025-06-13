"use client";
import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";

export default function Counter({ value }: { value: number | null }) {
  const [oldVal, setOldVal] = useState(0);
  const prevValueRef = useRef(value);

  useEffect(() => {
    setOldVal(prevValueRef.current || 0);
    prevValueRef.current = value;
  }, [value]);

  return (
    value ?
    <CountUp
      start={oldVal}
      separator=""
      end={value}
      duration={1}
    />
    : <span>?</span>
  );
}