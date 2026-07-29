export default function DoctorCard({ doctor, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
      <p className="text-sm text-blue-600">{doctor.specialization}</p>
      <p className="text-sm text-slate-500 mt-2">{doctor.email}</p>
      <p className="text-sm text-slate-500">{doctor.phone}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit?.(doctor)}
          className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(doctor.id)}
          className="text-xs px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
