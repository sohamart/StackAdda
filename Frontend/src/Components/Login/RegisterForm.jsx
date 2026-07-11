import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const RegisterForm = ({ setIsRegister }) => {
  const navigate = useNavigate();

  const { studentRegister } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      const success = await studentRegister(formData);

      if (success) {
        navigate("/student");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white">
        Create Account
      </h2>

      <p className="mt-1 text-sm text-white/60">
        Join Stack Adda and start learning.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4"
      >
        {/* Name */}

        <div className="relative">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            size={20}
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
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

        {/* Email */}

        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            size={20}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
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

        {/* Register Button */}

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
          {loading ? "Creating Account..." : "Register"}
        </button>
        
      </form>

      <p className="mt-4 text-center text-white/60">
        Already have an account?{" "}
        <button
          onClick={() => setIsRegister(false)}
          className="font-semibold text-orange-400 hover:text-orange-300"
        >
          Login
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
