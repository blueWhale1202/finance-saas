"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Plus } from "lucide-react";
import { columns } from "./columns";

import { useGetAccounts } from "@/features/accounts/api/use-accounts-get";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
import { useNewAccount } from "@/features/hooks/use-new-account";

export default function AccountsPage() {
    const { onOpen } = useNewAccount();
    const accountsQuery = useGetAccounts();
    const deleteAccounts = useBulkDeleteAccounts();

    const isDisable = accountsQuery.isLoading || deleteAccounts.isPending;

    const accounts = accountsQuery.data ?? [];

    if (accountsQuery.isLoading) {
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
                        Accounts Page
                    </CardTitle>
                    <Button size="sm" onClick={onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add new account
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey="email"
                        columns={columns}
                        data={accounts}
                        disable={isDisable}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteAccounts.mutate({ ids });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
