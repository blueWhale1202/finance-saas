"use client";

import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

import { formatDateRange } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "./ui/calendar";

export const DateFilter = () => {
    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId = params.get("accountId");
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const paramSate = {
        from: from ? new Date(from) : defaultFrom,
        to: to ? new Date(to) : defaultTo,
    };

    const [date, setDate] = useState<DateRange | undefined>(paramSate);

    const onApplyChange = (newDate: DateRange | undefined) => {
        const query = {
            accountId,
            from: format(newDate?.from || defaultFrom, "yyyy-MM-dd"),
            to: format(newDate?.to || defaultTo, "yyyy-MM-dd"),
        };

        const url = qs.stringifyUrl(
            { url: pathname, query },
            { skipNull: true, skipEmptyString: true }
        );

        router.push(url);
    };

    const onReset = () => {
        setDate(undefined);
        onApplyChange(undefined);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {formatDateRange({
                        from: from || defaultFrom,
                        to: to || defaultTo,
                    })}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full lg:w-auto p-0">
                <Calendar
                    disabled={false}
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                <div className="p-4 w-full flex items-center gap-x-2">
                    <PopoverClose asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={onReset}
                        >
                            Reset
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            size="sm"
                            className="w-full"
                            onClick={() => onApplyChange(date)}
                        >
                            Apply
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    );
};
