import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useCreateAccount } from "../api/use-create-account";
import { AccountForm, FormValues } from "./account-form";

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();

    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Account</SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>

                <AccountForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: "",
                    }}
                />
            </SheetContent>
        </Sheet>
    );
};
