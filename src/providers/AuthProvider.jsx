'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from cookie session
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/user/me");
        setUser(data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (payload) => {
    try {
      const res = await api.post("/auth/login", payload); 
      const { data } = await api.get("/user/me");
      setUser(data.data);
      toast.success("Welcome back! Logged in successfully.");
      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Invalid email or password. Please try again.");
    }
  };

  const forgotPassword = async (payload) => {
    try {
      const res = await api.post("/auth/forgot-password", payload);
      toast.success(res?.data?.message || "Password reset instructions sent to your email!");
      return res;
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to process forgot password request. Please try again.");
    }
  };

  const resetPassword = async (payload, token) => {
    try {
      const res = await api.post("/auth/reset-password", payload, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Password reset successfully! Please log in with your new password.");
      return res;
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Invalid or expired reset link. Please request a new one.");
    }
  };
  const googleLogin = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
      const { data } = await api.get("/user/me");
      setUser(data.data);
      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Google sign-in could not be completed.");
    }
  };

  const register = async (payload) => {
    const res = await api.post("/user/register", payload);
    return res;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    toast.info("You have been logged out successfully.");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
