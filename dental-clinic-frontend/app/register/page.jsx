"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Removed 'role' since the backend now forces all public registrations to "DOCTOR"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Using fetch instead of useAuth so we don't automatically log the user in
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register. Please try again.");
      }

      // Display the pending verification message from the backend
      setSuccessMessage(data.message);
      
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message || "Failed to register. Please try again.");
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
              <span>Staff Registration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Join the Dental Clinic Network.
            </h1>
            <p className="text-sm text-dusty_grape-800 mt-3 leading-relaxed">
              Register as a Doctor to manage your personal schedule and patients. All new accounts require Administrator approval before access is granted.
            </p>
          </div>

          <div className="mt-8 space-y-3 pt-6 border-t border-space_indigo-600/50">
            <div className="flex items-center gap-3 text-xs text-parchment-900">
              <span className="w-5 h-5 rounded-full bg-space_indigo-600/60 flex items-center justify-center text-almond_silk font-bold">1</span>
              <span>Submit your credentials</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-parchment-900">
              <span className="w-5 h-5 rounded-full bg-space_indigo-600/60 flex items-center justify-center text-almond_silk font-bold">2</span>
              <span>Wait for Admin verification</span>
            </div>
          </div>
        </div>

        {/* Right Register Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          
          {successMessage ? (
            <div className="flex flex-col items-center text-center py-8 animate-fadeIn">
              <div className="w-16 h-16 bg-space_indigo-50 rounded-full flex items-center justify-center mb-6 border border-space_indigo-100">
                <svg className="w-8 h-8 text-space_indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-space_indigo mb-3">Registration Received</h3>
              <p className="text-sm text-dusty_grape mb-8 leading-relaxed">
                {successMessage}
              </p>
              <Link
                href="/login"
                className="w-full py-3 px-4 bg-space_indigo text-parchment font-semibold rounded-xl text-sm shadow-md hover:bg-space_indigo-600 active:scale-[0.99] transition text-center"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-space_indigo">Create Account</h2>
                <p className="text-xs text-dusty_grape mt-1">
                  Fill in your details to register as a Doctor
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium animate-fadeIn">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-space_indigo mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    placeholder="Dr. Sarah Ahmed"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment-800/40 border border-parchment-400 rounded-xl text-sm text-space_indigo placeholder-dusty_grape-700 focus:outline-none focus:ring-2 focus:ring-space_indigo-600 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-space_indigo mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="sarah.ahmed@clinic.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-parchment-800/40 border border-parchment-400 rounded-xl text-sm text-space_indigo placeholder-dusty_grape-700 focus:outline-none focus:ring-2 focus:ring-space_indigo-600 focus:border-transparent transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-space_indigo mb-1">
                      Specialization
                    </label>
                    <input
                      placeholder="e.g. Orthodontics"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-parchment-800/40 border border-parchment-400 rounded-xl text-sm text-space_indigo placeholder-dusty_grape-700 focus:outline-none focus:ring-2 focus:ring-space_indigo-600 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-space_indigo mb-1">
                      Phone Number
                    </label>
                    <input
                      placeholder="0300-1234567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-parchment-800/40 border border-parchment-400 rounded-xl text-sm text-space_indigo placeholder-dusty_grape-700 focus:outline-none focus:ring-2 focus:ring-space_indigo-600 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-space_indigo mb-1">
                    Password (min. 6 characters)
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
                  className="w-full py-3 px-4 bg-space_indigo text-parchment font-semibold rounded-xl text-sm shadow-md hover:bg-space_indigo-600 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Submitting Request..." : "Register as Doctor →"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-dusty_grape">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-space_indigo hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}