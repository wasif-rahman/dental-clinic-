"use client";

import { useEffect, useMemo, useState } from "react";
import { cancelAppointment, getAppointments, getDoctors } from "../../lib/api";
import AppointmentTable from "../../components/AppointmentTable";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [appointmentsData, doctorsData] = await Promise.all([
          getAppointments(),
          getDoctors(),
        ]);
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Failed to load appointments data", error);
      }
    }

    loadData();
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (doctorFilter !== "all" && a.doctor_id !== Number(doctorFilter)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (dateFilter && !a.appointment_date.startsWith(dateFilter)) return false;
      return true;
    });
  }, [appointments, doctorFilter, statusFilter, dateFilter]);

  async function handleCancel(id) {
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (error) {
      console.error("Failed to cancel appointment", error);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Appointments</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

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
        onCancel={handleCancel}
      />
    </div>
  );
}
