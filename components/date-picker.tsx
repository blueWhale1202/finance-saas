import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";

type Props = {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
};

export const DatePicker = ({ value, disabled, onChange }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="size-4 mr-2" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode="single"
                    initialFocus
                    selected={value}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
};
