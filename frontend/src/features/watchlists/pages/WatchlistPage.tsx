import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

import { useWatchlists } from "../hooks/useWatchlists";
import PropertyGrid from "../../properties/components/PropertyGrid";

export default function WatchlistPage() {
  const { data, isLoading, isError } = useWatchlists();

  const savedProperties =
    data?.watchlists.map((item) => item.property) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-xl font-bold">
            Land<span className="text-emerald-700">Checker</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to marketplace
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Heart size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Saved Properties
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Properties you've added to your watchlist.
            </p>
          </div>
        </div>

        {!isLoading && !isError && (
          <p className="mt-7 text-sm text-slate-500">
            {savedProperties.length} saved{" "}
            {savedProperties.length === 1 ? "property" : "properties"}
          </p>
        )}

        <PropertyGrid
          properties={savedProperties}
          isLoading={isLoading}
          isError={isError}
        />
      </main>
    </div>
  );
}
