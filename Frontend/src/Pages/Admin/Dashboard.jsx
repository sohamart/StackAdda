import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Bell,
  Plus,
  UserPlus,
} from "lucide-react";

import API from "../../api/axios";

import StatCard from "../../Components/Admin/StatCard";
import QuickAction from "../../Components/Admin/QuickAction";
import RecentStudents from "../../Components/Admin/RecentStudents";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAdmins: 0,
    verifiedStudents: 0,
    unverifiedStudents: 0,
  });

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const { data } = await API.get(
          "/admin/dashboard",
          {
            withCredentials: true,
          }
        );

        setStats(data.stats);

        setStudents(data.recentStudents);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
    if (loading) {
    return (
      <div className="flex h-[75vh]  items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

          <p className="mt-5 text-white/60">
            Loading Dashboard...
          </p>

        </div>

      </div>
    );
  }
    return (
    <div className="space-y-8 pb-2">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-white/50">
            Welcome back 👋
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <QuickAction
            title="Add Course"
            icon={<Plus size={18} />}
          />

          <QuickAction
            title="Add Student"
            icon={<UserPlus size={18} />}
          />

          <QuickAction
            title="Notifications"
            icon={<Bell size={18} />}
          />

        </div>

      </div>
            {/* Stats */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={28} />}
          color="orange"
        />

        <StatCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={<ShieldCheck size={28} />}
          color="blue"
        />

        <StatCard
          title="Verified"
          value={stats.verifiedStudents}
          icon={<UserCheck size={28} />}
          color="green"
        />

        <StatCard
          title="Pending"
          value={stats.unverifiedStudents}
          icon={<UserX size={28} />}
          color="red"
        />

      </div>

      {/* Main Section */}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

        {/* Recent Students */}

        <div className="xl:col-span-2">

          <RecentStudents students={students} />

        </div>

        {/* Quick Overview */}

        <div
          className="
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-6
"
        >

          <h2 className="text-2xl font-bold text-white">
            Quick Overview
          </h2>

          <div className="mt-8 space-y-5">

            <div className="flex items-center justify-between">

              <span className="text-white/60">
                Total Students
              </span>

              <span className="font-bold text-orange-400">
                {stats.totalStudents}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-white/60">
                Verified Students
              </span>

              <span className="font-bold text-green-400">
                {stats.verifiedStudents}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-white/60">
                Pending Verification
              </span>

              <span className="font-bold text-yellow-400">
                {stats.unverifiedStudents}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-white/60">
                Total Admins
              </span>

              <span className="font-bold text-cyan-400">
                {stats.totalAdmins}
              </span>

            </div>

          </div>

        </div>

      </div>
          </div>
  );
};

export default Dashboard;