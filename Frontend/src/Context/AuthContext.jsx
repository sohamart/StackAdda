import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
  setLoading(true);

  try {
    const { data } = await API.get("/auth/student/me");
    setUser(data.student);
  } catch (err) {
    try {
      const { data } = await API.get("/auth/admin/me");
      setUser(data.admin);
    } catch {
      setUser(null);
    }
  }

  setLoading(false);
};

  const logout = async () => {
  try {
    const { data } = await API.post("/auth/logout");

    setUser(null);

    return data;

  } catch (error) {
    console.log(error);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        getUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);