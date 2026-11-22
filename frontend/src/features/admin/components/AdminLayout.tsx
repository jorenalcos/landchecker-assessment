import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { useAuthStore } from "../../auth/store/authStore";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navigation = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
  ];

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Building2 size={22} />
          </div>
          <div>
            <Link to="/" className="flex items-center gap-3">
              {/* Keep your existing logo icon */}
              <span className="font-bold">
                LandChecker
              </span>
            </Link>
            <p className="text-xs text-slate-400">Administration</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-7">
        {navigation.map((section) => (
          <div key={section.label}>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {section.label}
            </p>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                  <ChevronRight size={16} className="ml-auto" />
                </NavLink>
              );
            })}
          </div>
        ))}

        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Management
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <Link to="/admin/properties" className="flex items-center gap-3">
                <Building2 size={19} />
                Properties
              </Link>
            </div>

            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <Users size={19} />
              Users
              <span className="ml-auto text-[10px]">SOON</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <Settings size={19} />
              Settings
              <span className="ml-auto text-[10px]">SOON</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl bg-white/5 p-3">
          <p className="truncate text-sm font-medium text-white">
            {user?.email ?? "Administrator"}
          </p>
          <p className="mt-1 text-xs capitalize text-emerald-400">
            {user?.role ?? "Admin"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative h-full w-72 max-w-[85vw]">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Admin Panel
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your LandChecker marketplace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">
                {user?.email}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              {user?.email?.charAt(0).toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
