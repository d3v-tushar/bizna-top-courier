'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  //   const [date, setDate] = React.useState<DateRange | undefined>({
  //     from: new Date(2022, 0, 20),
  //     to: addDays(new Date(2022, 0, 20), 20),
  //   });

  //   React.useEffect(() => {
  //     if (date?.from && date?.to) {
  //       const params = new URLSearchParams(searchParams.toString());
  //       params.set('dateFrom', format(date.from, 'yyyy-MM-dd'));
  //       params.set('dateTo', format(date.to, 'yyyy-MM-dd'));
  //       replace(`${pathname}?${params.toString()}`);
  //     }
  //   }, [date, replace, pathname, searchParams]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get('startDate');
    const toParam = searchParams.get('endDate');

    let fromDay: Date | undefined;
    let toDay: Date | undefined;

    // if (dateRange) {
    //   fromDay = dateRange.from;
    //   toDay = dateRange.to;
    // } else if (dayCount) {
    //   toDay = new Date();
    //   fromDay = addDays(toDay, -dayCount);
    // }

    return {
      from: fromParam ? new Date(fromParam) : fromDay,
      to: toParam ? new Date(toParam) : toDay,
    };
  });

  function handleDateRange() {
    const params = new URLSearchParams(searchParams.toString());
    if (date?.from && date?.to) {
      params.set('startDate', format(date.from, 'yyyy-MM-dd'));
      params.set('endDate', format(date.to, 'yyyy-MM-dd'));
    } else {
      params.delete('startDate');
      params.delete('endDate');
    }
    setIsOpen(false);
    replace(`${pathname}?${params.toString()}`);
  }

  function handleDateReset() {
    const params = new URLSearchParams(searchParams.toString());
    if (date?.from && date?.to) {
      params.delete('startDate');
      params.delete('endDate');
      setDate(undefined);
    } else {
      setDate(undefined);
    }

    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover
        open={isOpen}
        onOpenChange={(open: boolean) => {
          setIsOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'h-8 w-full justify-start text-left text-sm font-normal lg:w-[260px]',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="flex w-full justify-end gap-2 p-2">
            <Button
              variant="outline"
              size="sm"
              className="flex justify-end"
              // disabled={date !== undefined}
              onClick={handleDateReset}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="flex justify-end"
              // disabled={date === undefined}
              onClick={handleDateRange}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
