"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
import { UploadButton } from "./upload-button";

import { transactions as transactionsSchema } from "@/db/schema";
import { useBulkCreateTransaction } from "@/features/transactions/api/use-bulk-create-transactions";
import { useBulkDeleteTransaction } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useSelectAccount } from "@/features/transactions/hooks/use-select-account";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULT = {
    data: [],
    error: [],
    meta: {},
};

export default function TransactionsPage() {
    const { onOpen } = useNewTransaction();
    const transactionsQuery = useGetTransactions();
    const createTransactions = useBulkCreateTransaction();
    const deleteTransaction = useBulkDeleteTransaction();

    const [SelectAccountDialog, confirm] = useSelectAccount();

    const [variant, setVariant] = useState(VARIANTS.LIST);
    const [importResult, setImportResult] = useState(INITIAL_IMPORT_RESULT);

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

    const onUpload = (result: typeof INITIAL_IMPORT_RESULT) => {
        setImportResult(result);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
        setVariant(VARIANTS.LIST);
        setImportResult(INITIAL_IMPORT_RESULT);
    };

    const onSubmitImport = async (
        result: (typeof transactionsSchema.$inferInsert)[]
    ) => {
        const accountId = await confirm();

        if (!accountId) {
            return toast.error("Please select an account");
        }

        const data = result.map((transaction) => ({
            ...transaction,
            accountId: accountId as string,
        }));

        createTransactions.mutate(data, { onSuccess: onCancelImport });
    };

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <SelectAccountDialog />
                <ImportCard
                    data={importResult.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transactions History
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-2">
                        <Button size="sm" onClick={onOpen}>
                            <Plus className="size-4 mr-2" />
                            Add new transaction
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey="payee"
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
