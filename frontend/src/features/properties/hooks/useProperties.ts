import { useQuery } from "@tanstack/react-query";
import {
  getProperties,
  type PropertyFilters,
} from "../api/propertyApi";

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
  });
}
