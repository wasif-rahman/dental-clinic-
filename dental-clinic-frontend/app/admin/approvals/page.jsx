"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

export default function AdminApprovalsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const token = localStorage.getItem("token"); // Or extract from useAuth()
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${apiUrl}/api/auth/pending-doctors`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch pending doctor approvals.");
      }
      
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${apiUrl}/api/auth/doctors/${id}/${action}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to ${action} doctor account.`);
      }
      
      // Remove the processed doctor from the UI immediately
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-space_indigo"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-space_indigo tracking-tight">Staff Approvals</h1>
        <p className="text-sm text-dusty_grape mt-2">
          Review and verify pending doctor registrations before granting system access.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {doctors.length === 0 ? (
        <div className="bg-parchment-50 border border-parchment-400 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-parchment-300">
            <svg className="w-8 h-8 text-dusty_grape" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-space_indigo">All Caught Up!</h3>
          <p className="text-sm text-dusty_grape mt-1">There are no pending doctor registrations to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((user) => (
            <div key={user.id} className="bg-white border border-parchment-400 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                    Pending
                  </div>
                  <span className="text-xs text-dusty_grape">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-space_indigo truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-space_indigo/70 mb-4 truncate">{user.email}</p>
                
                <div className="space-y-2 mb-6 bg-parchment-50 p-3 rounded-xl border border-parchment-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-dusty_grape font-medium">Specialization:</span>
                    <span className="text-space_indigo font-semibold">{user.doctor?.specialization || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-dusty_grape font-medium">Phone:</span>
                    <span className="text-space_indigo font-semibold">{user.doctor?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(user.id, "reject")}
                  disabled={processingId === user.id}
                  className="flex-1 py-2 px-4 border-2 border-red-100 bg-red-50 text-red-600 font-semibold rounded-xl text-sm hover:bg-red-100 hover:border-red-200 active:scale-[0.98] transition disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(user.id, "approve")}
                  disabled={processingId === user.id}
                  className="flex-1 py-2 px-4 bg-space_indigo text-parchment font-semibold rounded-xl text-sm shadow-sm hover:bg-space_indigo-600 active:scale-[0.98] transition disabled:opacity-50"
                >
                  {processingId === user.id ? "Saving..." : "Approve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}