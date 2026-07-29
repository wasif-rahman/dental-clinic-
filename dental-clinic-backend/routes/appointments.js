const express = require("express");
const prisma = require("../prisma/client");
const { validateAppointment } = require("../middleware/validate");

const router = express.Router();

// GET /api/appointments  (supports ?doctorId=&status=&date=)
router.get("/", async (req, res) => {
  const { doctorId, status, date } = req.query;
  const where = {};
  if (doctorId) where.doctorId = Number(doctorId);
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
});

// GET /api/appointments/:id
router.get("/:id", async (req, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: Number(req.params.id) },
    include: { doctor: true },
  });
  if (!appointment) return res.status(404).json({ error: "Appointment not found" });
  res.json(appointment);
});

// POST /api/appointments
router.post("/", validateAppointment, async (req, res) => {
  try {
    const { doctorId, patientName, appointmentDate, status, notes } = req.body;
    const appointment = await prisma.appointment.create({
      data: {
        doctorId: Number(doctorId),
        patientName,
        appointmentDate: new Date(appointmentDate),
        status: status || "scheduled",
        notes,
      },
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: "Failed to create appointment. Check doctorId is valid." });
  }
});

// PUT /api/appointments/:id
router.put("/:id", async (req, res) => {
  try {
    const { patientName, appointmentDate, status, notes } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(patientName && { patientName }),
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });
    res.json(appointment);
  } catch (err) {
    res.status(404).json({ error: "Appointment not found" });
  }
});

// PATCH /api/appointments/:id/cancel
router.patch("/:id/cancel", async (req, res) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status: "cancelled" },
    });
    res.json(appointment);
  } catch (err) {
    res.status(404).json({ error: "Appointment not found" });
  }
});

// DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Appointment not found" });
  }
});

module.exports = router;
