import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./Layout/MainLayout";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import StudentDashboard from "./Pages/StudentDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import Profile from "./Pages/Profile";

// Auth
import ProtectedRoute from "./Routes/ProtectedRoute";

const App = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Student Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
            404 | Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default App;