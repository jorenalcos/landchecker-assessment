import { useEffect, useState, type FormEvent } from "react";
import {
  X,
  Loader2,
  Building2,
} from "lucide-react";

import { useCreateProperty } from "../hooks/useCreateProperty";
import type { CreatePropertyPayload } from "../../properties/api/propertyApi";
import type { Property } from "../../properties/types/property";
import { useUpdateProperty } from "../hooks/useUpdateProperty";

interface PropertyFormProps {
  onClose: () => void;
  initialData?: Property | null;
}

const initialForm: CreatePropertyPayload = {
  title: "",
  description: "",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  property_type: "House",
  address: "",
  status: "available",
};

export default function PropertyForm({
  onClose,
  initialData,
}: PropertyFormProps) {
  const [form, setForm] = useState<CreatePropertyPayload>({
    ...initialForm,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();

  const isEditing = Boolean(initialData);
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description ?? "",
        price: Number(initialData.price),
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms ?? 0,
        property_type: initialData.property_type,
        address: initialData.address,
        status: initialData.status,
      });
    } else {
      setForm({ ...initialForm });
    }

    setErrors({});
  }, [initialData]);

  function updateField(
    field: keyof CreatePropertyPayload,
    value: string | number
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      nextErrors.title = "Property title is required.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!form.price || form.price <= 0) {
      nextErrors.price = "Enter a price greater than zero.";
    }

    if (!Number.isInteger(form.bedrooms) || form.bedrooms < 0) {
      nextErrors.bedrooms = "Enter a valid bedroom count.";
    }

    if (
      !form.property_type.trim()
    ) {
      nextErrors.property_type = "Property type is required.";
    }

    if (
      form.bathrooms !== undefined &&
      (!Number.isInteger(form.bathrooms) || form.bathrooms < 0)
    ) {
      nextErrors.bathrooms = "Enter a valid bathroom count.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    if (initialData) {
      updateMutation.mutate(
        {
          id: initialData.id,
          payload: form,
        },
        {
          onSuccess: () => onClose(),
          onError: (error: any) => {
            const apiErrors = error.response?.data?.errors;

            setErrors({
              form: Array.isArray(apiErrors)
                ? apiErrors.join(", ")
                : "Unable to update property. Please try again.",
            });
          },
        }
      );

      return;
    }

    createMutation.mutate(form, {
      onSuccess: () => onClose(),
      onError: (error: any) => {
        const apiErrors = error.response?.data?.errors;

        setErrors({
          form: Array.isArray(apiErrors)
            ? apiErrors.join(", ")
            : "Unable to create property. Please try again.",
        });
      },
    });
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  const labelClass =
    "text-sm font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                {isEditing ? "Edit Property" : "Add Property"}
              </h2>
              <p className="text-xs text-slate-500">
                Enter the property listing details.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {errors.form && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <div>
            <label className={labelClass}>Property Title *</label>
            <input
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="e.g. Modern House in Carcar"
              className={inputClass}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the property..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Price (PHP) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price || ""}
                onChange={(event) =>
                  updateField("price", Number(event.target.value))
                }
                placeholder="2500000"
                className={inputClass}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Property Type *</label>
              <select
                value={form.property_type}
                onChange={(event) =>
                  updateField("property_type", event.target.value)
                }
                className={inputClass}
              >
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Condominium">Condominium</option>
                <option value="Commercial">Commercial</option>
              </select>
              {errors.property_type && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.property_type}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Bedrooms *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.bedrooms}
                onChange={(event) =>
                  updateField("bedrooms", Number(event.target.value))
                }
                className={inputClass}
              />
              {errors.bedrooms && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bedrooms}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Bathrooms</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.bathrooms ?? 0}
                onChange={(event) =>
                  updateField("bathrooms", Number(event.target.value))
                }
                className={inputClass}
              />
              {errors.bathrooms && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.bathrooms}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Property Address *</label>
            <input
              value={form.address}
              onChange={(event) =>
                updateField("address", event.target.value)
              }
              placeholder="Carcar City, Cebu"
              className={inputClass}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">
                {errors.address}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Listing Status</label>
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value)
              }
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {isPending
                ? "Saving..."
                : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
