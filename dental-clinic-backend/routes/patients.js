const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const { authenticateToken } = require("../middleware/auth");
const { sendPatientCredentialsEmail } = require("../services/emailService");

const router = express.Router();

// ==========================================
// GET /api/patients (Admin & Doctor Access)
// ==========================================
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Both Admin and Doctors can view patients
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        appointments: true, // Includes upcoming appointments
        assignedDoctor: true, // Includes assigned doctor details
      }
    });
    res.json(patients);
  } catch (err) {
    console.error("Fetch patients error:", err);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});

// ==========================================
// POST /api/patients (Admin Creates/Updates Patient)
// ==========================================
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Strictly restrict patient creation to Admins
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only administrators can add new patients." });
    }

    const { name, email, phone, assignedDoctorId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Patient name and email are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const doctorIdNum = assignedDoctorId ? Number(assignedDoctorId) : null;

    // 1. Check if patient or user email already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email: cleanEmail },
      include: { assignedDoctor: true, appointments: true }
    });

    if (existingPatient) {
      // Patient already exists -> Update name, phone, assignedDoctor
      const updatedPatient = await prisma.patient.update({
        where: { id: existingPatient.id },
        data: {
          name: name || existingPatient.name,
          phone: phone !== undefined ? phone : existingPatient.phone,
          assignedDoctorId: doctorIdNum,
        },
        include: {
          appointments: true,
          assignedDoctor: true,
        },
      });

      return res.status(200).json({
        message: `Existing patient record found for ${cleanEmail}. Profile and doctor assignment updated.`,
        patient: updatedPatient,
        isExisting: true,
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser && !existingUser.patientId) {
      return res.status(409).json({ error: "An account with this email already exists as staff/doctor." });
    }

    // 2. Generate a secure, temporary password (8 characters)
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 3. Create Patient and linked User inside a Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      const newPatient = await tx.patient.create({
        data: {
          name,
          email: cleanEmail,
          phone: phone || null,
          assignedDoctorId: doctorIdNum,
        },
        include: {
          assignedDoctor: true,
          appointments: true,
        }
      });

      const newUser = await tx.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          name,
          role: "PATIENT",
          status: "APPROVED", // Patients are auto-approved
          patientId: newPatient.id,
        },
      });

      return { newPatient, newUser };
    });

    // 4. Send the credentials email asynchronously
    sendPatientCredentialsEmail(result.newPatient.email, result.newPatient.name, rawPassword)
      .catch(err => console.error("Non-blocking email failure:", err));

    res.status(201).json({
      message: "Patient registered successfully and temporary credentials sent via email.",
      patient: result.newPatient,
      isExisting: false,
    });

  } catch (err) {
    console.error("Patient creation error:", err);
    res.status(500).json({ error: "Failed to process patient record." });
  }
});

module.exports = router;