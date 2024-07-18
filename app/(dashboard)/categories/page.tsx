"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default function CategoriesPage() {
    const { onOpen } = useNewCategory();
    const categoriesQuery = useGetCategories();
    const deleteCategories = useBulkDeleteCategories();

    const isDisable = categoriesQuery.isLoading || deleteCategories.isPending;

    if (categoriesQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <CardTitle className="text-xl line-clamp-1">
                            Categories Page
                        </CardTitle>
                        <Skeleton className="w-48 h-8" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
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
                        Categories Page
                    </CardTitle>
                    <Button size="sm" onClick={onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add category
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        disable={isDisable}
                        columns={columns}
                        data={categoriesQuery.data || []}
                        filterKey="name"
                        onDelete={(rows) => {
                            const ids = rows.map((r) => r.original.id);
                            deleteCategories.mutate({ ids });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
