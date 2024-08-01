"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const AccountFilter = () => {
    const { isLoading: accountsLoading, data: accounts } = useGetAccounts();
    const { isLoading: summaryLoading } = useGetSummary();

    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const onValueChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to,
        };

        if (newValue === "all") {
            query.accountId = "";
        }

        const url = qs.stringifyUrl(
            {
                url: pathname,
                query,
            },
            { skipNull: true, skipEmptyString: true }
        );

        router.push(url);
    };

    return (
        <Select
            value={accountId}
            onValueChange={onValueChange}
            disabled={accountsLoading || summaryLoading}
        >
            <SelectTrigger className="w-full lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
                <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All accounts</SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
