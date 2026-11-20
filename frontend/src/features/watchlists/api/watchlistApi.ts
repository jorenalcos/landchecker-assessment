import { api } from "../../../api/client";
import type {
  WatchlistResponse,
  CreateWatchlistResponse,
  CreateWatchlistPayload,
} from "../types/watchlist";

export async function getWatchlists(): Promise<WatchlistResponse> {
  const response = await api.get<WatchlistResponse>("/watchlists");

  return response.data;
}

export async function addToWatchlist(
  payload: CreateWatchlistPayload,
): Promise<CreateWatchlistResponse> {
  const response = await api.post<CreateWatchlistResponse>(
    "/watchlists",
    payload,
  );

  return response.data;
}

export async function removeFromWatchlist(id: number): Promise<void> {
  await api.delete(`/watchlists/${id}`);
}
