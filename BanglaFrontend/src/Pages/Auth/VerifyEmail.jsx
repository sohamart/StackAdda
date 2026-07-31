import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import API from "../../api/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    API.post("/auth/verify-email", { token })
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The token may be invalid or expired.");
      });
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-8 shadow-2xl text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-white">Verifying Email...</h2>
            <p className="mt-2 text-white/60">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-white">Success!</h2>
            <p className="mt-2 text-white/60">{message}</p>
            <Link
              to="/student"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-600"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
            <p className="mt-2 text-white/60">{message}</p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
