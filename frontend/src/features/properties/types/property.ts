export interface Property {
  id: number;
  title: string;
  description: string | null;
  price: string | number;
  bedrooms: number;
  bathrooms: number | null;
  property_type: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyListResponse {
  properties: Property[];
  meta: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}
