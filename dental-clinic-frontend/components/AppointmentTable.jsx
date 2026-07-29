const statusColor = {
  scheduled: "bg-space_indigo-600/15 text-space_indigo border border-space_indigo-600/30",
  completed: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  cancelled: "bg-almond_silk-600/30 text-almond_silk-100 border border-almond_silk-500",
};

export default function AppointmentTable({ appointments, doctors, onEdit, onCancel }) {
  const getDoctorName = (a) =>
    a.doctor?.name || doctors.find((d) => d.id === (a.doctor_id ?? a.doctorId))?.name || "Unknown";

  if (!appointments.length) {
    return (
      <div className="text-center py-10 text-dusty_grape text-sm bg-white border border-parchment-400 rounded-xl">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-parchment-400 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-space_indigo text-parchment text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Patient</th>
            <th className="px-4 py-3 font-semibold">Doctor</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-parchment-400/50">
          {appointments.map((a) => (
            <tr key={a.id} className="hover:bg-parchment-900/40 transition">
              <td className="px-4 py-3 font-medium text-space_indigo">{a.patient_name}</td>
              <td className="px-4 py-3 text-dusty_grape">{getDoctorName(a)}</td>
              <td className="px-4 py-3 text-dusty_grape">
                {a.appointment_date ? new Date(a.appointment_date).toLocaleString() : ""}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[a.status] || "bg-parchment-500 text-space_indigo"}`}>
                  {a.status}
                </span>
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => onEdit?.(a)}
                  className="text-xs px-2.5 py-1 rounded-md border border-dusty_grape-700 text-dusty_grape hover:bg-space_indigo hover:text-parchment transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onCancel?.(a.id)}
                  disabled={a.status === "cancelled"}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    a.status === "cancelled"
                      ? "border-parchment-400 text-lilac_ash-500 cursor-not-allowed opacity-60"
                      : "border-red-300 text-red-600 hover:bg-red-50 transition"
                  }`}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
