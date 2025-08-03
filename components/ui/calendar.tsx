"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      animate
      captionLayout="label"
      ISOWeek
      navLayout="around"
      showOutsideDays
      className={cn("p-3", className)}
      classNames={{
        // months: "flex flex-col sm:flex-row gap-2",
        // month: "flex flex-col gap-4",
        // month_caption: " justify-center pt-1  ",
        caption_label: "text-sm pt-3 font-medium",
        // nav: "flex items-center gap-1",

        // weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.range-end)]:rounded-r-md [&:has(>.range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        range_start:
          "range-start aria-selected:bg-primary aria-selected:text-primary-foreground rounded-l-md",
        range_end:
          "range-end aria-selected:bg-primary aria-selected:text-primary-foreground rounded-r-md",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        chevron: "fg-accent",
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
