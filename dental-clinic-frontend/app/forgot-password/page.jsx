"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setMessage(data.message);
    } catch (err) {
      console.error("Forgot password submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-parchment-400 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-space_indigo mb-2">Forgot Password</h2>
        <p className="text-xs text-dusty_grape mb-6">Enter your email address and we'll send you a link to reset your password.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-medium">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-space_indigo mb-1">Email Address</label>
            <input
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-parchment-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-space_indigo-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-space_indigo text-parchment font-semibold rounded-xl text-sm hover:bg-space_indigo-600 transition disabled:opacity-50"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-dusty_grape">
          Remembered your password? <Link href="/login" className="font-semibold text-space_indigo hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}