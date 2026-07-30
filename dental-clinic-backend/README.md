# Dental Clinic Management System — Backend

Express + Prisma REST API, using Neon (hosted serverless PostgreSQL) as the database.

## Setup

```bash
npm install
```

Configure `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-host.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
```

Sync database schema & generate Prisma Client:
```bash
npx prisma db push
npx prisma generate
npm run seed  # Optional: Seed initial admin & sample data
npm run dev   # Starts server on http://localhost:5000
```

## Endpoints

**Authentication & Approvals (`/api/auth`)**
- `POST /api/auth/login` (Login with JWT generation)
- `POST /api/auth/register` (Doctor registration - pending admin approval)
- `GET /api/auth/me` (Fetch current user profile)
- `GET /api/auth/pending-doctors` (Admin only)
- `PATCH /api/auth/doctors/:id/approve` (Admin only)
- `PATCH /api/auth/doctors/:id/reject` (Admin only)
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

**Patients (`/api/patients`)**
- `GET /api/patients` (Includes appointments & assignedDoctor)
- `POST /api/patients` (Admin only: Adds patient with doctor assignment; updates existing records if email exists)

**Doctors (`/api/doctors`)**
- `GET /api/doctors`
- `POST /api/doctors` (Admin only)
- `PUT /api/doctors/:id` (Admin only)
- `DELETE /api/doctors/:id` (Admin only)

**Appointments (`/api/appointments`)**
- `GET /api/appointments` (Role-based filtering for Patient, Doctor, Admin)
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `PATCH /api/appointments/:id/cancel`
- `DELETE /api/appointments/:id`

## Database

PostgreSQL, hosted on Neon. Defined in `prisma/schema.prisma`:
- `users`: Accounts with roles (`ADMIN`, `DOCTOR`, `PATIENT`) and status (`PENDING`, `APPROVED`, `REJECTED`).
- `doctors`: Doctor profiles with specialization and assigned patients.
- `patients`: Patient profiles linked to assigned doctor (`assignedDoctorId`).
- `appointments`: Scheduled clinical visits linking doctor and patient records.

