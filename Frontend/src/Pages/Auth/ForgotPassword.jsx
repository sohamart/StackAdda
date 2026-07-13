import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    
    try {
      setLoading(true);
      await API.post("/forgot-password", { email });
      setSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#111113] p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl bg-orange-500/10 p-4 text-center">
            <Mail className="mx-auto mb-2 text-orange-500" size={32} />
            <p className="text-orange-200">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:bg-orange-500/50"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-medium text-orange-500 hover:text-orange-400"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
