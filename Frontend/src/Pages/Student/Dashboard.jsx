import React, { useEffect, useState } from "react";
import {
  User,
  AlertTriangle,
  Send,
  Loader2,
  PlayCircle,
  ReceiptText,
  WalletCards,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import API from "../../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  const handleResend = async () => {
    try {
      setResending(true);
      await API.post("/auth/resend-verification");
      toast.success("Verification email sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    // Fetch orders count or similar stats if endpoint exists
    API.get("/student/orders")
      .then(({ data }) => {
        setOrdersCount(data.orders?.length || 0);
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      title: "Account Status",
      value: user?.isVerified ? "Verified" : "Pending",
      icon: <CheckCircle size={28} className={user?.isVerified ? "text-green-400" : "text-yellow-400"} />,
    },
    {
      title: "Total Orders",
      value: ordersCount,
      icon: <ReceiptText size={28} className="text-blue-400" />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute -top-20 rounded-t-3xl left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative z-10 space-y-10">
        {!user?.isVerified && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-400 shrink-0" size={24} />
              <div>
                <p className="font-semibold text-yellow-200">Please verify your email</p>
                <p className="text-sm text-yellow-400/80">Check your inbox for a verification link to secure your account.</p>
              </div>
            </div>
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/30 disabled:opacity-50"
            >
              {resending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Resend Email
            </button>
          </div>
        )}

        {/* Hero Banner */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div>
              <p className="text-orange-400 font-medium">Welcome Back 👋</p>
              <h1 className="mt-2 text-4xl font-bold">{user?.name}</h1>
              <div className="mt-6">
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                    user?.isVerified
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {user?.isVerified ? "Verified Student" : "Pending Verification"}
                </span>
              </div>
              <p className="mt-3 text-white/60 max-w-xl">
                Access your resources, track your order history, or check our latest YouTube programming tutorials.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/student/profile"
                  className="rounded-xl bg-orange-600 px-6 py-3 font-semibold transition hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,.4)]"
                >
                  View Profile
                </Link>
                <Link
                  to="/courses"
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 transition hover:border-orange-500"
                >
                  Watch Tutorials
                </Link>
              </div>
            </div>

            <div className="h-48 w-48 rounded-full border border-orange-500/30 bg-white/[0.04] backdrop-blur-md flex items-center justify-center self-center overflow-hidden">
              {user?.profileImage?.url ? (
                <img src={user.profileImage.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <User size={70} className="text-orange-400" />
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 transition duration-300 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(249,115,22,.18)]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/60 font-medium">{item.title}</p>
                  <h2 className="mt-3 text-4xl font-bold">{item.value}</h2>
                </div>
                <div className="text-orange-400 p-3 bg-white/5 rounded-2xl">{item.icon}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Watch Tutorials Banner */}
        <section className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-600/20 to-orange-500/5 backdrop-blur-md p-8 mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PlayCircle className="text-red-500" /> YouTube Programming Tutorials
          </h2>
          <p className="mt-3 text-white/60">
            Check out our latest video content on web development, full-stack tools, and technical concept breakdowns on our YouTube channel.
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold transition hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            Go to Videos
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
