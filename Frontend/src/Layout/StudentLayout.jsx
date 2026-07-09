import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar/Navbar";

const StudentLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>

          <h2 className="text-white text-lg font-semibold">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />

      <main className="pt-28 px-5 md:px-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;