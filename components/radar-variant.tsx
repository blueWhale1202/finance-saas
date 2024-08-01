import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { CategoryTooltip } from "./category-tooltip";

type Props = {
    data?: {
        value: number;
        name: string;
    }[];
};

export const RadarVariant = ({ data = [] }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={data} outerRadius="60%" cx="50%" cy="50%">
                <PolarGrid />
                <PolarAngleAxis dataKey="name" style={{ fontSize: "12px" }} />
                <PolarRadiusAxis style={{ fontSize: "12px" }} />
                <Tooltip content={<CategoryTooltip />} />
                <Radar
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
};
