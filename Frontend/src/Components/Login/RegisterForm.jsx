import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import API from "../../api/axios";
import { toast } from "react-toastify";

const RegisterForm = ({ setIsRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    return toast.error("Please fill all fields");
  }

  if (formData.password !== formData.confirmPassword) {
    return toast.error("Passwords do not match");
  }

  try {
    setLoading(true);

    const { data } = await API.post("/auth/student/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    toast.success(data.message);

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setIsRegister(false);

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Registration Failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <>
      <h2 className="text-3xl font-bold text-white">
        Create Account
      </h2>

      <p className="mt-2 text-white/60">
        Join Stack Adda and start your journey.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* Name */}

        <div className="relative">
          <User
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
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
            py-4
            pl-12
            pr-4
            text-white
            outline-none
            focus:border-orange-500
            "
          />
        </div>

        {/* Phone */}

        <div className="relative">
          <Phone
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            py-4
            pl-12
            pr-4
            text-white
            outline-none
            focus:border-orange-500
            "
          />
        </div>

        {/* Email */}

        <div className="relative">
          <Mail
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
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
            py-4
            pl-12
            pr-4
            text-white
            outline-none
            focus:border-orange-500
            "
          />
        </div>

        {/* Password */}

        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
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
            py-4
            pl-12
            pr-12
            text-white
            outline-none
            focus:border-orange-500
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}

        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
          />

          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            py-4
            pl-12
            pr-12
            text-white
            outline-none
            focus:border-orange-500
            "
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Register Button */}

        <button
          disabled={loading}
          className="
          w-full
          rounded-xl
          bg-orange-600
          py-4
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

      <p className="mt-8 text-center text-white/60">
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