import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    typeof client.api.transactions.$post
>["json"];
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            toast.success("Transaction created");
        },
        onError: () => {
            toast.error("Failed to create transaction");
        },
    });

    return mutation;
};
