import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProperty } from "../../properties/api/propertyApi";

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProperty(id),

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["properties"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["property", String(id)],
        }),
      ]);
    },
  });
}
