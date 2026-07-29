import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        Welcome to the Dental Clinic Management System
      </h2>
      <p className="text-slate-500 mb-6">Go to the dashboard to get started.</p>
      <Link
        href="/dashboard"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Open Dashboard
      </Link>
    </div>
  );
}
