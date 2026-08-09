'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { enUS, es as esES, ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'

interface CalendarDatePickerProps {
  dateRange?: DateRange
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>
  className?: string
  endDateHint?: Date
}
export function CalendarDatePicker({
  className,
  setDateRange,
  dateRange,
  endDateHint,
}: CalendarDatePickerProps) {
  const { t, i18n } = useTranslation('transactions')
  const [open, setOpen] = useState(false)
  function handleSelect(selectedRange?: DateRange) {
    setDateRange(selectedRange)

    if (selectedRange?.to) {
      setOpen(false)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            onClick={() => {
              setOpen((prev) => !prev)
              setDateRange(undefined)
            }}
            className={cn('justify-start text-left font-normal', !dateRange && 'text-primary')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(
                    dateRange.from,
                    i18n.language.startsWith('en') ? 'MMM dd, yyyy' : 'dd/MMM/yyyy',
                    {
                      locale: i18n.language.startsWith('en')
                        ? enUS
                        : i18n.language.startsWith('es')
                          ? esES
                          : ptBR,
                    },
                  )}{' '}
                  -{' '}
                  {format(
                    dateRange.to,
                    i18n.language.startsWith('en') ? 'MMM dd, yyyy' : 'dd/MMM/yyyy',
                    {
                      locale: i18n.language.startsWith('en')
                        ? enUS
                        : i18n.language.startsWith('es')
                          ? esES
                          : ptBR,
                    },
                  )}
                </>
              ) : (
                format(
                  dateRange.from,
                  i18n.language.startsWith('en') ? 'MMM dd, yyyy' : 'dd/MMM/yyyy',
                  {
                    locale: i18n.language.startsWith('en')
                      ? enUS
                      : i18n.language.startsWith('es')
                        ? esES
                        : ptBR,
                  },
                )
              )
            ) : endDateHint ? (
              <>
                {' - '}
                {format(
                  endDateHint,
                  i18n.language.startsWith('en') ? 'MMM dd, yyyy' : 'dd/MMM/yyyy',
                  {
                    locale: i18n.language.startsWith('en')
                      ? enUS
                      : i18n.language.startsWith('es')
                        ? esES
                        : ptBR,
                  },
                )}
              </>
            ) : (
              <span>{t('FILTERS_DATE_PLACEHOLDER')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={
              i18n.language.startsWith('en') ? enUS : i18n.language.startsWith('es') ? esES : ptBR
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
