"use client";

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";

export const SheetProvider = () => {
    return (
        <>
            <NewAccountSheet />
            <EditAccountSheet />
        </>
    );
};
