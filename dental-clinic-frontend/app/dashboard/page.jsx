"use client";

import { useEffect, useState } from "react";
import { getDoctors, getAppointments, getTodayAppointments } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, isDoctor } = useAuth();
  const [stats, setStats] = useState([
    { label: isDoctor ? "Assigned Patients" : "Total Doctors", value: 0 },
    { label: "Today's Appointments", value: 0 },
    { label: "Upcoming Appointments", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const [doctorsData, appointmentsData, todayData] = await Promise.all([
          isDoctor ? Promise.resolve([]) : getDoctors(),
          getAppointments(),
          getTodayAppointments(),
        ]);

        const upcoming = appointmentsData.filter((a) => a.status === "scheduled").length;

        setStats([
          {
            label: isDoctor ? "My Appointments" : "Total Doctors",
            value: isDoctor ? appointmentsData.length : doctorsData.length,
          },
          { label: "Today's Appointments", value: todayData.length },
          { label: "Upcoming Appointments", value: upcoming },
        ]);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user, isDoctor]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-space_indigo mb-6">Dashboard</h2>
      {loading ? (
        <div className="flex items-center gap-3 text-dusty_grape text-sm">
          <div className="w-4 h-4 border-2 border-space_indigo border-t-transparent rounded-full animate-spin"></div>
          <span>Loading dashboard statistics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-parchment-400 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-dusty_grape">{s.label}</p>
              <p className="text-3xl font-bold text-space_indigo mt-2">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
