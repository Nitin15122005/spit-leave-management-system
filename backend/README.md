# Leave Management System — Express TypeScript Backend

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL via **Prisma ORM**
- **Auth**: JWT (matches frontend `localStorage` pattern)
- **Validation**: Zod
- **File Uploads**: Multer
- **Email**: Nodemailer

---

## Project Structure

```
src/
├── index.ts                  # Entry point, Express setup
├── config/
│   ├── database.ts           # Prisma client singleton
│   ├── validation.ts         # Zod schemas
│   └── seed.ts               # Demo data seeder
├── middleware/
│   ├── auth.middleware.ts    # JWT authenticate + authorize
│   ├── validate.middleware.ts# Zod request validation
│   ├── error.middleware.ts   # Global error handler
│   └── logger.middleware.ts  # Request logger
├── controllers/
│   ├── auth.controller.ts
│   ├── student.controller.ts
│   ├── faculty.controller.ts
│   ├── coordinator.controller.ts
│   └── upload.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── student.routes.ts
│   ├── faculty.routes.ts
│   ├── coordinator.routes.ts
│   └── upload.routes.ts
├── utils/
│   ├── email.ts              # Nodemailer + templates
│   └── formatLeave.ts        # Prisma → frontend shape mapper
└── types/
    └── index.ts              # TypeScript interfaces
prisma/
└── schema.prisma             # DB schema
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL URL and JWT secret
```

### 3. Run the database (Docker)
```bash
docker compose up db -d
```

### 4. Run migrations + seed demo data
```bash
npm run db:migrate
npm run db:seed
```

### 5. Start dev server
```bash
npm run dev
```

---

## API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | `{ uid, password }` | Login, returns JWT |
| GET | `/api/auth/me` | — | Get current user |

### Student (requires `role: student`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/profile` | Student profile |
| GET | `/api/student/leaves` | All leave applications |
| POST | `/api/student/leaves` | Apply for leave |

### Faculty (requires `role: teacher | hod | dean`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty/pending` | Leaves pending for your role |
| POST | `/api/faculty/approve/:leaveId` | Approve leave |
| POST | `/api/faculty/reject/:leaveId` | Reject leave |
| GET | `/api/faculty/history` | Approval history |

### Coordinator (requires `role: coordinator`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coordinator/approved` | Approved, attendance pending |
| POST | `/api/coordinator/mark-attendance/:leaveId` | Mark attendance |
| GET | `/api/coordinator/completed` | Completed leaves |

### Upload
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/proof` | `multipart/form-data` (field: `file`) | Upload proof file, returns URL |

---

## Workflow
```
Student applies → pending_teacher
→ Teacher approves → pending_hod
→ HOD approves    → pending_dean
→ Dean approves   → approved
→ Coordinator marks attendance → completed

Any role can reject → rejected
```

---

## Frontend Integration

Update your `api.js` to point to the real backend:

```js
// api.js — Replace all mock functions with real calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (uid, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
};

export const getStudentLeaves = async () => {
  const res = await apiCall('/student/leaves');
  return res; // { success, leaves }
};

export const applyLeave = async (leaveData) => {
  return apiCall('/student/leaves', { method: 'POST', body: JSON.stringify(leaveData) });
};

export const getPendingLeaves = async () => {
  return apiCall('/faculty/pending'); // { success, pendingLeaves }
};

export const approveLeave = async (leaveId, comment) => {
  return apiCall(`/faculty/approve/${leaveId}`, { method: 'POST', body: JSON.stringify({ comment }) });
};

export const rejectLeave = async (leaveId, comment) => {
  return apiCall(`/faculty/reject/${leaveId}`, { method: 'POST', body: JSON.stringify({ comment }) });
};

export const getApprovedLeaves = async () => {
  return apiCall('/coordinator/approved'); // { success, approvedLeaves }
};

export const markAttendanceAndAcknowledge = async (leaveId, comment) => {
  return apiCall(`/coordinator/mark-attendance/${leaveId}`, { method: 'POST', body: JSON.stringify({ comment }) });
};
```

---

## Demo Credentials (after seeding)
| Role | UID | Password |
|------|-----|----------|
| Student | `2023800110` | `2023800110` |
| Class Teacher | `TEACHER001` | `TEACHER001` |
| HOD | `HOD001` | `HOD001` |
| Dean | `DEAN001` | `DEAN001` |
| Coordinator | `COORD001` | `COORD001` |

---

## Email Notifications
Set SMTP credentials in `.env` to enable. If `SMTP_USER` is not set, emails are skipped silently (logged to console).

Events that send emails:
- Student submits application
- Teacher/HOD/Dean approves (each step)
- Any role rejects
- Coordinator marks attendance

---

## Production Deployment
```bash
# Full stack with Docker
docker compose up --build -d

# Or build manually
npm run build
npm start
```
