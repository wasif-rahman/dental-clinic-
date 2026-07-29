const express = require("express");
const prisma = require("../prisma/client");
const { validateDoctor } = require("../middleware/validate");

const router = express.Router();

// GET /api/doctors
router.get("/", async (req, res) => {
  const doctors = await prisma.doctor.findMany({ orderBy: { id: "asc" } });
  res.json(doctors);
});

// GET /api/doctors/:id
router.get("/:id", async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });
  res.json(doctor);
});

// POST /api/doctors
router.post("/", validateDoctor, async (req, res) => {
  try {
    const doctor = await prisma.doctor.create({ data: req.body });
    res.status(201).json(doctor);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

// PUT /api/doctors/:id
router.put("/:id", validateDoctor, async (req, res) => {
  try {
    const doctor = await prisma.doctor.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(doctor);
  } catch (err) {
    res.status(404).json({ error: "Doctor not found" });
  }
});

// DELETE /api/doctors/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Doctor not found" });
  }
});

module.exports = router;
