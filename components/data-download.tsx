"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download } from "lucide-react"
import { addDays, format } from "date-fns"
import { ru } from "date-fns/locale/ru";
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from "react"
import { Calendar } from "./ui/calendar"
import { useRouter } from 'next/navigation'

export function DataDownload() {
  const router = useRouter()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

  async function download() {
    router.push(`/api/data?from=${date?.from?.getTime()}&to=${date?.to?.getTime() || date?.from?.getTime()}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Экспорт данных
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Экспорт данных</DialogTitle>
          <DialogDescription>
            Выберите диапазон дат, чтобы скачать данные о погоде
          </DialogDescription>
        </DialogHeader>

        <Popover modal={true}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y", { locale: ru })} -{" "}
                    {format(date.to, "LLL dd, y", { locale: ru })}
                  </>
                ) : (
                  format(date.from, "LLL dd, y", { locale: ru })
                )
              ) : (
                <span>Выберите дату</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={ru}
              autoFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        <DialogFooter>
          <Button onClick={download} disabled={!date?.from}>Скачать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
