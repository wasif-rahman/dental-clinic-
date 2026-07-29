const express = require("express");
const prisma = require("../prisma/client");
const { validateAppointment } = require("../middleware/validate");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Require authentication for all appointment endpoints
router.use(authenticateToken);

// GET /api/appointments  (supports ?doctorId=&status=&date=)
router.get("/", async (req, res) => {
  try {
    const { doctorId, status, date } = req.query;
    const where = {};

    // If logged in as DOCTOR, restrict view to their own appointments unless doctorId parameter is explicitly requested by admin
    if (req.user && req.user.role === "DOCTOR" && req.user.doctorId) {
      where.doctorId = req.user.doctorId;
    } else if (doctorId) {
      where.doctorId = Number(doctorId);
    }

    if (status) where.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.appointmentDate = { gte: start, lt: end };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { doctor: true },
      orderBy: { appointmentDate: "asc" },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// GET /api/appointments/:id
router.get("/:id", async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: { doctor: true },
    });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    // Doctor can only access their own appointment
    if (req.user && req.user.role === "DOCTOR" && req.user.doctorId && appointment.doctorId !== req.user.doctorId) {
      return res.status(403).json({ error: "Access denied to this appointment" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

// POST /api/appointments
router.post("/", validateAppointment, async (req, res) => {
  try {
    let doctorId = req.body.doctorId ?? req.body.doctor_id;
    if (req.user && req.user.role === "DOCTOR" && req.user.doctorId) {
      doctorId = req.user.doctorId;
    }
    const patientName = req.body.patientName ?? req.body.patient_name;
    const appointmentDate = req.body.appointmentDate ?? req.body.appointment_date;
    const { status, notes } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: Number(doctorId),
        patientName,
        appointmentDate: new Date(appointmentDate),
        status: status || "scheduled",
        notes,
      },
      include: { doctor: true },
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: "Failed to create appointment. Check doctorId is valid." });
  }
});

// PUT /api/appointments/:id
router.put("/:id", async (req, res) => {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Role check: Doctor can only update their own appointment
    if (req.user && req.user.role === "DOCTOR" && req.user.doctorId && existing.doctorId !== req.user.doctorId) {
      return res.status(403).json({ error: "Access denied. You can only edit your own appointments." });
    }

    let doctorId = req.body.doctorId ?? req.body.doctor_id;
    if (req.user && req.user.role === "DOCTOR") {
      doctorId = existing.doctorId; // Doctor cannot change assigned doctor
    }

    const patientName = req.body.patientName ?? req.body.patient_name;
    const appointmentDate = req.body.appointmentDate ?? req.body.appointment_date;
    const { status, notes } = req.body;

    const data = {};
    if (doctorId !== undefined && doctorId !== "") data.doctorId = Number(doctorId);
    if (patientName !== undefined && patientName !== "") data.patientName = patientName;
    if (appointmentDate !== undefined && appointmentDate !== "") {
      const parsedDate = new Date(appointmentDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "appointmentDate must be a valid date" });
      }
      data.appointmentDate = parsedDate;
    }
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data,
      include: { doctor: true },
    });
    res.json(appointment);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(400).json({ error: "Failed to update appointment" });
  }
});

// PATCH /api/appointments/:id/cancel
router.patch("/:id/cancel", async (req, res) => {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (req.user && req.user.role === "DOCTOR" && req.user.doctorId && existing.doctorId !== req.user.doctorId) {
      return res.status(403).json({ error: "Access denied. You can only cancel your own appointments." });
    }

    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status: "cancelled" },
      include: { doctor: true },
    });
    res.json(appointment);
  } catch (err) {
    res.status(404).json({ error: "Appointment not found" });
  }
});

// DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (req.user && req.user.role === "DOCTOR" && req.user.doctorId && existing.doctorId !== req.user.doctorId) {
      return res.status(403).json({ error: "Access denied. You can only delete your own appointments." });
    }

    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Appointment not found" });
  }
});

module.exports = router;
