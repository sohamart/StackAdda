import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Current User
  // ==========================
  const getCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me");

      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Student Register
  // ==========================
  const studentRegister = async (formData) => {
    try {
      const res = await API.post(
        "/auth/student/register",
        formData
      );

      setUser(res.data.user);

      toast.success(res.data.message);

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");

      return false;
    }
  };

  // ==========================
  // Student Login
  // ==========================
  const studentLogin = async (formData) => {
    try {
      const res = await API.post(
        "/auth/student/login",
        formData
      );

      setUser(res.data.user);

      toast.success(res.data.message);

      return true;
    } catch (error) {
      toast.error(error.response?.data.message || "Login Failed");
      

      return false;
    }
  };

  // ==========================
  // Admin Login
  // ==========================
  const adminLogin = async (formData) => {
    try {
      const res = await API.post(
        "/auth/admin/login",
        formData
      );

      setUser(res.data.user);

      toast.success(res.data.message);

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message);

      return false;
    }
  };

  // ==========================
  // Logout
  // ==========================
  const logout = async () => {
    try {
      await API.post("/auth/logout");

      setUser(null);

      toast.success("Logout Successful");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        studentLogin,
        studentRegister,
        adminLogin,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);