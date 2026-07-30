"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal & Form state for adding a patient
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/api/patients`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Session expired or insufficient permissions.");
        }
        throw new Error("Failed to fetch patients.");
      }

      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePatient(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/api/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create patient.");

      setSuccess(data.message);
      setForm({ name: "", email: "", phone: "" });
      setModalOpen(false);
      fetchPatients(); // Refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-space_indigo"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-space_indigo tracking-tight">Patient Directory</h1>
          <p className="text-sm text-dusty_grape mt-1">Manage registered clinic patients and view their visit history.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="py-2.5 px-5 bg-space_indigo text-parchment font-semibold rounded-xl text-sm shadow-sm hover:bg-space_indigo-600 transition flex items-center gap-2"
          >
            <span>+</span> Add New Patient
          </button>
        )}
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-200">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200">{success}</div>}

      {/* PATIENTS TABLE / GRID */}
      {patients.length === 0 ? (
        <div className="bg-white border border-parchment-400 rounded-2xl p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-space_indigo">No patients found</h3>
          <p className="text-sm text-dusty_grape mt-1">Get started by adding your first patient.</p>
        </div>
      ) : (
        <div className="bg-white border border-parchment-400 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-parchment-50 border-b border-parchment-300 text-xs font-semibold text-space_indigo uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Appointments</th>
                  <th className="p-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-200 text-sm">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-parchment-50/50 transition">
                    <td className="p-4 font-semibold text-space_indigo">{p.name}</td>
                    <td className="p-4 text-dusty_grape">{p.email}</td>
                    <td className="p-4 text-dusty_grape">{p.phone || "N/A"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-space_indigo-50 text-space_indigo font-semibold rounded-full text-xs">
                        {p.appointments?.length || 0} visits
                      </span>
                    </td>
                    <td className="p-4 text-xs text-dusty_grape">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-parchment-400">
            <h3 className="text-xl font-bold text-space_indigo mb-1">Add New Patient</h3>
            <p className="text-xs text-dusty_grape mb-6">Temporary login credentials will be automatically emailed to the patient.</p>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-space_indigo mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-parchment-400 rounded-xl text-sm focus:ring-2 focus:ring-space_indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-space_indigo mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-parchment-400 rounded-xl text-sm focus:ring-2 focus:ring-space_indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-space_indigo mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="0300-1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-parchment-400 rounded-xl text-sm focus:ring-2 focus:ring-space_indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 border border-parchment-400 text-space_indigo font-semibold rounded-xl text-sm hover:bg-parchment-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-space_indigo text-parchment font-semibold rounded-xl text-sm shadow-sm hover:bg-space_indigo-600 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save & Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}