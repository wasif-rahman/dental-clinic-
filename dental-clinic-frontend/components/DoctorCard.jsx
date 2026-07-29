export default function DoctorCard({ doctor, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-parchment-400 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-space_indigo text-base">{doctor.name}</h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-parchment-500 text-dusty_grape border border-parchment-400 font-medium">
          {doctor.specialization}
        </span>
      </div>
      <p className="text-sm text-dusty_grape mt-2">{doctor.email}</p>
      <p className="text-sm text-lilac_ash-500">{doctor.phone}</p>
      <div className="mt-4 pt-3 border-t border-parchment-400/60 flex gap-2">
        <button
          onClick={() => onEdit?.(doctor)}
          className="text-xs px-3 py-1.5 rounded-md border border-dusty_grape-700 text-dusty_grape hover:bg-space_indigo hover:text-parchment transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(doctor.id)}
          className="text-xs px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
