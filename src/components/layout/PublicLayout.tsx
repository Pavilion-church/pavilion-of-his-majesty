import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "./auth/AuthProvider";

export default function PublicLayout() {
  const location = useLocation();
  const { loading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6F1] px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D6B45A] border-t-transparent" />
          <p className="text-sm text-[#07152F]/70">
            Loading your Pavilion account...
          </p>
        </div>
      </main>
    );
  }

  // Allow administrators to browse public pages without signing out.
  // Continue redirecting authenticated members to their member dashboard.
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/member" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#111827]">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
