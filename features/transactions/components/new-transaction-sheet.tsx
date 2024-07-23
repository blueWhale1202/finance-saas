import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { Loader2 } from "lucide-react";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { ApiFormValues, TransactionForm } from "./transaction-form";

export const NewTransactionSheet = () => {
    const { isOpen, onClose } = useNewTransaction();

    const mutation = useCreateTransaction();

    const categoriesQuery = useGetCategories();
    const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const categoriesMutation = useCreateCategory();
    const onCreateCategory = (name: string) =>
        categoriesMutation.mutate({ name });

    const accountsQuery = useGetAccounts();
    const accountOptions = (accountsQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const accountsMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountsMutation.mutate({ name });

    const onSubmit = (values: ApiFormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const isPending =
        mutation.isPending ||
        categoriesMutation.isPending ||
        accountsMutation.isPending;
    const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Transaction</SheetTitle>
                    <SheetDescription>Add a new transactions</SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <TransactionForm
                        disabled={isPending}
                        onSubmit={onSubmit}
                        categoryOptions={categoryOptions}
                        accountOptions={accountOptions}
                        onCreateCategory={onCreateCategory}
                        onCreateAccount={onCreateAccount}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
};
