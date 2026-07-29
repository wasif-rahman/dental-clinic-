function validateDoctor(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  next();
}

function validateAppointment(req, res, next) {
  const { doctorId, patientName, appointmentDate } = req.body;
  if (!doctorId || !patientName || !appointmentDate) {
    return res.status(400).json({
      error: "doctorId, patientName, and appointmentDate are required",
    });
  }
  if (isNaN(Date.parse(appointmentDate))) {
    return res.status(400).json({ error: "appointmentDate must be a valid date" });
  }
  next();
}

module.exports = { validateDoctor, validateAppointment };
