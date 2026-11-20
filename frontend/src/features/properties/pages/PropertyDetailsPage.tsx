import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Heart,
  House,
  Maximize,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProperty } from "../hooks/useProperty";

function formatPrice(price: string | number) {
  return `₱${Number(price).toLocaleString("en-PH")}`;
}

function getPropertyImage(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("land") || normalized.includes("lot")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200";
  }

  if (normalized.includes("condo")) {
    return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200";
  }

  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200";
}

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading property details...
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <h2 className="text-xl font-bold">Property not found</h2>
        <p className="text-sm text-slate-500">
          We couldn't load this property. It may have been removed.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <House size={22} />
            </div>
            <span className="text-xl font-bold">
              Land<span className="text-emerald-700">Checker</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to listings
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Marketplace / Properties / {property.title}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} />
            {property.address}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section>
            <div className="overflow-hidden rounded-2xl bg-white">
              <img
                src={getPropertyImage(property.property_type)}
                alt={property.title}
                className="h-[280px] w-full object-cover md:h-[480px]"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6">
              <h2 className="text-lg font-bold">Property overview</h2>

              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <House className="text-emerald-700" />
                  <div>
                    <p className="text-xs text-slate-500">Property type</p>
                    <p className="font-semibold capitalize">
                      {property.property_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BedDouble className="text-emerald-700" />
                  <div>
                    <p className="text-xs text-slate-500">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bath className="text-emerald-700" />
                  <div>
                    <p className="text-xs text-slate-500">Bathrooms</p>
                    <p className="font-semibold">
                      {property.bathrooms ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 border-t border-slate-100 pt-6">
                <h2 className="font-bold">Description</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {property.description || "No description available."}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-500">Listing status</p>
                <p className="mt-1 font-semibold capitalize">
                  {property.status}
                </p>
              </div>
            </div>
          </section>

          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Asking price</p>
              <p className="mt-2 text-3xl font-bold text-emerald-800">
                {formatPrice(property.price)}
              </p>

              <div className="my-6 border-t border-slate-100" />

              <p className="text-sm font-semibold">Interested in this property?</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Contact the property owner or listing agent for more information.
              </p>

              <button
                disabled
                className="mt-5 w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white opacity-60"
              >
                Contact seller (coming soon)
              </button>

              <button
                disabled
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 opacity-60"
              >
                <Heart size={17} />
                Save property (coming soon)
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
