"use client";

import { useEffect, useState } from "react";
import { getDoctors, getAppointments, getTodayAppointments } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Derive roles
  const isAdmin = user?.role === "ADMIN";
  const isDoctor = user?.role === "DOCTOR";
  const isPatient = user?.role === "PATIENT";

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        // 1. Fetch base data
        const [doctorsData, appointmentsData, todayData] = await Promise.all([
          isPatient ? Promise.resolve([]) : getDoctors(),
          getAppointments(),
          isPatient ? Promise.resolve([]) : getTodayAppointments(), // Patients don't strictly need the "today" filter API if they only see their own
        ]);

        // 2. Build adaptive stats based on role
        if (isAdmin) {
          // Fetch new Admin-specific data
          const [patientsRes, pendingRes] = await Promise.all([
            fetch(`${apiUrl}/api/patients`, { headers }),
            fetch(`${apiUrl}/api/auth/pending-doctors`, { headers })
          ]);
          
          const patientsData = patientsRes.ok ? await patientsRes.json() : [];
          const pendingData = pendingRes.ok ? await pendingRes.json() : [];

          setStats([
            { 
              label: "Pending Approvals", 
              value: pendingData.length,
              alert: pendingData.length > 0, // Highlight if action is needed
              link: "/admin/approvals"
            },
            { label: "Total Patients", value: patientsData.length, link: "/patients" },
            { label: "Today's Appointments", value: todayData.length, link: "/appointments" },
            { label: "Active Doctors", value: doctorsData.length, link: "/doctors" },
          ]);

        } else if (isPatient) {
          const upcoming = appointmentsData.filter((a) => a.status === "scheduled").length;
          const completed = appointmentsData.filter((a) => a.status === "completed").length;
          
          setStats([
            { label: "Upcoming Visits", value: upcoming, link: "/appointments" },
            { label: "Completed Visits", value: completed, link: "/appointments" },
            { label: "Total Scheduled", value: appointmentsData.length, link: "/appointments" },
          ]);

        } else {
          // DOCTOR View
          const upcoming = appointmentsData.filter((a) => a.status === "scheduled").length;
          
          setStats([
            { label: "Today's Appointments", value: todayData.length, link: "/appointments" },
            { label: "Upcoming Appointments", value: upcoming, link: "/appointments" },
            { label: "Total Appointments", value: appointmentsData.length, link: "/appointments" },
          ]);
        }

      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user, isAdmin, isDoctor, isPatient]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-space_indigo">
          {isPatient ? `Welcome, ${user?.name?.split(' ')[0] || 'Patient'}` : "Dashboard"}
        </h2>
        <p className="text-sm text-dusty_grape mt-1">
          {isAdmin ? "Clinic overview and pending administrative tasks." : 
           isDoctor ? "Your daily schedule and appointment metrics." : 
           "Your personal dental care summary."}
        </p>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-3 text-dusty_grape text-sm">
          <div className="w-4 h-4 border-2 border-space_indigo border-t-transparent rounded-full animate-spin"></div>
          <span>Loading statistics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link href={s.link || "#"} key={s.label}>
              <div
                className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition h-full cursor-pointer ${
                  s.alert 
                    ? "bg-red-50 border-red-200 hover:bg-red-100" 
                    : "bg-white border-parchment-400"
                }`}
              >
                <p className={`text-sm font-medium ${s.alert ? "text-red-700" : "text-dusty_grape"}`}>
                  {s.label}
                </p>
                <div className="flex items-end justify-between mt-2">
                  <p className={`text-3xl font-bold ${s.alert ? "text-red-700" : "text-space_indigo"}`}>
                    {s.value}
                  </p>
                  
                  {/* Subtle arrow indicator for clickable cards */}
                  <svg className={`w-5 h-5 mb-1 ${s.alert ? "text-red-400" : "text-parchment-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}