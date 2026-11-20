import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../auth/store/authStore";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlists,
} from "../hooks/useWatchlists";

interface WatchlistButtonProps {
  propertyId: number;
}

export default function WatchlistButton({
  propertyId,
}: WatchlistButtonProps) {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const { data } = useWatchlists();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const savedItem = data?.watchlists.find(
    (item) => item.property.id === propertyId,
  );

  const isSaved = Boolean(savedItem);
  const isPending = addMutation.isPending || removeMutation.isPending;

  async function handleClick() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isPending) return;

    try {
      if (savedItem) {
        await removeMutation.mutateAsync(savedItem.id);
      } else {
        await addMutation.mutateAsync({ property_id: propertyId });
      }
    } catch {
      // Keep the current saved state when the request fails.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isSaved ? "Remove saved property" : "Save property"}
      aria-pressed={isSaved}
      className="rounded-full bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-red-500 disabled:opacity-50"
    >
      <Heart
        size={18}
        fill={isSaved ? "currentColor" : "none"}
        className={isSaved ? "text-red-500" : ""}
      />
    </button>
  );
}
