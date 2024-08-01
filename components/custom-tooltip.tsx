import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "./ui/separator";

export const CustomTooltip = ({ active, payload }: any) => {
    if (!active) return null;

    const date = payload[0].payload.date;
    const income = payload[0].value;
    const expense = payload[1].value;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <p className="text-sm text-muted-foreground p-2 px-3">
                {format(date, "MMM dd, yyyy")}
            </p>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center gap-x-2">
                    <div className="flex justify-between items-center gap-x-4">
                        <div className="size-1.5 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-muted-foreground">Income</p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(income)}
                    </p>
                </div>

                <div className="flex items-center gap-x-2">
                    <div className="flex justify-between items-center gap-x-4">
                        <div className="size-1.5 bg-rose-500 rounded-full"></div>
                        <p className="text-sm text-muted-foreground">Expense</p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(expense * -1)}
                    </p>
                </div>
            </div>
        </div>
    );
};
