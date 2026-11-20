import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { House, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { register } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/", { replace: true });
    },
    onError: (err: AxiosError<{ error?: string; errors?: string[]; message?: string }>) => {
      const response = err.response?.data;

      setError(
        response?.errors?.join(", ") ||
          response?.error ||
          response?.message ||
          "Unable to create your account. Please try again.",
      );
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please complete all fields.");
      return;
    }

    registerMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Branding panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-emerald-800 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-800">
            <House size={24} />
          </div>
          <span className="text-2xl font-bold">LandChecker</span>
        </Link>

        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
            Get started today
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Your next property journey starts here.
          </h1>
          <p className="mt-6 max-w-md leading-7 text-emerald-100">
            Create an account to explore properties and keep
            your favorite listings in one place.
          </p>
        </div>

        <p className="text-sm text-emerald-200">
          © {new Date().getFullYear()} LandChecker
        </p>

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full border-[50px] border-emerald-700/70" />
        <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full border-[50px] border-emerald-700/70" />
      </div>

      {/* Registration form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <House size={21} />
            </div>
            <span className="text-xl font-bold">
              Land<span className="text-emerald-700">Checker</span>
            </span>
          </Link>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              JOIN LANDCHECKER
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start exploring properties across Cebu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <Mail size={18} className="text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <Lock size={18} className="text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="w-full py-3.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <Lock size={18} className="text-slate-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerMutation.isPending ? "Creating account..." : "Create account"}
              {!registerMutation.isPending && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">
              Sign in
            </Link>
          </p>

          <Link to="/" className="mt-6 block text-center text-sm text-slate-400 hover:text-emerald-700">
            Back to marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
