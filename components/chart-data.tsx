"use client";

import { AreaChart, BarChart3, FileSearch, LineChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { Skeleton } from "./ui/skeleton";

type Props = {
    data?: {
        income: number;
        expense: number;
        date: string;
    }[];
};

export const ChartData = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("area");

    const onTypeChange = (type: string) => {
        setChartType(type);
    };

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle>Transactions</CardTitle>

                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className="lg:w-auto px-3 h-9 rounded-md">
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="area">
                            <div className="flex items-center">
                                <AreaChart className="size-4 mr-2" />
                                <p className="line-clamp-1">Area chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="line">
                            <div className="flex items-center">
                                <LineChart className="size-4 mr-2" />
                                <p className="line-clamp-1">Line chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="bar">
                            <div className="flex items-center">
                                <BarChart3 className="size-4 mr-2" />
                                <p className="line-clamp-1">Bar chart</p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-[350px] gap-y-4">
                        <FileSearch className="size-6 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No data for period
                        </p>
                    </div>
                ) : (
                    <>
                        {chartType === "area" && <AreaVariant data={data} />}
                        {chartType === "line" && <LineVariant data={data} />}
                        {chartType === "bar" && <BarVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export const ChartDataLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-full lg:w-[120px]" />
            </CardHeader>
            <CardContent>
                <Skeleton className=" w-full h-[350px] "></Skeleton>
            </CardContent>
        </Card>
    );
};
