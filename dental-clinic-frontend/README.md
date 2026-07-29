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
