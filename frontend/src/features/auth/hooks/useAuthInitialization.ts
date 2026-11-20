import { useEffect, useRef } from "react";
import { getCurrentUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export function useAuthInitialization() {
  const hasInitialized = useRef(false);

  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    async function initializeAuth() {
      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        // Token is invalid or expired.
        logout();
      } finally {
        setInitialized(true);
      }
    }

    initializeAuth();
  }, [token, setUser, logout, setInitialized]);
}
