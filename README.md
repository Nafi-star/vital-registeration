# Phase Three: Intervention
In this phase, the students are expected to revise and update what is done on the previous phase.  
Then they are expected apply their knowledge and skill through implementation of their Action plan.

## Intervention Report
1. project overview  
2. objectives and scope  
3. Intervention details  
4. Significance and Impact  
5. Recommendations  

---

## 1. project overview
**Vital Events Registration System** is a full-stack web application for registering and managing vital events at a local administration office. The system digitizes the paper-based workflow for:
- Birth registration
- Death registration
- Marriage registration
- Divorce registration
- Record searching and certificate viewing/printing

**Proposed solution (revised):** build a web-based registration platform with a modern UI (React + Tailwind) connected to a backend API (NestJS + Prisma + PostgreSQL) for persistent storage, faster search, and certificate generation/printing.

**What was done in this phase:** the project was revised and stabilized so it can run locally end-to-end (frontend + backend), with consistent module exports, working pages, and a clean local run procedure. The UI and forms were connected to API calls and the core registration flows were verified.

---

## 2. objectives and scope
### Objective (this phase)
- Ensure the project runs reliably on a local machine (development environment).
- Implement/validate the main vital event registration workflows (create + list/search + certificate view/print).
- Integrate the frontend with a backend API for data persistence and retrieval.
- Improve maintainability by cleaning configuration issues and resolving runtime/import errors.

### Scope (this phase)
In scope:
- Frontend UI pages for dashboard, registrations (birth/death/marriage/divorce), search, certificate view/print.
- Backend API modules for births, deaths, marriages, divorces.
- Database schema for all vital record types (Prisma schema) and basic status handling.
- Local run scripts and environment setup.

Out of scope (future work):
- Authentication/roles (admin/registrar/auditor).
- Full audit trail, approvals workflow, and advanced reporting/analytics.
- Deployment (cloud hosting) and CI/CD pipelines.

---

## 3. Intervention details
### How the problem was solved (detailed)
The intervention focused on stabilizing the full-stack application and ensuring all required parts work together.

#### A) Frontend (React + Vite + Tailwind)
- **Fixed runtime import/export issues** that caused blank pages (module default export mismatches).
- **Ensured consistent exports** for key UI components and pages (dashboard, forms, search, certificates).
- **Implemented/validated navigation** between pages (dashboard → registration forms → search → certificate view).
- **Added multilingual structure** (Language context + translation keys) to support different languages (English, Amharic, Afaan Oromo).
- **Connected forms to backend API** via a typed API client (`frontend/src/api.ts`) using `VITE_API_URL`.

#### B) Backend (NestJS + Prisma)
- **Structured the API by domain modules**:
  - `births`, `deaths`, `marriages`, `divorces`
- **Enabled CORS** to allow the frontend to call the API during local development.
- **Used Prisma ORM** for database access with a PostgreSQL datasource.

#### C) Database (PostgreSQL schema)
The Prisma schema includes models for:
- `Birth`, `Death`, `Marriage`, `Divorce`
Each model contains:
- Unique registration number fields (e.g., `birth_regno`, `death_regno`)
- Core record details (names, dates, location/address fields)
- `status` field (default `"Pending"`)
- Timestamps (`created_at`, `updated_at`)

### Deliverables of the project
#### Frontend deliverables
- Dashboard with quick actions and summary statistics
- Birth registration form
- Death registration form
- Marriage registration form
- Divorce registration form
- Search records page (filter/search + view certificate)
- Certificate view and print support
- Tailwind-based responsive styling
- Multilingual text support foundation (English/Amharic/Afaan Oromo)

#### Backend deliverables
- REST API built with NestJS
- Prisma integration and database models
- Controllers/services/modules for each vital event type

---

## 4. Significance and Impact
### Contribution and significance
- **Digitization of vital event registration** reduces manual paperwork, improves accuracy, and increases speed of service.
- **Centralized record storage** improves traceability and prevents loss/damage common in paper archives.
- **Search and certificate printing** reduces time to retrieve records and produce official documents.

### Achievements and positive changes
- **Before:** paper-based registration, manual searching, slow certificate preparation.
- **After:** digital entry forms, fast record lookup, structured storage in a database, and printable certificates.

### Before/after comparisons (pictures)
Add screenshots here (recommended):
- `docs/images/before-paper-process.jpg`
- `docs/images/after-dashboard.png`
- `docs/images/after-registration-form.png`
- `docs/images/after-certificate.png`

---

## 5. Recommendations
### What we recommend
- Add **authentication and role-based access control** (registrar/admin/auditor).
- Add **approval workflow** for `Pending → Approved/Rejected` with reasons and tracking.
- Add **audit logging** (who created/updated/approved a record and when).
- Add **data validation** rules aligned with legal/administrative requirements.
- Add **backup and recovery** procedures for the database.

### Future improvements
- Reporting dashboards (monthly births/deaths, trends, exports).
- Offline-first workflow (optional) for low connectivity areas.
- Digital signatures and QR codes on certificates for verification.

### Sustaining the solution
- Train staff on consistent data entry and operating procedures.
- Maintain routine database backups and update dependencies regularly.
- Define a support plan (bug reporting, maintenance schedule, and security updates).

---

## Local Development (How to run)
### Requirements
- Node.js (LTS recommended)
- PostgreSQL database (for the API)

### 1) Run the backend API (NestJS)
```bash
cd "C:\Users\hp\Documents\vital-registration\vital-api"
npm install

# Configure environment variables, for example:
#   DATABASE_URL=postgresql://...
#   PORT=3000
#   CORS_ORIGIN=http://localhost:5173
# Primary administrator sign-in (email or username string, must match login form exactly):
#   ADMIN_USERNAME=you@example.com
#   ADMIN_PASSWORD=your-strong-password
# Optional backup administrator (same privileges):
#   BACKUP_ADMIN_USERNAME=backup@example.com
#   BACKUP_ADMIN_PASSWORD=backup-strong-password
# Aliases also supported: ADMIN_EMAIL, BACKUP_ADMIN_EMAIL
# If ADMIN_* are omitted, local defaults username/password both default to "admin" (change immediately for real use).
#   JWT_SECRET=long-random-secret-for-signing-tokens
# Optional token lifetime in seconds (default 28800 = 8 hours):
#   JWT_EXPIRES_SEC=28800
# If ADMIN_* are omitted, local defaults username/password both default to "admin" (change immediately for real use).
# Then run:
npm run start:dev
```

### 2) Run the frontend (Vite)
```bash
cd "C:\Users\hp\Documents\vital-registration\frontend"
npm install

# Optional: set API base URL for the frontend
# Create frontend/.env with:
# VITE_API_URL=http://localhost:3000

npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173/`).

