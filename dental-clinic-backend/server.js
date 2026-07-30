require("dotenv").config();
const express = require("express");
const cors = require("cors");

const doctorsRouter = require("./routes/doctors");
const appointmentsRouter = require("./routes/appointments");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Dental Clinic API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use('/api/patients', require('./routes/patients'));


// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Dental Clinic API listening on port ${PORT}`);
});

module.exports = app;

