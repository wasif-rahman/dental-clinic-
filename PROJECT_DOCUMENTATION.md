# Dental Clinic Management Portal
## Comprehensive Project Documentation & Technical Overview

---

### 1. Executive Summary

The **NextGen Dental Clinic Management Portal** is a full-stack, enterprise-grade web application built to streamline operations for modern dental clinics. It provides specialized, role-based dashboards for **Clinic Administrators**, **Doctors**, and **Patients**. 

The system automates patient registration, doctor directory management, appointment scheduling, identity verification, and patient-doctor assignments—all enclosed in a modern, ultra-responsive glassmorphism user interface.

---

### 2. Core Features & Key Improvements

#### 🔐 Role-Based Access Control (RBAC) & Security
- **Multi-Role Support**: Distinct permissions for **Admin**, **Doctor**, and **Patient** accounts.
- **Admin Approval System**: Newly registered doctors require explicit approval from an Administrator before gaining portal access.
- **Patient Access Controls**: Patients can securely log in to view their personal appointment history and browse doctor profiles without having access to management actions.
- **Strict Endpoint Protection**: API endpoints utilize JSON Web Tokens (JWT) and Bcrypt encryption to block unauthorized requests.

#### 👨‍⚕️ Doctor Directory Management
- **Admin Controls**: Administrators can add new doctors, update specialization and contact info, or delete doctor accounts.
- **Patient & Staff Browsing**: Patients can view available doctors and their specializations, but the `+ Add Doctor`, `Edit`, and `Delete` controls are strictly hidden for non-admin accounts.

#### 🏥 Intelligent Patient & Doctor Assignment Workflow
- **Doctor Assignment**: When an Admin registers a patient, they can select a primary assigned doctor from a dynamic dropdown menu.
- **Existing Patient Recognition**: If an Admin enters an email for a patient already in the system, the platform intelligently updates the existing record and doctor assignment instead of throwing a duplicate error, returning a clean success notification: *"Existing patient record found. Profile and doctor assignment updated."*
- **Automated Credentials**: New patients receive temporary login credentials via email automatically upon registration.

#### ✨ Animated Glassmorphism Welcome & Logout Experience
- **Role-Tailored Greetings**: Beautiful full-screen glassmorphism overlay featuring glowing ambient circles, role badges, custom greetings, and animated loading indicators:
  - 👴🏻 **Admin**: *"Welcome Back, Administrator!"* / *"Goodbye, Administrator!"*
  - 👨‍⚕️ **Doctor**: *"Welcome Back, Dr. [Name]!"* / *"Goodbye, Dr. [Name]!"*
  - 🦷 **Patient**: *"Welcome Back, [Name]!"* / *"See You Soon, [Name]!"*
- **Smooth Navigation**: The overlay appears on login before entering the dashboard and on logout before clearing session data and returning to the sign-in page.

---

### 3. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** | High-performance React framework with server and client components. |
| **Styling & Design** | **Tailwind CSS + Glassmorphism** | Modern CSS styling with custom keyframe animations and translucent backdrop blurs. |
| **State Management** | **React Context API (`AuthContext`)** | Global authentication state, JWT decoding, and greeting overlay handler. |
| **Backend API** | **Node.js & Express.js** | RESTful API architecture handling business logic, authentication, and routing. |
| **Database** | **PostgreSQL (Neon DB)** | Serverless cloud PostgreSQL database hosted on Neon. |
| **ORM** | **Prisma ORM** | Type-safe database client and automated migration management. |
| **Authentication** | **JWT & BcryptJS** | Secure token-based session handling and 10-round salt password hashing. |
| **Email Service** | **Nodemailer** | Automated transactional emails for credentials and password resets. |

---

### 4. Database Architecture & Relations

The PostgreSQL database (managed via Prisma) consists of four primary models:

