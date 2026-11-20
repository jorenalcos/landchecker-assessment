import { Routes, Route } from "react-router-dom";

import MarketplacePage from "../features/properties/pages/MarketplacePage";
import PropertyDetailsPage from "../features/properties/pages/PropertyDetailsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MarketplacePage />} />
      <Route
        path="/properties/:id"
        element={<PropertyDetailsPage />}
      />
    </Routes>
  );
}
