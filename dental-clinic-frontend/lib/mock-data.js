// Mock data simulating API responses from the Express/SQLite backend.
// Shape matches the doctors/appointments schema in the project spec,
// so swapping this for real fetch calls later is a drop-in change.

export const doctors = [
  {
    id: 1,
    name: "Dr. Ayesha Khan",
    specialization: "Orthodontics",
    email: "ayesha.khan@clinic.com",
    phone: "0300-1234567",
  },
  {
    id: 2,
    name: "Dr. Bilal Ahmed",
    specialization: "Pediatric Dentistry",
    email: "bilal.ahmed@clinic.com",
    phone: "0301-2345678",
  },
  {
    id: 3,
    name: "Dr. Sana Malik",
    specialization: "Endodontics",
    email: "sana.malik@clinic.com",
    phone: "0302-3456789",
  },
];

export const appointments = [
  {
    id: 1,
    doctor_id: 1,
    patient_name: "Ali Raza",
    appointment_date: "2026-07-30T10:00:00",
    status: "scheduled",
    notes: "Routine checkup",
  },
  {
    id: 2,
    doctor_id: 2,
    patient_name: "Hina Fatima",
    appointment_date: "2026-07-29T14:30:00",
    status: "completed",
    notes: "Cavity filling",
  },
  {
    id: 3,
    doctor_id: 3,
    patient_name: "Usman Tariq",
    appointment_date: "2026-08-01T09:15:00",
    status: "cancelled",
    notes: "Patient rescheduled",
  },
  {
    id: 4,
    doctor_id: 1,
    patient_name: "Zara Sheikh",
    appointment_date: "2026-07-29T16:00:00",
    status: "scheduled",
    notes: "",
  },
];

// Small fetch-wrapper style helpers so Server Components read data
// the same way whether it's mock data now or a real API later.
export async function getDoctors() {
  return doctors;
}

export async function getAppointments() {
  return appointments;
}

export async function getTodayAppointments() {
  const today = new Date().toISOString().split("T")[0];
  return appointments.filter((a) => a.appointment_date.startsWith(today));
}
