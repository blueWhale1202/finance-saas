import { client } from "@/lib/hono";
import { convertMiliunitsToAmount } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummary = () => {
    const params = useSearchParams();

    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({
        // TODO: Check if params are needed for queryKey
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary.$get({
                query: { from, to, accountId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch summary data");
            }

            const { data } = await response.json();

            return {
                ...data,
                income: convertMiliunitsToAmount(data.incomeAmount),
                expense: convertMiliunitsToAmount(data.expenseAmount),
                remaining: convertMiliunitsToAmount(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertMiliunitsToAmount(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertMiliunitsToAmount(day.income),
                    expense: convertMiliunitsToAmount(day.expense),
                })),
            };
        },
    });

    return query;
};
