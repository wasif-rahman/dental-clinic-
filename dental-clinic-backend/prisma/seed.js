const prisma = require("./client");

async function main() {
  const ayesha = await prisma.doctor.create({
    data: {
      name: "Dr. Ayesha Khan",
      specialization: "Orthodontics",
      email: "ayesha.khan@clinic.com",
      phone: "0300-1234567",
    },
  });

  const bilal = await prisma.doctor.create({
    data: {
      name: "Dr. Bilal Ahmed",
      specialization: "Pediatric Dentistry",
      email: "bilal.ahmed@clinic.com",
      phone: "0301-2345678",
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        doctorId: ayesha.id,
        patientName: "Ali Raza",
        appointmentDate: new Date("2026-07-30T10:00:00"),
        status: "scheduled",
        notes: "Routine checkup",
      },
      {
        doctorId: bilal.id,
        patientName: "Hina Fatima",
        appointmentDate: new Date("2026-07-29T14:30:00"),
        status: "completed",
        notes: "Cavity filling",
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
