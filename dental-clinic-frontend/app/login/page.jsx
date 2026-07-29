"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white border border-parchment-400 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding Hero Banner */}
        <div className="bg-space_indigo p-8 md:p-12 text-parchment flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-space_indigo-600/40 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-almond_silk-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-space_indigo-400/30 border border-space_indigo-600 rounded-full text-xs text-almond_silk font-medium mb-6">
              <span>✨</span>
              <span>NextGen Dental Platform</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Welcome back to your practice.
            </h1>
            <p className="text-sm text-dusty_grape-800 mt-3 leading-relaxed">
              Streamline appointments, manage doctor schedules, and provide exceptional patient care with intelligent role-based access.
            </p>
          </div>

          <div className="mt-8 space-y-3 pt-6 border-t border-space_indigo-600/50">
            <div className="flex items-center gap-3 text-xs text-parchment-900">
              <span className="w-5 h-5 rounded-full bg-space_indigo-600/60 flex items-center justify-center text-almond_silk font-bold">✓</span>
              <span>Role-Based Dashboards for Doctors & Admins</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-parchment-900">
              <span className="w-5 h-5 rounded-full bg-space_indigo-600/60 flex items-center justify-center text-almond_silk font-bold">✓</span>
              <span>Encrypted JWT Authentication</span>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-space_indigo">Sign In</h2>
            <p className="text-xs text-dusty_grape mt-1">
              Enter your credentials to access your staff portal
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-space_indigo mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="doctor@clinic.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-parchment-800/40 border border-parchment-400 rounded-xl text-sm text-space_indigo placeholder-dusty_grape-700 focus:outline-none focus:ring-2 focus:ring-space_indigo-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-space_indigo mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 pr-10 bg-parchment-800/40 border border-parchment-400 rounded-xl text-sm text-space_indigo placeholder-dusty_grape-700 focus:outline-none focus:ring-2 focus:ring-space_indigo-600 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dusty_grape hover:text-space_indigo transition focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 text-space_indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-dusty_grape" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-space_indigo text-parchment font-semibold rounded-xl text-sm shadow-md hover:bg-space_indigo-600 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In to Portal →"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-dusty_grape">
            Don't have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-space_indigo hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
