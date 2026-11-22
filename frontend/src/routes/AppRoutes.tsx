import { Routes, Route } from "react-router-dom";

import MarketplacePage from "../features/properties/pages/MarketplacePage";
import PropertyDetailsPage from "../features/properties/pages/PropertyDetailsPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import WatchlistPage from "../features/watchlists/pages/WatchlistPage";
import AdminRoute from "../features/admin/components/AdminRoute";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import AdminLayout from "../features/admin/components/AdminLayout";
import AdminPropertiesPage from "../features/admin/pages/AdminPropertiesPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MarketplacePage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboardPage />}
          />
          <Route
            path="/admin/properties"
            element={<AdminPropertiesPage />}
          />
        </Route>
      </Route>
    </Routes>

  );
}
