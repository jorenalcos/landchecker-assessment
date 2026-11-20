import {
  Building2,
  Users,
  Eye,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Total Properties",
    value: "—",
    icon: Building2,
  },
  {
    label: "Registered Users",
    value: "—",
    icon: Users,
  },
  {
    label: "Property Views",
    value: "—",
    icon: Eye,
  },
  {
    label: "New Listings",
    value: "—",
    icon: TrendingUp,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome to LandChecker administration.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <div className="rounded-xl bg-emerald-50 p-3">
                    <Icon
                      size={20}
                      className="text-emerald-700"
                    />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Recent property and user activity will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
