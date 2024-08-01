import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

type ResponseType = InferResponseType<
    (typeof client.api.transactions)[":id"]["$patch"]
>;

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"].$patch({
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            queryClient.invalidateQueries({
                queryKey: ["transaction", { id }],
            });

            toast.success("Transaction edited");
        },
        onError: () => {
            toast.error("Failed to edit transaction");
        },
    });

    return mutation;
};
