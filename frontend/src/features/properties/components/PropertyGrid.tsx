import type { Property } from "../types/property";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export default function PropertyGrid({
  properties,
  favorites,
  onToggleFavorite,
  isLoading = false,
  isError = false,
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <p className="py-10 text-center text-slate-500">
        Loading properties...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-600">
        Unable to load properties. Please try again.
      </p>
    );
  }

  if (properties.length === 0 && !isError) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="font-semibold">No properties found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try another location or property category.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
