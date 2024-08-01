import { formatCurrency } from "@/lib/utils";
import { Separator } from "./ui/separator";

export const CategoryTooltip = ({ active, payload }: any) => {
    if (!active) return null;

    console.log(payload);

    const name = payload[0].name;
    const value = payload[0].value;
    const color = payload[0].payload.fill;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <p className="text-sm text-muted-foreground p-2 px-3">{name}</p>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center gap-x-2">
                    <div className="flex justify-between items-center gap-x-4">
                        <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: color }}
                        ></div>
                        <p className="text-sm text-muted-foreground">Expense</p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(value * -1)}
                    </p>
                </div>
            </div>
        </div>
    );
};
