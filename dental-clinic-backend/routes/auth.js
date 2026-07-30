const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const { JWT_SECRET, authenticateToken } = require("../middleware/auth");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

const router = express.Router();

// ==========================================
// POST /api/auth/register (DOCTORS ONLY - PENDING STATUS)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, doctorId, specialization, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // STRICT SECURITY: Force role to DOCTOR and status to PENDING for all public registrations
    const assignedRole = "DOCTOR";
    const assignedStatus = "PENDING";
    let linkedDoctorId = doctorId ? Number(doctorId) : null;

    if (!linkedDoctorId) {
      let existingDoctor = await prisma.doctor.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!existingDoctor) {
        existingDoctor = await prisma.doctor.create({
          data: {
            name,
            email: email.toLowerCase().trim(),
            specialization: specialization || "General Dentistry",
            phone: phone || null,
          },
        });
      }
      linkedDoctorId = existingDoctor.id;
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name,
        role: assignedRole,
        status: assignedStatus, // Requires Admin Approval
        doctorId: linkedDoctorId,
      },
      include: { doctor: true },
    });

    // DO NOT return a JWT token here. The user must wait for approval.
    res.status(201).json({
      message: "Registration received! Your account verification is in progress. You will be able to log in once an Admin approves your account.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user. Please try again." });
  }
});

// ==========================================
// POST /api/auth/login
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { doctor: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // NEW: Check Account Status before allowing login
    if (user.status === "PENDING") {
      return res.status(403).json({ error: "Your account verification is in progress. Please wait for clinic admin approval." });
    }
    if (user.status === "REJECTED") {
      return res.status(403).json({ error: "Your account registration request has been rejected by the administrator." });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      doctorId: user.doctorId,
      patientId: user.patientId, // Included for Patient Portal access
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: tokenPayload,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login. Please try again." });
  }
});

// ==========================================
// GET /api/auth/me
// ==========================================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        doctorId: true,
        doctor: true,
        patientId: true,
        patient: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// ==========================================
// ADMIN APPROVAL ROUTES (Protected)
// ==========================================

// GET pending doctors
router.get("/pending-doctors", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required." });
    }

    const pendingUsers = await prisma.user.findMany({
      where: { status: "PENDING", role: "DOCTOR" },
      include: { doctor: true },
    });
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending doctors." });
  }
});

// PATCH approve doctor
router.patch("/doctors/:id/approve", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required." });
    }

    const userId = parseInt(req.params.id);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: "APPROVED" },
    });

    res.json({ message: "Doctor account approved.", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve doctor." });
  }
});

// PATCH reject doctor
router.patch("/doctors/:id/reject", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required." });
    }

    const userId = parseInt(req.params.id);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: "REJECTED" },
    });

    res.json({ message: "Doctor account rejected.", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject doctor." });
  }
});


// ==========================================
// POST /api/auth/forgot-password
// ==========================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    
    // For security, don't reveal if the email exists or not. Always return success message.
    if (!user) {
      return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Valid for 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: "If an account with that email exists, a password reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// ==========================================
// POST /api/auth/reset-password
// ==========================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Find user with valid token and unexpired window
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired password reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear the reset token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password has been successfully reset. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password." });
  }
});

module.exports = router;