import { BedDouble, Bath, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Property } from "../types/property";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

function formatPrice(price: string | number) {
  return `₱${Number(price).toLocaleString("en-PH")}`;
}

function getPropertyImage(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("land") || normalized.includes("lot")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900";
  }

  if (normalized.includes("condo")) {
    return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900";
  }

  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900";
}

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
      <div className="relative h-52 overflow-hidden">
        <img
          src={getPropertyImage(property.property_type)}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
          {property.status || "For sale"}
        </span>

        <button
          type="button"
          onClick={() => onToggleFavorite(property.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-red-500"
        >
          <Heart
            size={18}
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-red-500" : ""}
          />
        </button>
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-emerald-800">
          {formatPrice(property.price)}
        </p>

        <Link
          to={`/properties/${property.id}`}
          className="mt-1 block font-semibold text-slate-900 hover:text-emerald-700"
        >
          {property.title}
        </Link>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={14} />
          {property.address}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={15} />
              {property.bedrooms} Beds
            </span>
          )}

          {(property.bathrooms ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={15} />
              {property.bathrooms} Baths
            </span>
          )}

          {property.bedrooms === 0 &&
            (property.bathrooms ?? 0) === 0 && (
              <span className="capitalize">
                {property.property_type}
              </span>
            )}
        </div>
      </div>
    </article>
  );
}
