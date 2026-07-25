# LeadDesk Mini

A fullstack lead management application built for Digital Heroes Training Task.

**Live URLs:**
- Frontend: [https://your-frontend.vercel.app](https://your-frontend.vercel.app)
- Backend API: [https://your-backend.vercel.app](https://your-backend.vercel.app)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Table |
| Backend | Express 5, TypeScript, Node.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation | Zod |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| Deployment | Vercel (separate projects for frontend/backend) |

## Data Models

### Lead

```ts
{
  name: string;          // required, trimmed, max 100 chars
  email: string;         // required, lowercase, valid email
  budgetRange: enum;     // "under-1k" | "1k-5k" | "5k-10k" | "10k-plus"
  message: string;       // required, max 1000 chars
  status: enum;          // "new" | "contacted" | "closed" (default: "new")
  createdAt: Date;       // auto-generated
}
```

Indexes: text index on `name` and `email` for search.

### User

```ts
{
  email: string;         // required, unique, lowercase
  password: string;      // required, bcrypt hashed (12 rounds)
  role: string;          // default: "admin"
}
```

Password hashing happens via a Mongoose pre-save hook. `comparePassword` instance method is provided for login verification.

## Auth Approach

- **Registration/Login** returns a JWT signed with `JWT_SECRET`, valid for 7 days.
- JWT is stored in `localStorage` on the client and sent as a `Bearer` token in the `Authorization` header.
- `authMiddleware` verifies the token on protected routes and attaches `userId` to the request.
- The `GET /api/auth/me` endpoint validates the token and returns the current user.

**Protected routes:**
- `GET /api/leads` — list leads (supports `?search=` and `?status=` query params)
- `PATCH /api/leads/:id/status` — update lead status

**Public routes:**
- `POST /api/leads` — submit a new lead (no auth required)
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — login
- `GET /api/health` — health check

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Create new user |
| `POST` | `/api/auth/login` | No | Login, returns JWT |
| `GET` | `/api/auth/me` | Yes | Get current user |
| `POST` | `/api/leads` | No | Submit a lead |
| `GET` | `/api/leads` | Yes | List leads (search, filter by status) |
| `PATCH` | `/api/leads/:id/status` | Yes | Update lead status |
| `GET` | `/api/health` | No | Health check |

## Validation

All inputs are validated with Zod schemas before hitting the database:

- **leadSchema** — name, email, budgetRange, message
- **statusSchema** — status enum
- **loginSchema** — email, password (min 6 chars)
- **registerSchema** — email, password (min 6 chars)

## Frontend Routes

| Path | Component | Auth |
|------|-----------|------|
| `/` | LandingPage (public lead form) | No |
| `/admin/login` | LoginPage | No (redirects if logged in) |
| `/admin` | AdminDashboard (leads table, stats) | Yes |

## Seed Script

Run `npm run seed` in the backend directory to create/update the default admin user:

- Email: `admin123@gmail.com`
- Password: `admin123`

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run seed            # create admin user
npm run dev             # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:5173
```

## Deployment (Vercel)

### Backend

1. Import `backend/` folder as a Vercel project
2. Set environment variables:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — secret key for JWT signing
   - `FRONTEND_URL` — deployed frontend URL (for CORS)
3. Vercel auto-detects `vercel.json` and deploys as serverless

### Frontend

1. Import `frontend/` folder as a Vercel project
2. Set environment variable:
   - `VITE_API_URL` — deployed backend URL + `/api`
3. Framework preset: Vite (auto-detected)
