import { api } from "../../../api/client";
import type { Property, PropertyListResponse } from "../types/property";

export interface PropertyFilters {
  page?: number;
  per_page?: number;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
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

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms?: number;
  property_type: string;
  address: string;
  status: string;
}

export async function createProperty(
  payload: CreatePropertyPayload
): Promise<Property> {
  const response = await api.post<{
    message: string;
    property: Property;
  }>("/properties", {
    property: payload,
  });

  return response.data.property;
}

export async function updateProperty(
  id: number,
  payload: CreatePropertyPayload
): Promise<Property> {
  const response = await api.patch<{ property: Property }>(
    `/properties/${id}`,
    { property: payload }
  );

  return response.data.property;
}

export async function deleteProperty(
  id: number
): Promise<void> {
  await api.delete(`/properties/${id}`);
}
