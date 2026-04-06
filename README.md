# Audit FIS — Frontend

A modern, multi-step auditor registration platform featuring a real-time **Auditor Directory** on the home page. This allows users to browse registered professionals and verify all onboarding data directly against the system database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| UI Library | Material UI (MUI) v7 |
| Form Management | React Hook Form v7 + Zod v4 |
| HTTP Client | Axios |
| Language | TypeScript 5 |
| Styling | Emotion (CSS-in-JS via MUI) |

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A running instance of the [Backend API](#backend)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Demo/fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the `fe` directory:

```bash
cp .env.local.example .env.local
```

Then populate the values (see [Environment Variables](#environment-variables) below).

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend REST API | `http://localhost:3001` |

> **Note:** All frontend environment variables exposed to the browser must be prefixed with `NEXT_PUBLIC_`.

### `.env.local` (local development)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `.env.production` (production deployment)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## How to Run Locally

### Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**. Navigating to this address will display the live Auditor Directory, which can be used to verify that new registrations are being correctly saved to the database.

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
fe/src/
├── components/
│   ├── common/             # Reusable UI components (FormTextField, LoadingButton, etc.)
│   └── registration/       # Multi-step wizard components
│       ├── IdentificationStep.tsx
│       ├── VerificationStep.tsx
│       ├── ProfileStep.tsx
│       ├── CertificationItem.tsx
│       ├── AddCertificationDialog.tsx
│       ├── StepperHeader.tsx
│       └── RegistrationSuccess.tsx
├── hooks/
│   └── registration/       # Custom hooks separating business logic from UI
│       ├── useRegistration.ts   # Master wizard orchestrator
│       ├── useVerification.ts   # OTP verification + resend cooldown logic
│       └── useProfileStep.ts    # Profile form + certification lifecycle
├── lib/
│   └── api.ts              # Axios instance + API endpoint constants
├── pages/
│   ├── index.tsx           # Home page & live Auditor Directory (database verification)
│   └── register.tsx        # Auditor registration wizard
├── schemas/
│   └── registration.ts     # Zod schemas + TypeScript types
└── theme/
    └── index.ts            # MUI theme configuration
```

---

## Key Pages

| Route | Description |
|---|---|
| `/` | **Home Page & Directory**: Displays all registered auditors currently in the database. Use this to verify that registration data is correctly stored and visible. |
| `/register` | 3-step auditor registration wizard |

---

## Accessing the Registration Page

There are **3 primary ways** a user can navigate to the `/register` page from within the application:

### 1. Direct URL
Navigate directly in the browser:
```
http://localhost:3000/register
```

### 2. Navbar — "Register" Button
On the **Home Page** (`/`), the top navigation bar includes a primary **"Register"** button on the right side.

> Location: `index.tsx` → `<Navbar actions={...}>` → `href="/register"`

### 3. Directory Header — "Register Now" Button
Within the **Auditor Directory** component on the home page, there is a prominent **"Register Now"** call-to-action button located next to the directory title.

> Location: `index.tsx` → `Auditor Directory` header → `Button` → `href="/register"`

---

## Registration Wizard Flow

The registration wizard follows a state-persistent, secure 4-step process:

1.  **Step 0 (Identification)**: User enters basic identity details. Submitting sends a secure 6-digit OTP to the provided email.
2.  **Step 1 (Verification)**: User enters the OTP to confirm ownership.
    *   **Secure Validation**: OTP must be verified before proceeding.
    *   **Backward Navigation (Reset)**: Returning to Step 0 from here completely resets the OTP state. If the user moves forward again, a fresh OTP is required.
3.  **Step 2 (Profile Setup)**: User completes their professional profile (Certifications, Sectors, Jurisdictions).
    *   **State Persistence (Locked)**: If a user navigates back to Step 1 from here, the OTP field is displayed in a **disabled** "Verified" format. This confirms the verification is still valid while preventing accidental changes.
4.  **Step 3 (Success)**: Final confirmation. Users can immediately view their profile in the live **Auditor Directory**.

All wizard data is orchestrated via the `useRegistration` master hook, ensuring that intermediate states are only cleared when logically necessary.

---

## Architecture: Hook-Driven Design

Complex business logic is extracted into dedicated custom hooks, keeping UI components lean and focused on presentation:

| Hook | Responsibility |
|---|---|
| `useRegistration` | Wizard step navigation + final API submission |
| `useVerification` | OTP display, resend cooldown timer, verify API call |
| `useProfileStep` | Dynamic sector mapping, certification CRUD, form validation |

---

## API Integration

All API calls are made via a centralized Axios instance defined in `src/lib/`. The base URL is configured via the `NEXT_PUBLIC_API_URL` environment variable.

See the [Backend README](https://github.com/AvanParvadiya/Demo-BE/blob/master/README.md) for a full list of available API endpoints.
