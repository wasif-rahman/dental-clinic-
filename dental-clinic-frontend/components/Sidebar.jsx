"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isDoctor } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide login/register pages from sidebar
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const links = [
    { href: "/dashboard", label: "📊 Dashboard" },
    { href: "/appointments", label: isDoctor ? "📅 My Appointments" : "📅 Appointments" },
    ...(!isDoctor ? [{ href: "/doctors", label: "👨‍⚕️ Doctors Directory" }] : []),
  ];

  return (
    <>
      {/* Mobile Top Bar Navigation */}
      <div className="md:hidden w-full bg-white border-b border-parchment-400 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <span className="text-xs font-semibold text-space_indigo uppercase tracking-wider flex items-center gap-1.5">
          <span>📋</span>
          <span>Navigation</span>
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-parchment-400 text-space_indigo hover:bg-parchment-500 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Collapsible Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white border-b border-parchment-400 p-4 shadow-md space-y-2 animate-fadeIn">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-space_indigo text-parchment shadow-sm"
                    : "text-dusty_grape hover:bg-parchment-500 hover:text-space_indigo"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user && (
            <div className="mt-3 pt-3 border-t border-parchment-400/60 flex items-center justify-between text-xs text-space_indigo">
              <span className="font-semibold">{user.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-almond_silk-500/20 text-space_indigo border border-almond_silk-400/40">
                {user.role}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-56 shrink-0 bg-white border-r border-parchment-400 h-[calc(100vh-4rem)] p-4 shadow-sm flex-col justify-between">
        <ul className="space-y-1.5">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-space_indigo text-parchment shadow-sm"
                      : "text-dusty_grape hover:bg-parchment-500 hover:text-space_indigo"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {user && (
          <div className="p-3 bg-parchment-500 rounded-xl border border-parchment-400 text-xs">
            <p className="text-space_indigo font-semibold truncate">{user.name}</p>
            <p className="text-dusty_grape-700 capitalize mt-0.5">
              {user.role === "ADMIN" ? "Administrator" : "Doctor Portal"}
            </p>
          </div>
        )}
      </nav>
    </>
  );
}
