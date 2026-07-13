import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const LoginForm = ({ isAdmin, setIsRegister }) => {
  const navigate = useNavigate();

  const { studentLogin, adminLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      let success = false;

      if (isAdmin) {
        success = await adminLogin(formData);

        if (success) {
          navigate("/admin");
        }
      } else {
        success = await studentLogin(formData);

        if (success) {
          navigate("/student");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white">
        {isAdmin ? "Admin Login" : "Welcome Back"}
      </h2>

      <p className="mt-1 text-sm text-white/60">
        {isAdmin
          ? "Login to admin dashboard."
          : "Login to continue learning."}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Email */}

        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            size={20}
          />

          <input
            type="email"
            name="email"
            placeholder={isAdmin ? "Admin Email" : "Email Address"}
            value={formData.email}
            onChange={handleChange}
            className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            py-3
            pl-12
            pr-4
            text-white
            outline-none
            transition
            focus:border-orange-500
            "
          />
        </div>

        {/* Password */}

        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            size={20}
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            py-3
            pl-12
            pr-12
            text-white
            outline-none
            transition
            focus:border-orange-500
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="
          w-full
          rounded-xl
          bg-orange-600
          py-3
          font-semibold
          text-white
          transition
          hover:bg-orange-500
          hover:shadow-[0_0_25px_rgba(249,115,22,.5)]
          active:scale-95
          disabled:opacity-60
          "
        >
          {loading
            ? "Please Wait..."
            : isAdmin
            ? "Admin Login"
            : "Login"}
        </button>

      </form>

      {/* Register */}

      {!isAdmin && (
        <p className="mt-4 text-center text-white/60">
          Don't have an account?{" "}
          <button
            onClick={() => setIsRegister(true)}
            className="font-semibold text-orange-400 hover:text-orange-300"
          >
            Register
          </button>
        </p>
      )}
    </>
  );
};

export default LoginForm;
