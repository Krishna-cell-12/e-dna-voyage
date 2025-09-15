import { useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export interface DatePickerProps {
  value?: string; // ISO date string yyyy-mm-dd
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date;
}

export function DatePicker({ value, onChange, placeholder = 'dd-mm-yyyy', minDate }: DatePickerProps) {
  const selected = useMemo(() => (value ? new Date(value) : undefined), [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-card border-border/20 text-foreground"
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          {selected ? format(selected, 'dd-MM-yyyy') : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border/20" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (!d) return;
            const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
              .toISOString()
              .split('T')[0];
            onChange(iso);
          }}
          disabled={(date) => (minDate ? date < new Date(minDate.toDateString()) : false)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;


