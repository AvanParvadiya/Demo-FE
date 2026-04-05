# Audit FIS — Frontend

A modern, multi-step auditor registration and directory platform built with **Next.js 16**, **Material UI**, and **React Hook Form**.

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

The application will start at **http://localhost:3000**.

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
│   ├── index.tsx           # Landing page
│   ├── register.tsx        # Auditor registration wizard
│   └── users/              # Auditor directory
├── schemas/
│   └── registration.ts     # Zod schemas + TypeScript types
└── theme/
    └── index.ts            # MUI theme configuration
```

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Landing page with platform overview and navigation |
| `/register` | 3-step auditor registration wizard |
| `/users` | Auditor directory listing |

---

## Accessing the Registration Page

There are **4 ways** a user can navigate to the `/register` page from within the application:

### 1. Direct URL
Navigate directly in the browser:
```
http://localhost:3000/register
```

### 2. Navbar — "Get Started" Button
On the **Landing Page** (`/`), the top navigation bar includes a primary **"Get Started"** button on the right side. Clicking it navigates to `/register`.

> Location: `index.tsx` → `<Navbar actions={...}>` → `href="/register"`

### 3. Hero Section — "Register Your Company" Button
The main **Hero section** of the landing page has a prominent **"Register Your Company"** call-to-action button displayed front and centre. This is the most visible entry point.

> Location: `index.tsx` → `<Hero />` component → primary `Button` → `href="/register"`

### 4. CTA Section — "Start Registration" Button
At the bottom of the landing page there is a dedicated **"Call to Action"** panel with a **"Start Registration"** button, targeting users who have scrolled through the features and stats and are ready to sign up.

> Location: `index.tsx` → `<CTA />` component → `Button` → `href="/register"`

---

## Registration Wizard Flow

The registration wizard is a 4-state flow:

```
Step 0 (Identification)
    → Enter name + email → OTP sent to email
Step 1 (Verification)
    → Enter 6-digit OTP → Email confirmed
Step 2 (Profile)
    → Certifications, Audit Sector, Jurisdictions, Independence Declaration
Step 3 (Success)
    → Registration confirmed → Link to Auditor Directory
```

All inter-step data is persisted in the `useRegistration` master hook, so navigating **Back** never loses user input.

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

See the [Backend README](../BE/README.md) for a full list of available API endpoints.
