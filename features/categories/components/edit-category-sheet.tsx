import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { CategoryForm, FormValues } from "./category-form";

import { useConfirm } from "@/hooks/use-confirm";
import { Loader } from "lucide-react";
import { useOpenCategory } from "../hooks/use-open-category";

import { useDeleteCategory } from "../api/use-delete-category";
import { useEditCategory } from "../api/use-edit-category";
import { useGetCategory } from "../api/use-get-category";

export const EditCategorySheet = () => {
    const { id, isOpen, onClose } = useOpenCategory();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category. This action cannot be undone."
    );

    const categoryQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const defaultValues = categoryQuery.data
        ? { name: categoryQuery.data.name }
        : { name: "" };

    const isDisable = editMutation.isPending || deleteMutation.isPending;

    const handleSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleDelete = async () => {
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
                        <SheetTitle>Edit Category</SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>

                    {categoryQuery.isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader className="size-12 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <CategoryForm
                            id={id}
                            disabled={isDisable}
                            defaultValues={defaultValues}
                            onSubmit={handleSubmit}
                            onDelete={handleDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
