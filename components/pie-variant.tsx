import { formatPercentage } from "@/lib/utils";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { CategoryTooltip } from "./category-tooltip";

const COLORS = ["#0062ff", "#12c6ff", "#ff647f", "#ff9354"];

type Props = {
    data?: {
        value: number;
        name: string;
    }[];
};

export const PieVariant = ({ data = [] }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Legend
                    iconType="circle"
                    align="right"
                    content={({ payload }) => {
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
                                                {formatPercentage(
                                                    entry.payload?.percent * 100
                                                )}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        );
                    }}
                />

                <Tooltip content={<CategoryTooltip />} />
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    fill="#8884d8"
                    labelLine={false}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};
