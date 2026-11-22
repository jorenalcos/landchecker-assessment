import { useState } from "react";
import { useProperties } from "../../properties/hooks/useProperties";
import type { Property } from "../../properties/types/property";
import PropertyForm from "../components/PropertyForm";
import { useDeleteProperty } from "../hooks/useDeleteProperty";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const deleteMutation = useDeleteProperty();

  const { data, isLoading, isError } = useProperties({
    page,
    per_page: 10,
    search: search.trim() || undefined,
  });

  const properties = data?.properties ?? [];
  const meta = data?.meta;

  function handleDelete() {
    if (!propertyToDelete || deleteMutation.isPending) return;

    deleteMutation.mutate(propertyToDelete.id, {
      onSuccess: () => {
        setPropertyToDelete(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
            Management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Properties
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all property listings on LandChecker.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedProperty(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title or address..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            All Properties
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {meta?.total_count ?? 0} properties found
          </p>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading properties...
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-600">
            Unable to load properties. Please try again.
          </div>
        ) : properties.length === 0 ? (
          <div className="p-10 text-center">
            <Building2
              size={32}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 font-medium text-slate-700">
              No properties found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or add a property.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Property</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {property.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {property.address}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {property.property_type}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-900">
                      ₱{Number(property.price).toLocaleString("en-PH")}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                        {property.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View property"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit property"
                          onClick={() => {
                            setSelectedProperty(property);
                            setIsFormOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete property"
                          onClick={() => setPropertyToDelete(property)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Page {meta.current_page} of {meta.total_pages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= meta.total_pages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {isFormOpen && (
        <PropertyForm
          initialData={selectedProperty}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}

      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-property-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-property-title"
              className="text-lg font-bold text-slate-900"
            >
              Delete Property?
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <strong>{propertyToDelete.title}</strong>?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
            </p>

            {deleteMutation.isError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                Unable to delete the property. Please try again.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => setPropertyToDelete(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