```prisma
model Doctor {
  id               Int           @id @default(autoincrement())
  name             String
  specialization   String?
  email            String        @unique
  phone            String?
  createdAt        DateTime      @default(now()) @map("created_at")
  appointments     Appointment[]
  users            User[]
  assignedPatients Patient[]

  @@map("doctors")
}

model Patient {
  id               Int           @id @default(autoincrement())
  name             String
  email            String        @unique
  phone            String?
  assignedDoctorId Int?          @map("assigned_doctor_id")
  assignedDoctor   Doctor?       @relation(fields: [assignedDoctorId], references: [id])
  createdAt        DateTime      @default(now()) @map("created_at")
  appointments     Appointment[]
  users            User[]

  @@map("patients")
}

model Appointment {
  id              Int      @id @default(autoincrement())
  doctorId        Int      @map("doctor_id")
  doctor          Doctor   @relation(fields: [doctorId], references: [id])
  patientId       Int?     @map("patient_id")
  patient         Patient? @relation(fields: [patientId], references: [id])
  patientName     String   @map("patient_name")
  appointmentDate DateTime @map("appointment_date")
  status          String   @default("scheduled")
  notes           String?
  createdAt       DateTime @default(now()) @map("created_at")

  @@map("appointments")
}

model User {
  id               Int       @id @default(autoincrement())
  email            String    @unique
  password         String
  role             String    @default("DOCTOR") // "ADMIN", "DOCTOR", "PATIENT"
  status           String    @default("APPROVED") // "PENDING", "APPROVED", "REJECTED"
  name             String
  doctorId         Int?      @map("doctor_id")
  doctor           Doctor?   @relation(fields: [doctorId], references: [id])
  patientId        Int?      @map("patient_id")
  patient          Patient?  @relation(fields: [patientId], references: [id])
  resetToken       String?   @map("reset_token")
  resetTokenExpiry DateTime? @map("reset_token_expiry")
  createdAt        DateTime  @default(now()) @map("created_at")

  @@map("users")
}
```

---

### 5. API Reference

#### Authentication Routes (`/api/auth`)
- `POST /api/auth/login`: Authenticates user and returns JWT token + user profile.
- `POST /api/auth/register`: Public registration for doctors (sets account status to `PENDING`).
- `GET /api/auth/me`: Fetches profile of currently logged-in user.
- `GET /api/auth/pending-doctors`: (Admin only) Lists doctor accounts awaiting approval.
- `PATCH /api/auth/doctors/:id/approve`: (Admin only) Approves doctor account.
- `PATCH /api/auth/doctors/:id/reject`: (Admin only) Rejects doctor account.
- `POST /api/auth/forgot-password`: Generates secure password reset token and sends email.
- `POST /api/auth/reset-password`: Verifies reset token and updates user password.

#### Patient Routes (`/api/patients`)
- `GET /api/patients`: Fetches patient directory including `appointments` and `assignedDoctor`.
- `POST /api/patients`: (Admin only) Creates new patient (or updates existing patient if email matches) and assigns primary doctor.

#### Doctor Routes (`/api/doctors`)
- `GET /api/doctors`: Fetches list of all active clinic doctors.
- `POST /api/doctors`: (Admin only) Adds a new doctor profile.
- `PUT /api/doctors/:id`: (Admin only) Updates doctor details.
- `DELETE /api/doctors/:id`: (Admin only) Removes doctor profile.

#### Appointment Routes (`/api/appointments`)
- `GET /api/appointments`: Fetches appointments (filtered by role: Patients see their own visits; Doctors see their own schedule; Admins see all).
- `POST /api/appointments`: Schedules a new appointment.
- `PUT /api/appointments/:id`: Updates appointment status or details.
- `PATCH /api/appointments/:id/cancel`: Cancels an appointment.

---

### 6. Installation & How to Run

#### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon serverless PostgreSQL account)

#### 1. Backend Setup
```bash
cd dental-clinic-backend

# Install dependencies
npm install

# Configure Environment Variables (.env)
# DATABASE_URL="postgresql://user:password@ep-host.neon.tech/neondb?sslmode=require"
# JWT_SECRET="your-super-secret-jwt-key"

# Sync Prisma Schema with Neon Database
npx prisma db push
npx prisma generate

# Seed sample data (Optional)
npm run seed

# Start API Server (Runs on http://localhost:5000)
npm run dev
```

#### 2. Frontend Setup
```bash
cd dental-clinic-frontend

# Install dependencies
npm install

# Configure Environment Variables (.env)
# NEXT_PUBLIC_API_URL="http://localhost:5000"

# Build production app or run dev server
npm run dev
```

---

### 7. Verification & Quality Assurance

- **Production Build**: Executed `npm run build` with **0 syntax or compilation errors** across all 13 application routes.
- **Database Synchronization**: Verified schema synchronization with Neon hosted PostgreSQL database via `prisma db push`.
- **Security Check**: Verified token verification, password encryption, and role-based route guards.
