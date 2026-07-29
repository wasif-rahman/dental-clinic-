"use client";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-space_indigo/60 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-parchment-400">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-parchment-400">
          <h2 className="text-base font-semibold text-space_indigo">{title}</h2>
          <button
            onClick={onClose}
            className="text-dusty_grape hover:text-space_indigo text-2xl leading-none font-light"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
