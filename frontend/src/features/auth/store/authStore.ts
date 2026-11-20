import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isInitialized: true,
        }),

      setUser: (user) => set({ user }),

      setInitialized: (value) =>
        set({ isInitialized: value }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
        }),
    }),
    {
      name: "landchecker-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
