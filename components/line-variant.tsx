import {
    CartesianGrid,
    Line,
    LineChart,
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

export const LineVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
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
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#3d82f6"
                    strokeWidth={2}
                    dot={false}
                    className="drop-shadow-sm"
                />
                <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                    className="drop-shadow-sm"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
