import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

const StudentDashboard = () => {

     const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const data = await logout();

      toast.success(data?.message || "Logout Successful");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 500);

    } catch (error) {
      toast.error("Logout Failed");
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <div className="border-b border-orange-500/20 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <h1 className="text-2xl font-bold">
            Stack <span className="text-orange-500">Adda</span>
          </h1>

          <button onClick={handleLogout} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold hover:bg-orange-600 transition">
            Logout
          </button>

        </div>
      </div>

      {/* Content */}

      <div className="mx-auto max-w-7xl px-5 py-10">

        {/* Welcome Card */}

        <div className="rounded-3xl border border-orange-500/20 bg-white/5 p-8 backdrop-blur-xl">

          <h2 className="text-3xl font-bold">
            Welcome 👋 Soham
          </h2>

          <p className="mt-2 text-white/60">
            Welcome back to Stack Adda.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Link
            to="/profile"
            className="rounded-2xl border border-orange-500/20 bg-white/5 p-6 transition hover:border-orange-500 hover:bg-white/10"
          >
            <User className="text-orange-500" size={35} />

            <h3 className="mt-4 text-xl font-semibold">
              Profile
            </h3>

            <p className="mt-2 text-sm text-white/60">
              View your profile.
            </p>
          </Link>

          <Link
            to="/courses"
            className="rounded-2xl border border-orange-500/20 bg-white/5 p-6 transition hover:border-orange-500 hover:bg-white/10"
          >
            <BookOpen className="text-orange-500" size={35} />

            <h3 className="mt-4 text-xl font-semibold">
              My Courses
            </h3>

            <p className="mt-2 text-sm text-white/60">
              View enrolled courses.
            </p>
          </Link>

          <Link
            to="/settings"
            className="rounded-2xl border border-orange-500/20 bg-white/5 p-6 transition hover:border-orange-500 hover:bg-white/10"
          >
            <Settings className="text-orange-500" size={35} />

            <h3 className="mt-4 text-xl font-semibold">
              Settings
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Manage your account.
            </p>
          </Link>

          <button onClick={handleLogout}
            className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-left transition hover:border-red-500 hover:bg-red-500/20"
          >
            <LogOut className="text-red-400" size={35} />

            <h3 className="mt-4 text-xl font-semibold">
              Logout
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Logout from account.
            </p>
          </button>

        </div>

        {/* Continue Learning */}

        <div className="mt-10 rounded-3xl border border-orange-500/20 bg-white/5 p-8">

          <div className="flex items-center gap-3">

            <GraduationCap
              className="text-orange-500"
              size={30}
            />

            <h2 className="text-2xl font-bold">
              Continue Learning
            </h2>

          </div>

          <div className="mt-6 rounded-2xl bg-black/40 p-5">

            <h3 className="text-xl font-semibold">
              MERN Stack Development
            </h3>

            <p className="mt-2 text-white/60">
              Continue where you left off.
            </p>

            <button className="mt-5 rounded-lg bg-orange-500 px-5 py-2 font-semibold hover:bg-orange-600 transition">
              Continue
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;