"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      setMessage(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white border border-parchment-400 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-space_indigo mb-2">Reset Password</h2>
      <p className="text-xs text-dusty_grape mb-6">Enter your new secure password below.</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs">{error}</div>}
      {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-space_indigo mb-1">New Password</label>
          <input
            required
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-parchment-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-space_indigo-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !token}
          className="w-full py-3 bg-space_indigo text-parchment font-semibold rounded-xl text-sm hover:bg-space_indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {!token && (
        <p className="mt-4 text-center text-xs text-red-600">Missing or invalid reset token link.</p>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-dusty_grape">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}