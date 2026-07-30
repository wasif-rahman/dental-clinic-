"use client";

import { useEffect, useMemo, useState } from "react";
import { cancelAppointment, getAppointments, getDoctors, updateAppointment } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import AppointmentTable from "../../components/AppointmentTable";
import Modal from "../../components/Modal";

const emptyForm = {
  doctorId: "",
  patientName: "",
  appointmentDate: "",
  status: "scheduled",
  notes: "",
};

function formatDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AppointmentsPage() {
  const { user, isDoctor, isAdmin } = useAuth();
  
  // NEW: Derive patient status from the user role
  const isPatient = user?.role === "PATIENT";

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state to prevent flash

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [appointmentsData, doctorsData] = await Promise.all([
          getAppointments(),
          getDoctors(),
        ]);
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Failed to load appointments data", err);
        setError(err.message || "Failed to load appointments data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      // If logged in as Doctor, only show their own appointments
      if (isDoctor && user?.doctorId && a.doctor_id !== Number(user.doctorId)) {
        return false;
      }
      if (doctorFilter !== "all" && a.doctor_id !== Number(doctorFilter)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (dateFilter && !a.appointment_date?.startsWith(dateFilter)) return false;
      return true;
    });
  }, [appointments, doctorFilter, statusFilter, dateFilter, isDoctor, user]);

  function openEditModal(appointment) {
    setError("");
    setForm({
      doctorId: appointment.doctor_id ?? appointment.doctorId ?? "",
      patientName: appointment.patient_name ?? appointment.patientName ?? "",
      appointmentDate: formatDateTimeLocal(appointment.appointment_date ?? appointment.appointmentDate),
      status: appointment.status ?? "scheduled",
      notes: appointment.notes ?? "",
    });
    setEditingId(appointment.id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleCancel(id) {
    try {
      setError("");
      const updated = await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? updated : a))
      );
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      setError("Failed to cancel appointment. Please try again.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!editingId) return;
      setError("");

      const updatedAppointment = await updateAppointment(editingId, {
        doctorId: Number(form.doctorId),
        patientName: form.patientName,
        appointmentDate: form.appointmentDate,
        status: form.status,
        notes: form.notes,
      });

      setAppointments((prev) =>
        prev.map((appointment) => (appointment.id === editingId ? updatedAppointment : appointment))
      );
      closeModal();
    } catch (err) {
      console.error("Failed to save appointment", err);
      setError(err.message || "Failed to save appointment. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-space_indigo"></div>
      </div>
    );
  }

  return (
    <div>
      {/* ADAPTIVE HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-space_indigo">
          {isPatient ? "My Upcoming Visits" : "Appointments"}
        </h2>
        {isPatient && (
          <p className="text-sm text-dusty_grape mt-1">
            View your scheduled visits and clinic instructions.
          </p>
        )}
      </div>

      {error && !modalOpen && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 1: PATIENT READ-ONLY PORTAL           */}
      {/* ========================================== */}
      {isPatient ? (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              Need to reschedule or cancel a visit? Please contact the clinic directly so we can accommodate your request.
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-parchment-50 rounded-xl border border-parchment-200">
              <p className="text-space_indigo font-medium">You have no scheduled appointments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((apt) => (
                <div key={apt.id} className="p-5 bg-white border border-parchment-300 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      apt.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-space_indigo mb-1">
                    Dr. {apt.doctor?.name || "Assigned Doctor"}
                  </h3>
                  <div className="text-sm text-dusty_grape mb-4 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(apt.appointment_date || apt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  {apt.notes && (
                    <div className="mt-3 p-3 bg-parchment-50 rounded-lg border border-parchment-200 text-sm text-space_indigo">
                      <span className="font-semibold block mb-1 text-xs text-dusty_grape">Clinic Notes:</span>
                      {apt.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================== */
        /* VIEW 2: ADMIN & DOCTOR MANAGEMENT INTERFACE*/
        /* ========================================== */
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            {!isDoctor && (
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="border border-parchment-400 bg-white rounded-md px-3 py-2 text-sm text-space_indigo focus:ring-2 focus:ring-space_indigo"
              >
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-space_indigo"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-space_indigo"
            />
          </div>

          <AppointmentTable
            appointments={filtered}
            doctors={doctors}
            onEdit={openEditModal}
            onCancel={handleCancel}
          />

          <Modal open={modalOpen} title="Edit Appointment" onClose={closeModal}>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
                  {error}
                </div>
              )}
              <select
                required
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              <input
                required
                placeholder="Patient name"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />

              <input
                required
                type="datetime-local"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                rows={3}
              />
             

              <button
                type="submit"
                className="w-full py-2 bg-space_indigo text-parchment rounded-md text-sm font-medium hover:bg-space_indigo-600 transition"
              >
                Save Changes
              </button>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
}