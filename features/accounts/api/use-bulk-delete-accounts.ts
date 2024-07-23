import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];
type ResponseType = InferResponseType<
    (typeof client.api.accounts)["bulk-delete"]["$post"]
>;

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"].$post({
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Accounts deleted");

            // TODO: Invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete accounts");
        },
    });

    return mutation;
};
