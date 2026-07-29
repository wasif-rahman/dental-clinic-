export function Loading({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
      {label}
    </div>
  );
}

export function Empty({ label = "Nothing here yet." }) {
  return (
    <div className="flex items-center justify-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
      {label}
    </div>
  );
}
