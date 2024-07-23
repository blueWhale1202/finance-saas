import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];
type ResponseType = InferResponseType<
    (typeof client.api.transactions)["bulk-create"]["$post"]
>;

export const useBulkCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"].$post(
                {
                    json,
                }
            );
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transactions created");

            // TODO: Invalidate summary
        },
        onError: () => {
            toast.error("Failed to create transactions");
        },
    });

    return mutation;
};
