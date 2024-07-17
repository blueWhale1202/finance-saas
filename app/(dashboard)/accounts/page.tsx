"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns, Payment } from "./columns";

import { Plus } from "lucide-react";

import { useNewAccount } from "@/features/hooks/use-new-account";

const data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "728ed52f",
        amount: 300,
        status: "success",
        email: "a@example.com",
    },
];

export default function AccountsPage() {
    const { onOpen } = useNewAccount();
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
                        data={data}
                        disable={false}
                        onDelete={() => {}}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
