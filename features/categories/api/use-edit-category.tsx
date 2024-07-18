import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    (typeof client.api.categories)[":id"]["$patch"]
>["json"];
type ResponseType = InferResponseType<
    (typeof client.api.categories)[":id"]["$patch"]
>;

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"].$patch({
                param: { id },
                json,
            });

            return await response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", { id }] });
            // TODO: Investigate summary and transactions

            toast.success("Category edited");
        },

        onError: () => {
            toast.error("Failed to edit category");
        },
    });

    return mutation;
};
