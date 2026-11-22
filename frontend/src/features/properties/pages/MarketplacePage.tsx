import { useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Menu,
  House,
  Building2,
  Trees,
  Building,
} from "lucide-react";

import { useProperties } from "../hooks/useProperties";
import PropertyGrid from "../components/PropertyGrid";
import AuthActions from "../../auth/components/AuthActions";

const categories = [
  { name: "All properties", icon: House },
  { name: "Houses", icon: House },
  { name: "Land", icon: Trees },
  { name: "Condominiums", icon: Building2 },
  { name: "Commercial", icon: Building },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All properties");
  const [search, setSearch] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [filterDraft, setFilterDraft] = useState({
    min_price: "",
    max_price: "",
    min_bedrooms: "",
    max_bedrooms: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<{
    min_price?: number;
    max_price?: number;
    min_bedrooms?: number;
    max_bedrooms?: number;
  }>({});

  const propertyTypeMap: Record<string, string | undefined> = {
    "All properties": undefined,
    Houses: "House",
    Land: "Land",
    Condominiums: "Condominium",
    Commercial: "Commercial",
  };

  const { data, isLoading, isError } = useProperties({
    page: currentPage,
    per_page: 6,
    search: search.trim() || undefined,
    property_type: propertyTypeMap[activeCategory],
    ...appliedFilters,
  });

  const properties = data?.properties ?? [];

  function applyFilters() {
    const minPrice = filterDraft.min_price.trim();
    const maxPrice = filterDraft.max_price.trim();
    const minBedrooms = filterDraft.min_bedrooms.trim();
    const maxBedrooms = filterDraft.max_bedrooms.trim();

    const minPriceValue = minPrice ? Number(minPrice) : undefined;
    const maxPriceValue = maxPrice ? Number(maxPrice) : undefined;
    const minBedroomsValue = minBedrooms ? Number(minBedrooms) : undefined;
    const maxBedroomsValue = maxBedrooms ? Number(maxBedrooms) : undefined;

    if (
      (minPriceValue !== undefined &&
        maxPriceValue !== undefined &&
        minPriceValue > maxPriceValue) ||
      (minBedroomsValue !== undefined &&
        maxBedroomsValue !== undefined &&
        minBedroomsValue > maxBedroomsValue)
    ) {
      alert("Minimum values cannot be greater than maximum values.");
      return;
    }

    setAppliedFilters({
      min_price: minPriceValue,
      max_price: maxPriceValue,
      min_bedrooms: minBedroomsValue,
      max_bedrooms: maxBedroomsValue,
    });

    setIsFilterOpen(false);
  }

  function clearFilters() {
    setFilterDraft({
      min_price: "",
      max_price: "",
      min_bedrooms: "",
      max_bedrooms: "",
    });

    setAppliedFilters({});
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
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
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
                    setCurrentPage(1);

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
                    onClick={() => {
                      setActiveCategory(category.name);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeCategory === category.name
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  console.log("Filters button clicked");
                  setIsFilterOpen((current) => !current);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-500"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              {isFilterOpen && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">Filter properties</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Narrow your search to find the right property.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Price range */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Minimum price (PHP)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 500000"
                        value={filterDraft.min_price}
                        onChange={(event) =>
                          setFilterDraft((current) => ({
                            ...current,
                            min_price: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Maximum price (PHP)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 5000000"
                        value={filterDraft.max_price}
                        onChange={(event) =>
                          setFilterDraft((current) => ({
                            ...current,
                            max_price: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Minimum bedrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Any"
                        value={filterDraft.min_bedrooms}
                        onChange={(event) =>
                          setFilterDraft((current) => ({
                            ...current,
                            min_bedrooms: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Maximum bedrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Any"
                        value={filterDraft.max_bedrooms}
                        onChange={(event) =>
                          setFilterDraft((current) => ({
                            ...current,
                            max_bedrooms: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={applyFilters}
                      className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <PropertyGrid
              properties={properties}
              isLoading={isLoading}
              isError={isError}
            />

            {data && data.meta.total_pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-slate-600">
                  Page {data.meta.current_page} of {data.meta.total_pages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= data.meta.total_pages}
                  onClick={() => {
                    setCurrentPage((page) =>
                      Math.min(data.meta.total_pages, page + 1)
                    );
                  }}
                  className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
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