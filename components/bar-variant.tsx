import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";
import { CustomTooltip } from "./custom-tooltip";

import { format } from "date-fns/format";

type Props = {
    data?: {
        income: number;
        expense: number;
        date: string;
    }[];
};

export const BarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={16}
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => format(value, "MMM dd")}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                    dataKey="income"
                    fill="#3d82f6"
                    className="drop-shadow-sm"
                />
                <Bar
                    dataKey="expense"
                    fill="#f43f5e"
                    className="drop-shadow-sm"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
