import { Routes, Route } from "react-router-dom";

import MarketplacePage from "../features/properties/pages/MarketplacePage";
import PropertyDetailsPage from "../features/properties/pages/PropertyDetailsPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import WatchlistPage from "../features/watchlists/pages/WatchlistPage";

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
    </Routes>
  );
}
