import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

type ResponseType = InferResponseType<
    (typeof client.api.accounts)[":id"]["$patch"]
>;

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"].$patch({
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["account", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });

            toast.success("Account edited");
        },
        onError: () => {
            toast.error("Failed to edit account");
        },
    });

    return mutation;
};
