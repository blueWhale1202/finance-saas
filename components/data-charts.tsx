"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { ChartData, ChartDataLoading } from "./chart-data";
import { SpendingPie, SpendingPieLoading } from "./spending-pie";

export const DataCharts = () => {
    const { isLoading, data } = useGetSummary();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                    <ChartDataLoading />
                </div>
                <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                    <SpendingPieLoading />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <ChartData data={data?.days} />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <SpendingPie data={data?.categories} />
            </div>
        </div>
    );
};
