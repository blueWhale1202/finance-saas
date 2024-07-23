import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
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
import { Textarea } from "@/components/ui/textarea";
import { insertTransactionSchema } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = insertTransactionSchema.omit({ id: true }).extend({
    amount: z.string(),
});

const apiSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;
export type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    categoryOptions: { label: string; value: string }[];
    accountOptions: { label: string; value: string }[];
    onCreateCategory: (name: string) => void;
    onCreateAccount: (name: string) => void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    disabled,
    onSubmit,
    onDelete,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountInMiliunits = convertAmountToMiliunits(amount);

        onSubmit({
            ...values,
            amount: amountInMiliunits,
        });
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
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker
                                    disabled={disabled}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <Select
                                    disabled={disabled}
                                    options={accountOptions}
                                    value={field.value}
                                    placeholder="Select an account"
                                    onChange={field.onChange}
                                    onCreate={onCreateAccount}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    disabled={disabled}
                                    options={categoryOptions}
                                    value={field.value}
                                    placeholder="Select a category"
                                    onChange={field.onChange}
                                    onCreate={onCreateCategory}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="payee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payee</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={disabled}
                                    placeholder="Add a payee"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput
                                    {...field}
                                    disabled={disabled}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    disabled={disabled}
                                    placeholder="Optional notes"
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" disabled={disabled}>
                    {id ? "Save change" : "Create account"}
                </Button>

                {!!id && (
                    <Button
                        // Determine type of button is "button" if not, it will submit the form
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={disabled}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete transaction
                    </Button>
                )}
            </form>
        </Form>
    );
};
