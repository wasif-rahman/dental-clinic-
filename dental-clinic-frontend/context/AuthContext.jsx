"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../lib/api";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAdmin: false,
  isDoctor: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Session restored failed:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  async function login(credentials) {
    const res = await loginUser(credentials);
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  }

  async function register(payload) {
    const res = await registerUser(payload);
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  const isAdmin = user?.role === "ADMIN";
  const isDoctor = user?.role === "DOCTOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
