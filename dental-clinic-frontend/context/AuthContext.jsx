"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../lib/api";
import GreetingOverlay from "../components/GreetingOverlay";

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
  const [greetingState, setGreetingState] = useState({
    active: false,
    type: "login",
    user: null,
  });

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

      // Trigger Welcome Glassmorphism Overlay
      setGreetingState({ active: true, type: "login", user: res.user });
      await new Promise((resolve) => setTimeout(resolve, 2200));
      setGreetingState({ active: false, type: "login", user: null });
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
    if (!user) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      if (typeof window !== "undefined") window.location.href = "/login";
      return;
    }

    // Trigger Goodbye Glassmorphism Overlay
    setGreetingState({ active: true, type: "logout", user });
    setTimeout(() => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setGreetingState({ active: false, type: "logout", user: null });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }, 1800);
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
      <GreetingOverlay
        active={greetingState.active}
        type={greetingState.type}
        user={greetingState.user}
      />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
