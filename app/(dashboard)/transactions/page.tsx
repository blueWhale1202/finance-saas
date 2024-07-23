"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Plus } from "lucide-react";
import { columns } from "./columns";

import { useBulkDeleteTransaction } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

export default function TransactionsPage() {
    const { onOpen } = useNewTransaction();
    const transactionsQuery = useGetTransactions();
    const deleteTransaction = useBulkDeleteTransaction();

    const isDisable =
        transactionsQuery.isLoading || deleteTransaction.isPending;

    const transactions = transactionsQuery.data ?? [];

    if (transactionsQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <CardTitle className="text-xl line-clamp-1">
                            Accounts Page
                        </CardTitle>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transactions History
                    </CardTitle>
                    <Button size="sm" onClick={onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add new transaction
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey="account"
                        columns={columns}
                        data={transactions}
                        disable={isDisable}
                        onDelete={(rows) => {
                            const ids = rows.map((r) => r.original.id);
                            deleteTransaction.mutate({ ids });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}