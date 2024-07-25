import { ReactNode, useRef, useState } from "react";

import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

type TypeHook = () => [() => ReactNode, () => Promise<unknown>];

type TypeState = {
    resolve: (value?: string) => void;
} | null;

export const useSelectAccount: TypeHook = () => {
    const [promise, setPromise] = useState<TypeState>(null);
    const selectedValue = useRef<string>();

    const accountsQuery = useGetAccounts();
    const options = (accountsQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const accountsMutation = useCreateAccount();
    const onCreate = (name: string) => accountsMutation.mutate({ name });

    const onSelectChange = (value?: string) => {
        selectedValue.current = value;
    };

    const disabled = accountsQuery.isLoading || accountsMutation.isPending;

    const confirm = () =>
        new Promise((resolve) => {
            setPromise({ resolve });
        });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(selectedValue.current);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    const ConfirmDialog = () => (
        <Dialog open={promise !== null} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Account</DialogTitle>
                    <DialogDescription>
                        Please an account to continue
                    </DialogDescription>
                </DialogHeader>

                <Select
                    options={options}
                    value={selectedValue.current}
                    placeholder="Select an account"
                    disabled={disabled}
                    onChange={onSelectChange}
                    onCreate={onCreate}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmDialog, confirm];
};
