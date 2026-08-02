# Dental Clinic Management System Frontend

Next.js 14 (App Router) + Tailwind CSS frontend for the NextGen Dental Clinic Portal.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/login` if unauthenticated or `/dashboard` when logged in.

## Structure

```
app/
  layout.jsx          ## Shared Navbar + Sidebar wrapper
  page.jsx            # Landing page
  login/page.jsx      # Login page with password visibility toggle & forgot password link
  register/page.jsx   # Doctor registration request page (Requires Admin Approval)
  dashboard/page.jsx  # Summary widgets (Stats, Quick actions)
  doctors/page.jsx    # Doctor directory (+ Add Doctor for Admin only; browse for Patients)
  patients/page.jsx   # Patient directory (+ Add Patient, Doctor Assignment, Existing patient update)
  appointments/page.jsx # Appointment schedule & status filters
components/
  Navbar.jsx          # Top user status bar
  Sidebar.jsx         # Navigation drawer (Role-filtered)
  DoctorCard.jsx      # Doctor profile card with conditional Admin actions
  GreetingOverlay.jsx # Glassmorphism animated Welcome & Logout full-screen overlay
  AppointmentTable.jsx# Schedule view
  Modal.jsx           # Reusable modal overlay
  States.jsx          # Loading & Empty indicators
context/
  AuthContext.jsx     # JWT Auth state, role flags (isAdmin, isDoctor), & greeting trigger
```

## Features

- **Role-Based Views**: Admin, Doctor, and Patient access controls.
- **Glassmorphism Greeting Overlay**: Animated Welcome and Logout overlay customized per user role.
- **Doctor Directory Access**: Patients can browse doctor specializations in read-only mode while Admins manage staff.
- **Doctor Assignment & Existing Patients**: Assign doctors when adding patients; handles existing patient emails gracefully with update notifications.

