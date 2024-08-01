import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono/client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
    (typeof client.api.accounts)[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"].$delete({
                param: { id },
            });

            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["account", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });

            toast.success("Account deleted");
        },
        onError: () => {
            toast.error("Failed to delete account");
        },
    });

    return mutation;
};
