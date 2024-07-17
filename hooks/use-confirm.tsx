import { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type TypeHook = (
    title: string,
    message: string
) => [() => ReactNode, () => Promise<unknown>];

type TypeState = {
    resolve: (value: boolean) => void;
} | null;

export const useConfirm: TypeHook = (title, message) => {
    const [promise, setPromise] = useState<TypeState>(null);

    const confirm = () =>
        new Promise((resolve, rejects) => {
            setPromise({ resolve });
        });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>

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
