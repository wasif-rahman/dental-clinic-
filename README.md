# 🦷 Dental Clinic Management Portal

An end-to-end modern web platform for dental clinics, featuring role-based portals for **Clinic Administrators**, **Doctors**, and **Patients**.

Built with **Next.js 14**, **Tailwind CSS**, **Node.js/Express**, **Prisma ORM**, and **PostgreSQL (Neon)**.

---

## 🌟 Key Features

- 🔐 **Role-Based Authentication (RBAC)**: Distinct dashboards and permissions for Admin, Doctor, and Patient roles.
- ⚙️ **Admin Staff Approval**: Doctor registration workflow with Admin verification control.
- 👨‍⚕️ **Doctor Directory**: Admin controls for creating/editing doctors; Patients can view doctor specializations in read-only mode.
- 🏥 **Patient Management & Doctor Assignment**: Assign doctors to patients on creation. Smart handling updates existing patient records seamlessly if an email already exists.
- ✨ **Animated Glassmorphism UI**: Custom full-screen welcome & logout overlays with role-tailored greetings and glowing ambient visual accents.
- 📅 **Appointment Scheduling**: Filterable appointment tables, status updates, and email notifications.

---

## 📂 Project Structure

```text
dental-clinic/
├── PROJECT_DOCUMENTATION.md      # Full comprehensive documentation (Word/Doc friendly)
├── README.md                     # Root project overview & launcher guide
├── dental-clinic-backend/        # Express API + Prisma ORM + PostgreSQL (Neon)
│   ├── middleware/               # Auth & validation middlewares
│   ├── prisma/                   # Prisma schema & database seeds
│   ├── routes/                   # Auth, Patients, Doctors, Appointments endpoints
│   └── services/                 # Email notification services
└── dental-clinic-frontend/       # Next.js 14 (App Router) + Tailwind CSS
    ├── app/                      # App router pages (dashboard, doctors, patients, etc.)
    ├── components/               # Navbar, Sidebar, DoctorCard, GreetingOverlay, Modal
    ├── context/                  # AuthContext state management
    └── lib/                      # API client fetchers
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (`dental-clinic-backend`)

```bash
cd dental-clinic-backend

# Install packages
npm install

# Push schema to database
npx prisma db push
npx prisma generate

# Seed sample data (optional)
npm run seed

# Run Backend API (http://localhost:5000)
npm run dev
```

### 2. Frontend Setup (`dental-clinic-frontend`)

```bash
cd dental-clinic-frontend

# Install packages
npm install

# Run Next.js Dev Server (http://localhost:3000)
npm run dev
```
