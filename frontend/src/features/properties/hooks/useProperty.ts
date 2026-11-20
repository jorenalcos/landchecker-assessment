
import { useQuery } from "@tanstack/react-query";
import { getProperty } from "../api/propertyApi";

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
    enabled: Boolean(id),
  });
}
