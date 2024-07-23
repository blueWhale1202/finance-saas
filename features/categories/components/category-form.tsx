"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertCategoriesSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = insertCategoriesSchema.pick({
    name: true,
});

export type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    disabled: boolean;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
};

export const CategoryForm = ({
    id,
    disabled,
    defaultValues,
    onSubmit,
    onDelete,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={disabled}
                                    placeholder="e.g. Cash, Bank, Credit card"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" disabled={disabled}>
                    {id ? "Save change" : "Create category"}
                </Button>

                {!!id && (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={disabled}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete category
                    </Button>
                )}
            </form>
        </Form>
    );
};
