import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UseGetCurrentUser from "./hooks/UseGetCurrentUser";
import DashBoard from "./pages/DashBoard";
import Generate from "./pages/Generate";
import { useSelector } from "react-redux";

import EditorPage from "./pages/editor/EditorPage";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";

export const serverUrl = import.meta.env.DEV
  ? "http://localhost:3000"
  : "";

// Reusable Auth Guard
const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useSelector((state) => state.userDetails);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  UseGetCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/site/:slug" element={<LiveSite />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected Routes (Refresh par Home nahi jayega) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
