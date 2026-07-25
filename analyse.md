# LeadDesk Mini — Project Plan

## Overview

A small lead-capture product with a public landing page and a protected admin dashboard.

---

## Tech Stack

| Layer       | Technology                                                                 |
|-------------|---------------------------------------------------------------------------|
| Frontend    | React 19, Vite 8, TypeScript 6, React Router v7, Tailwind CSS 4, shadcn/ui |
| Backend     | Node.js, Express 5, TypeScript, Mongoose 8, JWT (`jsonwebtoken`), bcrypt   |
| Database    | MongoDB Atlas                                                             |
| Validation  | Zod (client + server)                                                     |

---

## Project Structure

```
Digital-hero-fullstack-project/
├── analyse.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── index.ts                  # Express app entry point
│       ├── config/
│       │   └── db.ts                 # Mongoose connection
│       ├── models/
│       │   ├── Lead.ts               # Lead document schema
│       │   └── User.ts               # Admin user schema
│       ├── validation/
│       │   └── schemas.ts            # Zod schemas for leads + auth
│       ├── middleware/
│       │   └── auth.ts               # JWT verification middleware
│       ├── routes/
│       │   ├── leads.ts              # Lead CRUD routes
│       │   └── auth.ts               # Auth routes (login, register, me)
│       └── seed.ts                   # Seed first admin user
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── components.json               # shadcn/ui config
│   └── src/
│       ├── main.tsx                   # React root mount
│       ├── App.tsx                    # React Router setup
│       ├── index.css                  # Tailwind imports
│       ├── lib/
│       │   ├── api.ts                 # Axios instance (base URL + JWT interceptor)
│       │   ├── auth.ts                # Token helpers (get/set/remove)
│       │   └── utils.ts              # shadcn cn() utility
│       ├── context/
│       │   └── AuthContext.tsx        # Auth state provider
│       ├── components/
│       │   ├── ui/                    # shadcn/ui generated components
│       │   ├── LeadForm.tsx           # Public lead capture form
│       │   ├── AdminLayout.tsx        # Admin page wrapper (nav + logout)
│       │   └── LeadsTable.tsx         # Data table with search + status toggle
│       └── pages/
│           ├── LandingPage.tsx        # Public homepage (/)
│           ├── LoginPage.tsx          # Admin login (/admin/login)
│           └── AdminDashboard.tsx     # Admin leads list (/admin)
```

---

## Data Models

### Lead

| Field        | Type     | Constraints                                      |
|--------------|----------|--------------------------------------------------|
| name         | String   | Required, trimmed                                |
| email        | String   | Required, validated email format                 |
| budgetRange  | String   | Required, enum: "under-1k", "1k-5k", "5k-10k", "10k-plus" |
| message      | String   | Required, trimmed, max 1000 chars                |
| status       | String   | Enum: "new", "contacted", "closed", default: "new" |
| createdAt    | Date     | Default: now                                     |

### User (Admin)

| Field    | Type   | Constraints                      |
|----------|--------|----------------------------------|
| email    | String | Required, unique, lowercase      |
| password | String | Required, bcrypt hashed (pre-save hook) |
| role     | String | Default: "admin"                 |

---

## API Endpoints

### Public

| Method | Endpoint        | Body                                     | Response      |
|--------|-----------------|------------------------------------------|---------------|
| POST   | `/api/leads`    | `{ name, email, budgetRange, message }`  | 201 + lead doc |

### Protected (requires `Authorization: Bearer <JWT>`)

| Method | Endpoint                | Query Params                          | Body                | Response      |
|--------|-------------------------|---------------------------------------|---------------------|---------------|
| GET    | `/api/leads`            | `?search=`, `?status=`                | —                   | 200 + leads[] |
| PATCH  | `/api/leads/:id/status` | —                                     | `{ status }`        | 200 + lead doc|

### Auth

| Method | Endpoint              | Body                            | Response              |
|--------|-----------------------|---------------------------------|-----------------------|
| POST   | `/api/auth/register`  | `{ email, password }`           | 201 + user (no pw)    |
| POST   | `/api/auth/login`     | `{ email, password }`           | 200 + `{ token, user }` |
| GET    | `/api/auth/me`        | — (protected)                   | 200 + user (no pw)    |

---

## Seed Script

Run `npm run seed` in the backend directory.

- Prompts for admin email and password via readline
- Hashes password with bcrypt (12 rounds)
- Upserts into the `users` collection
- Prints confirmation and exits

---

## Frontend Routes

| Path             | Component          | Access   | Description                     |
|------------------|--------------------|----------|---------------------------------|
| `/`              | LandingPage        | Public   | Hero section + lead capture form |
| `/admin/login`   | LoginPage          | Public   | Admin email/password login       |
| `/admin`         | AdminDashboard     | Protected| Leads table with search + status |

### Auth Flow
1. User submits login → POST `/api/auth/login` → JWT stored in localStorage
2. Axios interceptor attaches `Authorization: Bearer <token>` to all `/api` requests
3. `AuthContext` provides `user`, `login()`, `logout()` to the component tree
4. Protected route wrapper redirects to `/admin/login` if no valid token

---

## Key Design Decisions

1. **Zod on both sides** — Frontend uses Zod directly for form validation; backend uses the same schemas in route handlers
2. **MongoDB text search** — Text index on `name` + `email` fields for the admin search feature
3. **Optimistic UI** — Status toggle updates the table immediately before server confirms
4. **No real-time** — Data fetched on mount; sufficient for a mini product
5. **Single admin role** — No complex RBAC needed

---

## Implementation Phases

| Phase | Description                                    |
|-------|------------------------------------------------|
| 1     | Backend init: package.json, tsconfig, .env, db.ts, index.ts |
| 2     | Models + Zod validation schemas                |
| 3     | Auth middleware + auth routes                   |
| 4     | Lead routes (POST, GET, PATCH)                 |
| 5     | Seed script                                    |
| 6     | Frontend: Tailwind + shadcn/ui setup           |
| 7     | API layer + auth context                       |
| 8     | Landing page + LeadForm                        |
| 9     | Admin login page                               |
| 10    | Admin dashboard + LeadsTable + AdminLayout     |
| 11    | Router wiring + final verification             |
