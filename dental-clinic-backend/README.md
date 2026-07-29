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
