import { useEffect, useState } from "react";
import LoginForm from "..//Components//Login//LoginForm";
import RegisterForm from "..//Components//Login//RegisterForm";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
 
const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, loading, studentGoogleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    navigate(user.role === "admin" ? "/admin" : "/student", {
      replace: true,
    });
  }, [user, loading, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-28 sm:px-6 lg:py-32">

      {/* Background Glow */}
      <div className="absolute  left-0 top-0 w-96 h-96 lg:bg-orange-500/20 bg-orange-500/5 blur-[140px]" />
      <div className="absolute right-0 bottom-0 w-96 h-96 lg:bg-orange-500/20 bg-orange-500/5 blur-[140px]" />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-orange-500/20 bg-white/[0.04] backdrop-blur-3xl sm:rounded-3xl">

        <div className="grid lg:grid-cols-2">

          {/* ================= LEFT ================= */}

          <div className="hidden flex-col justify-center border-r border-orange-500/10 p-8 lg:flex xl:p-10">

            <span className="text-orange-400 uppercase tracking-[6px] text-sm">
              Stack Adda
            </span>

            <h1 className="mt-2 text-5xl font-black leading-tight text-white xl:text-6xl">
              Learn.
              <br />
              Build.
              <br />
              Get Placed.
            </h1>

            <p className="mt-6 text-white/60 text-lg leading-8">
              Learn Web Development, DSA, AI and crack your dream placement
              with industry level courses.
            </p>

            {/* Stats */}

            <div className="mt-5 grid grid-cols-3 gap-3">

              <div>
                <h2 className="text-3xl font-bold text-orange-400 xl:text-4xl">
                  1000+
                </h2>

                <p className="text-white/60 mt-2">
                  Students
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-400 xl:text-4xl">
                  50+
                </h2>

                <p className="text-white/60 mt-2">
                  Courses
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-400 xl:text-4xl">
                  95%
                </h2>

                <p className="text-white/60 mt-2">
                  Placement
                </p>
              </div>

            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="p-5 sm:p-7 lg:p-8">

            {/* Logo */}

            <div className="lg:hidden text-center mb-2">

              <h1 className="text-4xl font-black text-white">
                Stack <span className="text-orange-400">Adda</span>
              </h1>

            </div>

            {/* Student/Admin Toggle */}

            <div className="mb-4 mt-2 flex rounded-xl bg-white/5 p-2">

              <button
                onClick={() => {
                  setIsAdmin(false);
                  setIsRegister(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 transition ${
                  !isAdmin
                    ? "bg-orange-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <GraduationCap size={18} />
                Student
              </button>

              <button
                onClick={() => {
                  setIsAdmin(true);
                  setIsRegister(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 transition ${
                  isAdmin
                    ? "bg-orange-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <ShieldCheck size={18} />
                Admin
              </button>

            </div>

            {/* Form */}

            {isRegister ? (
              <RegisterForm
                setIsRegister={setIsRegister}
              />
            ) : (
              <LoginForm
                isAdmin={isAdmin}
                setIsRegister={setIsRegister}
              />
            )}


            {!isAdmin && !isRegister && (
              <div className="mt-5 flex flex-col items-center justify-center rounded-xl py-1.5">
                <p className="mb-4 text-sm text-white/60">Or continue with</p>
                <div className="w-full max-w-[320px] overflow-hidden rounded-xl bg-orange-500/20 p-2">
                  <GoogleLogin
                    theme="outline"
                    shape="rectangular"
                    width="300"
                    text="continue_with"
                    onSuccess={async ({ credential }) => {
                      const success = await studentGoogleLogin(credential);
                      if (success) navigate("/student");
                    }}
                    onError={() =>
                      toast.error("Google sign-in was cancelled or failed.")
                    }
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
