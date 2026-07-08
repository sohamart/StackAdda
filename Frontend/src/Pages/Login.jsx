import React, { useState } from "react";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";
import { GraduationCap, ShieldCheck } from "lucide-react";
 
const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4  overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute left-0 top-0 w-96 h-96 bg-orange-500/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-orange-500/20 blur-[140px]" />

      <div className="relative lg:mt-25 mb-5 lg:mb-0 mt-30 z-10 w-full max-w-5xl rounded-3xl overflow-hidden border border-orange-500/20 bg-white/[0.04] backdrop-blur-3xl">

        <div className="grid lg:grid-cols-2">

          {/* ================= LEFT ================= */}

          <div className="hidden lg:flex flex-col justify-center p-10 border-r border-orange-500/10">

            <span className="text-orange-400 uppercase tracking-[6px] text-sm">
              Stack Adda
            </span>

            <h1 className="text-6xl font-black text-white mt-2 leading-tight">
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

            <div className="grid grid-cols-3 gap-2 mt-5">

              <div>
                <h2 className="text-4xl font-bold text-orange-400">
                  1000+
                </h2>

                <p className="text-white/60 mt-2">
                  Students
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-orange-400">
                  50+
                </h2>

                <p className="text-white/60 mt-2">
                  Courses
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-orange-400">
                  95%
                </h2>

                <p className="text-white/60 mt-2">
                  Placement
                </p>
              </div>

            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="p-5 sm:p-6 lg:px-8 lg:py-2 ">

            {/* Logo */}

            <div className="lg:hidden text-center mb-2">

              <h1 className="text-4xl font-black text-white">
                Stack <span className="text-orange-400">Adda</span>
              </h1>

            </div>

            {/* Student/Admin Toggle */}

            <div className="flex bg-white/5 rounded-xl p-2 mb-3 mt-2">

              <button
                onClick={() => {
                  setIsAdmin(false);
                  setIsRegister(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-1 rounded-lg transition ${
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
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition ${
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

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;