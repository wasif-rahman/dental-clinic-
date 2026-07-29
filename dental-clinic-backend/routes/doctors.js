const express = require("express");
const prisma = require("../prisma/client");
const { validateDoctor } = require("../middleware/validate");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Require authentication for all doctor routes
router.use(authenticateToken);

// GET /api/doctors (accessible to all logged-in staff)
router.get("/", async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({ orderBy: { id: "asc" } });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// GET /api/doctors/:id
router.get("/:id", async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

// POST /api/doctors (Admin only)
router.post("/", authorizeRoles("ADMIN"), validateDoctor, async (req, res) => {
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

// PUT /api/doctors/:id (Admin only)
router.put("/:id", authorizeRoles("ADMIN"), validateDoctor, async (req, res) => {
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

// DELETE /api/doctors/:id (Admin only)
router.delete("/:id", authorizeRoles("ADMIN"), async (req, res) => {
  try {
    await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "Doctor not found" });
  }
});

module.exports = router;
