import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProperty,
  type CreatePropertyPayload,
} from "../../properties/api/propertyApi";

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) =>
      createProperty(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      await queryClient.refetchQueries({
        queryKey: ["properties"],
        type: "active",
      });
    },
  });
}