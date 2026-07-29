const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = `Request failed with status ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && parsed.error) message = parsed.error;
    } catch (e) {
      if (errorText) message = errorText;
    }
    throw new Error(message);
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

// Authentication API methods
export async function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getCurrentUser() {
  return request("/api/auth/me", { cache: "no-store" });
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
  const data = await request(`/api/appointments/${id}/cancel`, { method: "PATCH" });
  return normalizeAppointment(data);
}
