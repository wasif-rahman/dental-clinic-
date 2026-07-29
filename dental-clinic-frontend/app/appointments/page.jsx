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

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

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

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Appointments</h2>

      {error && !modalOpen && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        {!isDoctor && (
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="border border-parchment-400 bg-white rounded-md px-3 py-2 text-sm text-space_indigo"
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
          className="border border-slate-300 rounded-md px-3 py-2 text-sm"
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
          className="border border-slate-300 rounded-md px-3 py-2 text-sm"
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
    </div>
  );
}
