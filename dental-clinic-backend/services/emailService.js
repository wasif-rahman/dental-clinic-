const nodemailer = require("nodemailer");

// Create Nodemailer transporter using Gmail (or your preferred SMTP provider)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Send Patient Portal Credentials
const sendPatientCredentialsEmail = async (userEmail, patientName, tempPassword) => {
  const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/login`;

  const mailOptions = {
    from: `"Dental Clinic Portal" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your Dental Clinic Portal Credentials",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #312e81; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Welcome to Dental Clinic</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #374151;">
          <p>Hello <strong>${patientName}</strong>,</p>
          <p>An account has been created for you on our patient portal. You can use the credentials below to log in, view your appointments, and check clinic notes.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin: 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Log In to Portal</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">We recommend changing your password after your first login through your account settings.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// 2. Send Appointment Confirmation
const sendAppointmentConfirmation = async (userEmail, patientName, appointmentDate, doctorName) => {
  const formattedDate = new Date(appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  const mailOptions = {
    from: `"Dental Clinic Portal" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Appointment Confirmation - Dental Clinic",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #312e81; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Appointment Confirmed</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #374151;">
          <p>Hello <strong>${patientName}</strong>,</p>
          <p>Your appointment has been successfully scheduled.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p style="margin: 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// 3. Send Password Reset Link
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Dental Clinic Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Password Reset Request - Dental Clinic",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #312e81; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Password Reset</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #374151;">
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">This link will expire in 1 hour.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPatientCredentialsEmail,
  sendAppointmentConfirmation,
  sendPasswordResetEmail,
};