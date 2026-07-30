"use client";

import React from "react";

export default function GreetingOverlay({ active, type = "login", user }) {
  if (!active || !user) return null;

  const role = user.role || "PATIENT";
  const name = user.name || "User";

  const isLogout = type === "logout";

  // Role details mapping
  const roleConfig = {
    ADMIN: {
      title: isLogout ? "Goodbye, Administrator!" : `Welcome Back, ${name}!`,
      subtitle: isLogout
        ? "Signing you out of the Clinic Admin Console..."
        : "Loading Administrator Control Center...",
      icon: "⚙️",
      badge: "Clinic Administrator",
      bgGradient: "from-purple-900/90 via-space_indigo/95 to-slate-900/90",
      accentBorder: "border-purple-400/40",
      badgeBg: "bg-purple-500/20 text-purple-200 border-purple-400/30",
    },
    DOCTOR: {
      title: isLogout ? `Goodbye, Dr. ${name}!` : `Welcome Back, Dr. ${name}!`,
      subtitle: isLogout
        ? "Securing patient records and signing out..."
        : "Preparing your clinical appointments & patient schedule...",
      icon: "👨‍⚕️",
      badge: "Doctor Portal",
      bgGradient: "from-teal-900/90 via-space_indigo/95 to-emerald-950/90",
      accentBorder: "border-teal-400/40",
      badgeBg: "bg-teal-500/20 text-teal-200 border-teal-400/30",
    },
    PATIENT: {
      title: isLogout ? `See You Soon, ${name}!` : `Welcome Back, ${name}!`,
      subtitle: isLogout
        ? "Signing out of your Patient Care Portal..."
        : "Loading your dental care portal & appointment records...",
      icon: "🦷",
      badge: "Patient Portal",
      bgGradient: "from-indigo-900/90 via-space_indigo/95 to-blue-950/90",
      accentBorder: "border-blue-400/40",
      badgeBg: "bg-blue-500/20 text-blue-200 border-blue-400/30",
    },
  };

  const config = roleConfig[role] || roleConfig.PATIENT;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden backdrop-blur-xl animate-fadeIn">
      {/* Dynamic Gradient Background with Ambient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />

      {/* Floating Animated Ambient Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-almond_silk/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Glassmorphism Card */}
      <div
        className={`relative z-10 max-w-md w-full bg-white/10 backdrop-blur-2xl border ${config.accentBorder} rounded-3xl p-8 shadow-2xl text-center text-white space-y-6 transform transition-all duration-500 scale-100 animate-scaleUp`}
      >
        {/* Animated Icon Circle */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl shadow-inner transform hover:scale-105 transition">
            {config.icon}
          </div>
        </div>

        {/* User Role Badge */}
        <div>
          <span
            className={`inline-block px-3.5 py-1 rounded-full text-xs uppercase font-bold tracking-widest border ${config.badgeBg}`}
          >
            {config.badge}
          </span>
        </div>

        {/* Greeting Heading & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            {config.title}
          </h2>
          <p className="text-sm text-parchment/80 font-normal leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="pt-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-gradient-to-r from-almond_silk to-white rounded-full animate-loadingBar" />
          </div>
          <p className="text-[11px] text-parchment/60 mt-2 font-medium tracking-wide">
            {isLogout ? "Redirecting to login..." : "Access Granted • Redirecting..."}
          </p>
        </div>
      </div>
    </div>
  );
}
