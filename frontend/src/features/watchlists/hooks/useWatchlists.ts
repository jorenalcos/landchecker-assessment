import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthStore } from "../../auth/store/authStore";
import {
  getWatchlists,
  addToWatchlist,
  removeFromWatchlist,
} from "../api/watchlistApi";

export const WATCHLIST_QUERY_KEY = ["watchlists"];

export function useWatchlists() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  return useQuery({
    queryKey: WATCHLIST_QUERY_KEY,
    queryFn: getWatchlists,
    enabled: isAuthenticated,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WATCHLIST_QUERY_KEY,
      });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WATCHLIST_QUERY_KEY,
      });
    },
  });
}
