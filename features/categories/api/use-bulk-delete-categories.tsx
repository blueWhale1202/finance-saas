import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { toast } from "sonner";

type RequestType = InferRequestType<
    (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];
type ResponseType = InferResponseType<
    (typeof client.api.categories)["bulk-delete"]["$post"]
>;

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"].$post({
                json,
            });

            return await response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });

            toast.success("Categories deleted");
        },
        onError: () => {
            toast.error("Failed to delete categories");
        },
    });

    return mutation;
};
