const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function normalizeDoctor(doctor) {
  return {
    ...doctor,
    id: Number(doctor.id),
  };
}

function normalizeAppointment(appointment) {
  return {
    ...appointment,
    id: Number(appointment.id),
    doctor_id: Number(appointment.doctor_id ?? appointment.doctorId),
    patient_name: appointment.patient_name ?? appointment.patientName,
    appointment_date: appointment.appointment_date ?? appointment.appointmentDate,
  };
}

export async function getDoctors() {
  const data = await request("/api/doctors", { cache: "no-store" });
  return (Array.isArray(data) ? data : []).map(normalizeDoctor);
}

export async function getAppointments() {
  const data = await request("/api/appointments", { cache: "no-store" });
  return (Array.isArray(data) ? data : []).map(normalizeAppointment);
}

export async function getTodayAppointments() {
  const appointments = await getAppointments();
  const today = new Date().toISOString().split("T")[0];
  return appointments.filter((appointment) => appointment.appointment_date?.startsWith(today));
}

export async function createDoctor(payload) {
  const data = await request("/api/doctors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return normalizeDoctor(data);
}

export async function updateDoctor(id, payload) {
  const data = await request(`/api/doctors/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeDoctor(data);
}

export async function deleteDoctor(id) {
  return request(`/api/doctors/${id}`, { method: "DELETE" });
}

export async function updateAppointment(id, payload) {
  const data = await request(`/api/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return normalizeAppointment(data);
}

export async function cancelAppointment(id) {
  return request(`/api/appointments/${id}/cancel`, { method: "PATCH" });
}
