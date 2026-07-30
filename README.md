# Dental Clinic Management System — Frontend

Next.js (App Router) frontend for the Dental Clinic Management System intern project.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects you into `/dashboard`.

## Structure

```
app/
  layout.jsx          # shared Navbar + Sidebar
  page.jsx            # landing page
  dashboard/page.jsx  # summary widgets
  doctors/page.jsx    # doctor list + add/edit/delete
  appointments/page.jsx # appointment list + filters
components/
  Navbar.jsx
  Sidebar.jsx
  DoctorCard.jsx
  AppointmentTable.jsx
  Modal.jsx
  States.jsx          # Loading / Empty
lib/
  mock-data.js         # simulated API responses (swap for real fetch later)
```

## Notes

- All data currently comes from `lib/mock-data.js`. Once the backend (Express + SQLite) is live,
  replace the `getDoctors()` / `getAppointments()` calls with real `fetch()` calls to
  `process.env.NEXT_PUBLIC_API_URL`.
- Server Components are the default; only `doctors/page.jsx`, `appointments/page.jsx`,
  `Sidebar.jsx`, and `Modal.jsx` are Client Components (`"use client"`) because they need
  state or interactivity.
- Deployment target: Render (Web Service, not Static Site — Next.js needs a Node server).

## Known limitation

Backend SQLite file resets on redeploy on Render's free tier (ephemeral filesystem) — expected, not a bug.





# Dental Clinic Management System — Backend

Express + Prisma REST API, using Neon (hosted Postgres) as the database.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and paste your real Neon connection string into `DATABASE_URL`.
**Never commit `.env`.**

```bash
npx prisma migrate dev --name init   # creates tables in Neon
npm run seed                          # optional: adds sample data
npm run dev                           # starts the API on http://localhost:5000
```

## Endpoints

**Doctors**
- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id`

**Appointments**
- `GET /api/appointments` (query params: `doctorId`, `status`, `date`)
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `PATCH /api/appointments/:id/cancel`
- `DELETE /api/appointments/:id`

## Database

Postgres, hosted on Neon. Schema is defined in `prisma/schema.prisma`:
- `doctors` table
- `appointments` table, with `doctorId` as a foreign key referencing `doctors.id`

Prisma manages migrations — no manual SQL needed. Since Neon persists data independently
of Render deploys, there's no "database resets on redeploy" limitation like there would be
with local SQLite on Render's free tier.

## Deployment (Render)

1. Push this repo to GitHub.
2. Render → New → Web Service → connect the repo.
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Environment variables: add `DATABASE_URL` (same Neon connection string) and `PORT`.
6. After first deploy, run `npx prisma migrate deploy` (via Render Shell or a one-off job) to apply migrations to the Neon database.
