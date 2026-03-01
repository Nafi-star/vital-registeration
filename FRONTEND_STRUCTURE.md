# Vital Registration – Frontend Structure

Your frontend is the **Vite + React** app at the **root** of `vital-registration`. Here is how it is organized and what each part does.

---

## Folder layout

```
vital-registration/
├── index.html              ← Entry HTML; loads /src/main.tsx
├── package.json            ← Scripts (npm run dev, build) and dependencies
├── vite.config.ts          ← Vite config (React, aliases)
├── tailwind.config.js      ← Tailwind CSS content & theme
├── postcss.config.cjs      ← PostCSS (Tailwind + Autoprefixer)
├── tsconfig.json            ← TypeScript config
├── src/                     ← All frontend application code
│   ├── main.tsx             ← App entry: renders <App /> inside #root
│   ├── App.tsx               ← Root component: routing state, layout, pages
│   ├── index.css             ← Global styles + Tailwind (@tailwind base/components/utilities)
│   ├── LanguageContext.tsx   ← i18n: EN / Amharic / Afan Oromo, t(key)
│   ├── mockRecords.ts        ← Initial in-memory data (births, deaths, marriages, divorces)
│   ├── types.ts              ← Shared types: BirthRecord, DeathRecord, etc. + RecordMeta, RecordStatus
│   ├── vite-env.d.ts         ← Vite env types
│   ├── types/
│   │   └── index.ts          ← Extra types (e.g. Person); can be merged with types.ts
│   └── components/
│       ├── Layout.tsx        ← Header (title, back, language toggle), main content area
│       ├── Dashboard.tsx     ← Home: welcome, stats cards, nav cards (Birth, Death, etc.)
│       ├── BirthRegistration.tsx
│       ├── DeathRegistration.tsx
│       ├── MarriageRegistration.tsx
│       ├── DivorceRegistration.tsx
│       ├── SearchRecords.tsx ← Search + filters, tables, “View certificate”
│       ├── CertificateView.tsx ← Print view for birth/death/marriage/divorce certificates
│       └── ProtectedRoute.tsx  ← (if present) Auth guard for routes
├── backend/                 ← NestJS backend (separate app)
│   └── README.md
├── BACKEND_LEARNING_GUIDE.md
└── FRONTEND_STRUCTURE.md    ← This file
```

---

## What each part does

### Root config (project level)

| File | Role |
|------|------|
| `index.html` | Single HTML page; has `<div id="root">` and `<script src="/src/main.tsx">`. |
| `package.json` | `npm run dev` (Vite), `npm run build`, and dependencies (React, Tailwind, Supabase, lucide-react, etc.). |
| `vite.config.ts` | Vite options (e.g. React plugin, port, proxy to backend later). |
| `tailwind.config.js` | Tells Tailwind which files to scan for classes (`content`). |
| `postcss.config.cjs` | Runs Tailwind and Autoprefixer on CSS. |

### Entry and app shell

| File | Role |
|------|------|
| `src/main.tsx` | Renders the app: wraps `<App />` with `LanguageProvider` and mounts in `#root`. |
| `src/App.tsx` | Holds page state (dashboard, birth, death, marriage, divorce, search, certificates), record state (births, deaths, marriages, divorces), and handlers. Renders `Layout` and the active “page” component. |
| `src/index.css` | Global CSS and Tailwind directives. |

### Shared state and data

| File | Role |
|------|------|
| `src/LanguageContext.tsx` | React context for language (en / am / om) and `t(key)` for translations. |
| `src/mockRecords.ts` | Initial arrays of birth/death/marriage/divorce records used before backend is connected. |
| `src/types.ts` | Main types: `RecordStatus`, `RecordMeta`, `BirthRecord`, `DeathRecord`, `MarriageRecord`, `DivorceRecord`. |
| `src/types/index.ts` | Additional types (e.g. `Person`); can be consolidated with `src/types.ts` later. |

### UI components

| Component | Role |
|-----------|------|
| `Layout.tsx` | Top bar (title from `t(titleKey)`, subtitle, back button, language switcher), wraps page content. |
| `Dashboard.tsx` | Welcome text, stats (births, deaths, marriages, divorces), grid of cards that switch page (birth, death, marriage, divorce, search, certificates). |
| `BirthRegistration.tsx` | Form to register a birth; submits to parent; success message with reg number. |
| `DeathRegistration.tsx` | Form to register a death; same idea. |
| `MarriageRegistration.tsx` | Form to register a marriage. |
| `DivorceRegistration.tsx` | Form to register a divorce. |
| `SearchRecords.tsx` | Search box, type/status filters, tables per record type, “View certificate” per row. |
| `CertificateView.tsx` | Certificate layout and “Print”; shows one of birth/death/marriage/divorce based on `type` and `record`. |

---

## Data flow (current)

1. **App.tsx** keeps arrays: `birthRecords`, `deathRecords`, `marriageRecords`, `divorceRecords` (initialized from `mockRecords.ts`).
2. Registration forms call handlers like `handleBirthSubmit(record)`; **App** appends to the right array (with status `Pending`, timestamps).
3. **Dashboard** receives `stats` (lengths of those arrays) from **App**.
4. **SearchRecords** receives the four arrays and filters them (search term, type, status).
5. “View certificate” sets `viewingCertificate` in **App** and switches page to **CertificateView**.

When you add the backend, you will replace:
- Initial state → fetch from API (or keep mock for offline).
- Submit handlers → `POST /births`, `POST /deaths`, etc., then refresh list or update state from response.

---

## Scripts

- `npm run dev` – Start Vite dev server (e.g. http://localhost:5173).
- `npm run build` – Production build to `dist/`.
- `npm run preview` – Serve the production build locally.

---

## Optional: cleaner structure later

If the app grows, you can introduce:

- `src/pages/` – One component per “page” (e.g. `DashboardPage.tsx`, `SearchPage.tsx`) that use the existing components.
- `src/hooks/` – Custom hooks (e.g. `useRecords()`, `useLanguage()` re-exported).
- `src/api/` or `src/services/` – Functions that call your NestJS backend (e.g. `createBirth(data)` → `POST /births`).
- `src/contexts/` – Move `LanguageContext.tsx` here if you add more contexts (e.g. Auth).

Your current flat `src/` + `src/components/` is fine for this project; you can refactor when you add the API layer.
