import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Heart,
  SlidersHorizontal,
  ArrowRight,
  Menu,
  House,
  Building2,
  Trees,
  Building,
} from "lucide-react";

import { useProperties } from "../hooks/useProperties";
import type { Property } from "../types/property";
import PropertyGrid from "../components/PropertyGrid";
import AuthActions from "../../auth/components/AuthActions";

const categories = [
  { name: "All properties", icon: House },
  { name: "Houses", icon: House },
  { name: "Land", icon: Trees },
  { name: "Condominiums", icon: Building2 },
  { name: "Commercial", icon: Building },
];

function formatPrice(price: number) {
  return `₱${price.toLocaleString("en-PH")}`;
}

function getPropertyImage(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("land")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900";
  }

  if (normalized.includes("condo")) {
    return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900";
  }

  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900";
}

function mapPropertyType(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("land") || normalized.includes("lot")) {
    return "Land";
  }

  if (normalized.includes("condo")) {
    return "Condominiums";
  }

  if (normalized.includes("commercial")) {
    return "Commercial";
  }

  return "Houses";
}

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All properties");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const { data, isLoading, isError } = useProperties({
    page: 1,
    per_page: 10,
  });


  const properties = data?.properties ?? [];

  const filteredProperties = properties.filter((property: Property) => {
    const matchesCategory =
      activeCategory === "All properties" ||
      mapPropertyType(property.property_type) === activeCategory;

    const matchesSearch =
      `${property.title} ${property.address}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <House size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Land<span className="text-emerald-700">Checker</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#properties" className="text-emerald-700">Buy</a>
            <a href="#properties" className="hover:text-emerald-700">Rent</a>
            <a href="#categories" className="hover:text-emerald-700">Explore</a>
            <a href="#about" className="hover:text-emerald-700">About</a>
          </nav>

          <div className="hidden md:flex">
            <AuthActions />
          </div>

          <button className="rounded-lg border border-slate-200 p-2 md:hidden" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#f1f6f2]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-8">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Your property journey starts here
              </div>

              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Find a place you'll love to{" "}
                <span className="text-emerald-700">call home.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
                Discover houses, land, and properties across Cebu.
                Your next opportunity is just a search away.
              </p>

              {/* Search */}
              <div className="mt-9 rounded-2xl bg-white p-3 shadow-xl shadow-emerald-900/5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 px-3">
                    <MapPin className="shrink-0 text-emerald-700" size={21} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by location or keyword"
                      className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() =>
                      document.getElementById("properties")?.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    <Search size={18} />
                    Search properties
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
                <span>✓ Verified property details</span>
                <span>✓ Easy property discovery</span>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
                alt="Modern house surrounded by greenery"
                className="relative h-[430px] w-full rounded-3xl object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-8 rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-xs text-slate-500">Explore properties</p>
                <p className="mt-1 text-2xl font-bold text-emerald-800">
                  Across Cebu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="mb-7">
            <p className="text-sm font-semibold text-emerald-700">EXPLORE</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Browse by property type
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name);
                    document.getElementById("properties")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${active
                    ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    }`}
                >
                  <Icon size={21} />
                  <span className="text-sm font-semibold">{category.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Properties */}
        <section id="properties" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  HANDPICKED FOR YOU
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                  Explore properties
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Discover your next home or investment.
                </p>
              </div>

              <button className="flex items-center gap-2 self-start text-sm font-semibold text-emerald-700 hover:text-emerald-900 sm:self-auto">
                View all properties <ArrowRight size={17} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 3).map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeCategory === category.name
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700">
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            <PropertyGrid
              properties={filteredProperties}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-emerald-800 p-8 text-white md:flex-row md:items-center md:p-12">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Your next property starts here.
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-100">
                Explore opportunities, compare properties, and find the right
                place for your next chapter.
              </p>
            </div>
            <button
              onClick={() =>
                document.getElementById("properties")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              Explore listings <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm text-slate-500 md:flex-row md:items-center lg:px-8">
          <span className="font-bold text-slate-900">
            Land<span className="text-emerald-700">Checker</span>
          </span>
          <p>© {new Date().getFullYear()} LandChecker. All rights reserved.</p>
          <p>Every property, a new possibility.</p>
        </div>
      </footer>
    </div>
  );
}