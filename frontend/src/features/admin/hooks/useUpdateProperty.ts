import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProperty,
  type CreatePropertyPayload,
} from "../../properties/api/propertyApi";

interface UpdatePropertyVariables {
  id: number;
  payload: CreatePropertyPayload;
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePropertyVariables) =>
      updateProperty(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["properties"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["property", String(variables.id)],
        }),
      ]);
    },
  });
}