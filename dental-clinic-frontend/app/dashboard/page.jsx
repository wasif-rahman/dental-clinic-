import { getDoctors, getAppointments, getTodayAppointments } from "../../lib/api";

export default async function DashboardPage() {
  const doctors = await getDoctors();
  const appointments = await getAppointments();
  const today = await getTodayAppointments();

  const upcoming = appointments.filter((a) => a.status === "scheduled").length;

  const stats = [
    { label: "Total Doctors", value: doctors.length },
    { label: "Today's Appointments", value: today.length },
    { label: "Upcoming Appointments", value: upcoming },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
