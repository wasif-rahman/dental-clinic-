const statusColor = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AppointmentTable({ appointments, doctors, onEdit, onCancel }) {
  const doctorName = (id) => doctors.find((d) => d.id === id)?.name ?? "Unknown";

  if (!appointments.length) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        No appointments found.
      </div>
    );
  }

  return (
    <table className="w-full text-sm bg-white border border-slate-200 rounded-lg overflow-hidden">
      <thead className="bg-slate-50 text-slate-600 text-left">
        <tr>
          <th className="px-4 py-2">Patient</th>
          <th className="px-4 py-2">Doctor</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id} className="border-t border-slate-100">
            <td className="px-4 py-2">{a.patient_name}</td>
            <td className="px-4 py-2">{doctorName(a.doctor_id)}</td>
            <td className="px-4 py-2">
              {new Date(a.appointment_date).toLocaleString()}
            </td>
            <td className="px-4 py-2">
              <span className={`px-2 py-1 rounded-full text-xs ${statusColor[a.status]}`}>
                {a.status}
              </span>
            </td>
            <td className="px-4 py-2 space-x-2">
              <button
                onClick={() => onEdit?.(a)}
                className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                onClick={() => onCancel?.(a.id)}
                className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
