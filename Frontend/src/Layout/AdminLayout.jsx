import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar/Navbar";
import AdminNav from "../Components/Admin/AdminNav";

const AdminLayout = () => {
  const { user, loading } = useAuth();

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>

          <h2 className="text-white text-lg font-semibold">
            Loading Admin Panel...
          </h2>
        </div>
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Not Admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />

      <main className="pt-28 px-5 md:px-8 lg:px-10">
        <AdminNav />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
