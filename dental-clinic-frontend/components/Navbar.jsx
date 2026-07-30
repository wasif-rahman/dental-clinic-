"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="h-16 bg-space_indigo text-parchment flex items-center px-6 justify-between shadow-md">
      <Link href="/dashboard" className="text-lg font-semibold tracking-wide flex items-center gap-2 hover:opacity-90 transition">
        <span>🦷</span>
        <span>Dental Clinic Portal</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Only render the user badge and sign out button if a user is logged in */}
        {!loading && user && (
          <>
            <div className="flex items-center gap-2 px-3 py-1 bg-space_indigo-400/30 border border-space_indigo-600 rounded-full text-xs">
              <span className="font-semibold text-white">{user.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-almond_silk-500/20 text-almond_silk border border-almond_silk-400/40">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-lg border border-parchment-400/40 text-parchment hover:bg-parchment/10 transition"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}