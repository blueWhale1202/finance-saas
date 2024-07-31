"use client";

import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from "react-icons/fa6";
import { CardLoading, DataCard } from "./data-card";

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary();
    const params = useSearchParams();

    const from = params.get("from") || undefined;
    const to = params.get("to") || undefined;

    const formatLabel = formatDateRange({ from, to });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <CardLoading />
                <CardLoading />
                <CardLoading />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                Icon={FaPiggyBank}
                variant="default"
                title="Remaining"
                value={data?.remaining}
                dateRage={formatLabel}
                percentageChange={data?.remainingChange}
            />
            <DataCard
                Icon={FaArrowTrendUp}
                variant="success"
                title="Income"
                value={data?.income}
                dateRage={formatLabel}
                percentageChange={data?.incomeChange}
            />
            <DataCard
                Icon={FaArrowTrendDown}
                variant="warning"
                title="Expense"
                value={data?.expense}
                dateRage={formatLabel}
                percentageChange={data?.expenseChange}
            />
        </div>
    );
};
