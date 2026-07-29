# Dental Clinic Monorepo

This repository contains the full-stack Dental Clinic application.

## Project Structure

- `dental-clinic-backend/`: Node.js Express API with Prisma ORM & PostgreSQL (Neon DB).
- `dental-clinic-frontend/`: Next.js 14 Web Application with React & Tailwind CSS.

## Local Development

### Backend
```bash
cd dental-clinic-backend
npm install
npx prisma generate
npm run dev
```

### Frontend
```bash
cd dental-clinic-frontend
npm install
npm run dev
```
