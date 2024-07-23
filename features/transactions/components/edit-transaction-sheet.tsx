import { insertTransactionSchema } from "@/db/schema";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { TransactionForm } from "./transaction-form";

import { Loader2 } from "lucide-react";
import { z } from "zod";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction. This action cannot be undone."
    );

    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;
    const isLoading = transactionQuery.isLoading;

    const defaultValues = transactionQuery.data
        ? {
              ...transactionQuery.data,
              amount: transactionQuery.data.amount.toString(),
              date: transactionQuery.data.date
                  ? new Date(transactionQuery.data.date)
                  : new Date(),
          }
        : undefined;

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

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>
                            Edit an existing Transaction
                        </SheetDescription>
                    </SheetHeader>

                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-8 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm
                            key={id}
                            id={id}
                            categoryOptions={categoryOptions}
                            accountOptions={accountOptions}
                            onCreateCategory={onCreateCategory}
                            onCreateAccount={onCreateAccount}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
