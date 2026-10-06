# AutoShine – Doorstep Car Wash (demo build)
React + Vite + TS + Tailwind + Recharts client; Node/Express + SQLite (better-sqlite3) API. Single-file DB layer (`server/src/db.js`) so it can be swapped for Postgres.

## Run
```
cp .env.example server/.env      # set JWT_SECRET
npm run install:all
npm run seed
npm run dev                      # client :5173, API :4000
npm run build && npm start       # production: API serves client/dist
```
Requires Node 18+ (build tools needed for better-sqlite3 if no prebuilt binary).

## Demo accounts (LOCAL DEMO ONLY) – password `Demo@12345`
customer@demo.com · technician@demo.com · admin@demo.com

## Config
All brand/business/tax settings are env vars (see `.env.example`). Prices: `server/src/seed.js` (services/coupons/plans) and `ADJ`/`ADDONS` in `server/src/index.js`.

## Status
Working: auth + roles, services/plans, booking wizard with live quote, coupons, slot availability + double-booking prevention, tracking, customer/technician (checklist-gated completion)/admin dashboards, assign technician, in-app notifications table.
Demo/simulated: payments (clearly labelled, no real charge). Not built yet: Razorpay/Stripe (add a PaymentService), maps, SMS/WhatsApp, photo upload, coupon/technician/customer admin CRUD UI, subscription purchase flow, reschedule, saved vehicles, SEO per-page meta.
