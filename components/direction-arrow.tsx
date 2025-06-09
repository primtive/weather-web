import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import * as React from 'react';

export const DirectionArrow = ({value}: {value: string}) => {
  return (
    <>
      {value === "up" && (
        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 mr-1" />
      )}
      {value === "down" && (
        <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1" />
      )}
      {value === "neutral" && (
        <ArrowRight className="h-3.5 w-3.5  mr-1" />
      )}
      </>
  )
}
