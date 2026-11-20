import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, UserRound } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function AuthActions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-semibold text-slate-700 hover:text-emerald-700"
        >
          Log in
        </Link>

        <Link
          to="/register"
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden items-center gap-2 sm:flex">
        <UserRound size={18} className="text-emerald-700" />
        <span className="max-w-40 truncate text-sm font-medium text-slate-700">
          {user?.email}
        </span>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-600"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
