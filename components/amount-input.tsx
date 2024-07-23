import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { Info, MinusCircle, PlusCircle } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

type Props = {
    disabled?: boolean;
    value: string;
    placeholder?: string;
    onChange: (value: string | undefined) => void;
};

export const AmountInput = ({
    value,
    placeholder,
    disabled,
    onChange,
}: Props) => {
    const parseValue = parseFloat(value);

    const isIncome = parseValue > 0;
    const isExpense = parseValue < 0;

    const onReverseValue = () => {
        if (!value) return;

        const reversedValue = parseFloat(value) * -1;
        return onChange(reversedValue.toString());
    };
    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 rounded-md absolute top-1.5 left-1.5 p-2 flex items-center justify-center transition-colors",
                                isIncome &&
                                    "bg-emerald-500 hover:bg-emerald-600",
                                isExpense && "bg-rose-500 hover:bg-rose-600"
                            )}
                            onClick={onReverseValue}
                        >
                            {!parseValue && (
                                <Info className="size-3 text-white" />
                            )}
                            {isIncome && (
                                <PlusCircle className="size-3 text-white" />
                            )}
                            {isExpense && (
                                <MinusCircle className="size-3 text-white" />
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Use [+] for income and [-] for expense</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <CurrencyInput
                // This is style of Input component
                className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                prefix="$"
                decimalsLimit={2}
                decimalScale={2}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onValueChange={onChange}
            />

            <p className="text-xs text-muted-foreground mt-2">
                {isIncome && "This will count as income"}
                {isExpense && "This will count as an expense"}
            </p>
        </div>
    );
};
