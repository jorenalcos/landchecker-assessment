import { api } from "../../../api/client";
import type { Property, PropertyListResponse } from "../types/property";

export interface PropertyFilters {
  page?: number;
  per_page?: number;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export async function getProperties(
  filters: PropertyFilters = {},
): Promise<PropertyListResponse> {
  const response = await api.get<PropertyListResponse>("/properties", {
    params: filters,
  });

  return response.data;
}

export async function getProperty(id: string): Promise<Property> {
  const response = await api.get<{ property: Property }>(
    `/properties/${id}`,
  );

  return response.data.property;
}
