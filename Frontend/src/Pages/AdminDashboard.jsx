import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCog,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <div className="border-b border-orange-500/20 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <h1 className="text-2xl font-bold">
            Stack <span className="text-orange-500">Adda</span>
          </h1>

          <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold hover:bg-orange-600 transition">
            Logout
          </button>

        </div>
      </div>

      {/* Content */}

      <div className="mx-auto max-w-7xl px-5 py-10">

        {/* Welcome */}

        <div className="rounded-3xl border border-orange-500/20 bg-white/5 p-8">

          <h2 className="text-3xl font-bold">
            Welcome Admin 👋
          </h2>

          <p className="mt-2 text-white/60">
            Manage students, courses and platform.
          </p>

        </div>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">
            <Users className="text-orange-500" size={35} />

            <h2 className="mt-4 text-3xl font-bold">
              120
            </h2>

            <p className="text-white/60">
              Students
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">
            <BookOpen className="text-orange-500" size={35} />

            <h2 className="mt-4 text-3xl font-bold">
              12
            </h2>

            <p className="text-white/60">
              Courses
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">
            <UserCog className="text-orange-500" size={35} />

            <h2 className="mt-4 text-3xl font-bold">
              2
            </h2>

            <p className="text-white/60">
              Admins
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-white/5 p-6">
            <Settings className="text-orange-500" size={35} />

            <h2 className="mt-4 text-xl font-semibold">
              Settings
            </h2>

            <p className="text-white/60">
              Manage
            </p>
          </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link
            to="/students"
            className="rounded-2xl border border-orange-500/20 bg-white/5 p-6 hover:border-orange-500 transition"
          >
            <h2 className="text-xl font-bold">
              Manage Students
            </h2>

            <p className="mt-2 text-white/60">
              View all registered students.
            </p>

          </Link>

          <Link
            to="/profile"
            className="rounded-2xl border border-orange-500/20 bg-white/5 p-6 hover:border-orange-500 transition"
          >
            <h2 className="text-xl font-bold">
              Admin Profile
            </h2>

            <p className="mt-2 text-white/60">
              Update your profile.
            </p>

          </Link>

          <button className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-left hover:bg-red-500/20 transition">

            <LogOut className="text-red-400" size={35} />

            <h2 className="mt-4 text-xl font-bold">
              Logout
            </h2>

            <p className="mt-2 text-white/60">
              Sign out securely.
            </p>

          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
