const prisma = require("./client");

const doctorSeeds = [
  {
    name: "Dr. Ayesha Khan",
    specialization: "Orthodontics",
    email: "ayesha.khan@clinic.com",
    phone: "0300-1234567",
  },
  {
    name: "Dr. Bilal Ahmed",
    specialization: "Pediatric Dentistry",
    email: "bilal.ahmed@clinic.com",
    phone: "0301-2345678",
  },
  {
    name: "Dr. Sara Malik",
    specialization: "Cosmetic Dentistry",
    email: "sara.malik@clinic.com",
    phone: "0302-3456789",
  },
  {
    name: "Dr. Hamza Shah",
    specialization: "Endodontics",
    email: "hamza.shah@clinic.com",
    phone: "0303-4567890",
  },
  {
    name: "Dr. Nida Ali",
    specialization: "Periodontics",
    email: "nida.ali@clinic.com",
    phone: "0304-5678901",
  },
  {
    name: "Dr. Omar Farooq",
    specialization: "Oral Surgery",
    email: "omar.farooq@clinic.com",
    phone: "0305-6789012",
  },
  {
    name: "Dr. Sana Rehman",
    specialization: "Prosthodontics",
    email: "sana.rehman@clinic.com",
    phone: "0306-7890123",
  },
  {
    name: "Dr. Zainab Tariq",
    specialization: "Restorative Dentistry",
    email: "zainab.tariq@clinic.com",
    phone: "0307-8901234",
  },
  {
    name: "Dr. Usman Iqbal",
    specialization: "General Dentistry",
    email: "usman.iqbal@clinic.com",
    phone: "0308-9012345",
  },
  {
    name: "Dr. Maria Noor",
    specialization: "Implantology",
    email: "maria.noor@clinic.com",
    phone: "0309-0123456",
  },
];

const appointmentSeeds = [
  { doctorName: "Dr. Ayesha Khan", patientName: "Ali Raza", appointmentDate: "2026-07-30T10:00:00", status: "scheduled", notes: "Routine checkup" },
  { doctorName: "Dr. Ayesha Khan", patientName: "Hina Fatima", appointmentDate: "2026-07-31T11:30:00", status: "completed", notes: "Braces adjustment" },
  { doctorName: "Dr. Bilal Ahmed", patientName: "Noor Ahmed", appointmentDate: "2026-08-01T09:00:00", status: "scheduled", notes: "Child cleaning" },
  { doctorName: "Dr. Bilal Ahmed", patientName: "Tahir Khan", appointmentDate: "2026-08-02T14:00:00", status: "cancelled", notes: "Parent requested reschedule" },
  { doctorName: "Dr. Sara Malik", patientName: "Muneeba Qureshi", appointmentDate: "2026-08-03T13:00:00", status: "scheduled", notes: "Whitening consultation" },
  { doctorName: "Dr. Sara Malik", patientName: "Ahsan Yousaf", appointmentDate: "2026-08-04T16:30:00", status: "completed", notes: "Veneer fitting" },
  { doctorName: "Dr. Hamza Shah", patientName: "Khalid Jamil", appointmentDate: "2026-08-05T10:30:00", status: "scheduled", notes: "Root canal follow-up" },
  { doctorName: "Dr. Nida Ali", patientName: "Zohaib Mustafa", appointmentDate: "2026-08-06T12:00:00", status: "scheduled", notes: "Gum treatment" },
  { doctorName: "Dr. Omar Farooq", patientName: "Rimsha Ilyas", appointmentDate: "2026-08-07T15:00:00", status: "completed", notes: "Wisdom tooth extraction" },
  { doctorName: "Dr. Omar Farooq", patientName: "Faisal Malik", appointmentDate: "2026-08-08T09:30:00", status: "scheduled", notes: "Surgical consultation" },
  { doctorName: "Dr. Sana Rehman", patientName: "Farah Nadeem", appointmentDate: "2026-08-09T11:00:00", status: "scheduled", notes: "Dentures fitting" },
  { doctorName: "Dr. Zainab Tariq", patientName: "Amina Shah", appointmentDate: "2026-08-10T14:30:00", status: "completed", notes: "Cavity filling" },
  { doctorName: "Dr. Usman Iqbal", patientName: "Waleed Akram", appointmentDate: "2026-08-11T10:00:00", status: "scheduled", notes: "Routine cleaning" },
  { doctorName: "Dr. Usman Iqbal", patientName: "Sadia Bibi", appointmentDate: "2026-08-12T13:30:00", status: "cancelled", notes: "Patient unavailable" },
  { doctorName: "Dr. Maria Noor", patientName: "Imran Haider", appointmentDate: "2026-08-13T16:00:00", status: "scheduled", notes: "Implant consultation" },
];

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();

  const createdDoctors = [];
  for (const doctor of doctorSeeds) {
    const createdDoctor = await prisma.doctor.create({ data: doctor });
    createdDoctors.push(createdDoctor);
  }

  const appointments = appointmentSeeds.map((appointment) => {
    const doctor = createdDoctors.find((item) => item.name === appointment.doctorName);
    return {
      doctorId: doctor.id,
      patientName: appointment.patientName,
      appointmentDate: new Date(appointment.appointmentDate),
      status: appointment.status,
      notes: appointment.notes,
    };
  });

  await prisma.appointment.createMany({ data: appointments });

  console.log(`Seed complete. Added ${createdDoctors.length} doctors and ${appointments.length} appointments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
