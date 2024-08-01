import { formatCurrency } from "@/lib/utils";
import {
    Legend,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#0062ff", "#12c6ff", "#ff647f", "#ff9354"];

type Props = {
    data?: {
        value: number;
        name: string;
    }[];
};

export const RadialVariant = ({ data = [] }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
                cx="50%"
                cy="30%"
                barSize={10}
                innerRadius="90%"
                outerRadius="40%"
                data={data.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length],
                }))}
                startAngle={180}
                endAngle={0}
            >
                <Legend
                    iconType="circle"
                    align="right"
                    content={({ payload }) => {
                        console.log("🚀 ~ RadialVariant ~ payload:", payload);

                        return (
                            <ul className="flex flex-col space-y-2">
                                {payload?.map((entry: any, index) => (
                                    <li
                                        key={`item-${index}`}
                                        className="flex items-center space-x-2"
                                    >
                                        <div
                                            className="rounded-full size-2"
                                            style={{
                                                backgroundColor: entry.color,
                                            }}
                                        ></div>
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}
                                            </span>
                                            <span className="text-sm ">
                                                {formatCurrency(
                                                    entry.payload?.value
                                                )}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                    }}
                />

                <RadialBar dataKey="value" background />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};
