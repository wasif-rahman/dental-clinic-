"use client";

import { useEffect, useState } from "react";
import { createDoctor, deleteDoctor, getDoctors, updateDoctor } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import DoctorCard from "../../components/DoctorCard";
import Modal from "../../components/Modal";
import { Empty } from "../../components/States";

const emptyForm = { name: "", specialization: "", email: "", phone: "" };

export default function DoctorsPage() {
  const { user, isDoctor, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function loadDoctors() {
      if (!user || isDoctor) return;
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to load doctors", error);
      }
    }

    loadDoctors();
  }, [user, isDoctor]);

  if (!authLoading && isDoctor) {
    return (
      <div className="bg-white border border-parchment-400 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-lg font-bold text-space_indigo mb-2">Administrator Access Required</h3>
        <p className="text-sm text-dusty_grape">
          Doctor directory management and staff creation are reserved for Clinic Administrators.
        </p>
      </div>
    );
  }

  function openAddModal() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(doctor) {
    setForm(doctor);
    setEditingId(doctor.id);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Failed to delete doctor", error);
      alert(error.message || "Failed to delete doctor");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedDoctor = await updateDoctor(editingId, form);
        setDoctors((prev) => prev.map((d) => (d.id === editingId ? updatedDoctor : d)));
      } else {
        const newDoctor = await createDoctor(form);
        setDoctors((prev) => [...prev, newDoctor]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save doctor", error);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-space_indigo">Doctors</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-space_indigo text-parchment rounded-md text-sm font-medium hover:bg-space_indigo-600 shadow-sm transition"
        >
          + Add Doctor
        </button>
      </div>

      {doctors.length === 0 ? (
        <Empty label="No doctors yet. Add one to get started." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((d) => (
            <DoctorCard
              key={d.id}
              doctor={d}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? "Edit Doctor" : "Add Doctor"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full py-2 bg-space_indigo text-parchment rounded-md text-sm font-medium hover:bg-space_indigo-600 transition"
          >
            {editingId ? "Save Changes" : "Add Doctor"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
