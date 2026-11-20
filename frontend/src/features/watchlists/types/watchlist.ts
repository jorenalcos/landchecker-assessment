import type { Property } from "../../properties/types/property";

export interface WatchlistItem {
  id: number;
  property: Property;
  created_at: string;
}

export interface WatchlistResponse {
  watchlists: WatchlistItem[];
}

export interface CreateWatchlistResponse {
  message: string;
  watchlist: WatchlistItem;
}

export interface CreateWatchlistPayload {
  property_id: number;
}
