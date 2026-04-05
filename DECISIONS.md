# Technical Decisions — Frontend (FE)

This document explains the key architectural and library decisions made during the development of the Audit FIS frontend. Each section covers what was chosen, what alternatives were considered, and why the chosen approach was selected.

---

### Validation Library

**Used:** `zod`

**Alternatives:** Joi, Yup, class-validator, custom validation

**Why:**
- Shared schemas between the frontend and backend (same library, same rules)
- First-class TypeScript integration — types are inferred directly from schemas, eliminating separate type definitions
- Cleaner handling of nested structures (e.g., certifications array inside registration payload)
- Zod v4 offers leaner bundles and improved parsing performance over Yup
- Works natively as a resolver for `react-hook-form` via `@hookform/resolvers/zod`

---

### Form Management Library

**Used:** `react-hook-form`

**Alternatives:** Formik, custom `useState` forms

**Why:**
- Uncontrolled inputs by default — significantly reduces re-renders in complex multi-field forms like the 3-step registration wizard
- Native integration with Zod via `@hookform/resolvers` for seamless schema-based validation
- `useForm` exposes `control`, `watch`, `setValue`, and `getValues` — all needed for the dynamic Profile Step (sector mapping, jurisdiction checkboxes, back-navigation persistence)
- Much lighter bundle footprint compared to Formik
- `Controller` component provides clean integration with third-party inputs (e.g., MUI `Checkbox`, custom `OtpInput`)

---

### UI Component Library

**Used:** `Material UI (MUI) v7`

**Alternatives:** shadcn/ui, Ant Design, Chakra UI, Tailwind CSS + Headless UI

**Why:**
- Comprehensive, production-ready component set out-of-the-box (Stepper, Dialog, DataGrid, etc.)
- Deep theming support — a single theme file controls typography, palette, and component overrides across the entire app
- `@emotion/styled` allows co-located component-level overrides via the `sx` prop without separate CSS files
- MUI v7 with React 19 provides the latest accessibility and performance improvements
- Strong ecosystem alignment with the project's enterprise audit tool aesthetic

---

### State Management

**Used:** React local state (`useState`) + Custom Hooks

**Alternatives:** React Redux (Redux Toolkit), Zustand, Jotai, React Context

**Why:**
- The registration wizard's state lifetime is limited to the onboarding session — there is no need for global, persistent, or server-synchronized state
- Extracting logic into custom hooks (`useRegistration`, `useVerification`, `useProfileStep`) achieves effective encapsulation without the boilerplate of a state manager
- All cross-step data (identification, OTP, profile) is centralized in `useRegistration`, providing a single source of truth for the wizard
- Avoids over-engineering: global state managers are best reserved for features like authentication, shopping carts, or app-wide settings — none of which are implemented in this phase

> **Future Consideration:** As the application grows (e.g., authenticated sessions, user profile caching, global notifications), **React Redux with Redux Toolkit** is the recommended upgrade path. Redux Toolkit also provides **RTK Query** which can replace the custom `useApiMutation` hook to handle API calls, caching, loading states, and error handling out of the box — making both state management and server-side data fetching scalable in a single library.

---

### Custom Hook Architecture

**Used:** Feature-scoped custom hooks (`useRegistration`, `useVerification`, `useProfileStep`)

**Alternatives:** Keeping logic directly in page/component files, using a state machine (XState)

**Why:**
- Enforces a strict separation between business logic ("what") and presentation ("how it looks")
- Dramatically improves testability — hooks can be unit-tested in isolation without rendering any UI
- Reduces component re-render scope: state changes in a hook only affect the consuming component, not the entire tree
- Makes the codebase scalable — swapping an OTP provider or adding a new wizard step only requires changes in the relevant hook, not across multiple component files
- XState was considered for the wizard flow but deemed over-engineered for a 3-step linear flow

---

### HTTP Client

**Used:** `Axios` with custom `useApiMutation` hook

**Alternatives:** Native `fetch`, `SWR`, `TanStack Query`, **RTK Query (Redux Toolkit)**

**Why:**
- Axios provides interceptors for centralized error handling and request transformation without additional configuration
- Familiar API with automatic JSON serialization/deserialization
- A single Axios instance in `src/lib/` acts as an API client that can be extended with auth headers (JWT) when authentication is implemented

> **Future Consideration:** **RTK Query** (part of Redux Toolkit) is a strong alternative that combines state management and API call handling in one place — automatically generating loading/error/data states, handling cache invalidation, and eliminating boilerplate. If React Redux is adopted for global state, migrating API calls to RTK Query would be the natural next step. **SWR** and **TanStack Query** are similarly viable for data-fetching-heavy pages like the auditor directory (`/users`).

---

### Framework

**Used:** `Next.js 16 (Pages Router)`

**Alternatives:** Vite + React, Create React App, Remix, Next.js App Router

**Why:**
- Pages Router is stable, well-understood, and appropriate for this type of multi-page form-heavy application
- Server-side rendering (SSR) capability enables better SEO for the landing page (`/`) and auditor directory (`/users`)
- The App Router was considered but deferred — its server component model adds complexity that is not required for a client-heavy registration wizard
- Next.js provides built-in routing, `<Head>` management, and image optimization without additional packages

---

### CSS / Styling Approach

**Used:** MUI `sx` prop + Emotion (CSS-in-JS)

**Alternatives:** Tailwind CSS, SCSS modules, vanilla CSS

**Why:**
- Deeply integrated with the MUI theme system — spacing, colors, and breakpoints reference theme tokens automatically
- Co-located styles prevent the need for separate `.module.css` files for every component
- Responsive styles are expressed inline using MUI's breakpoint syntax (`{ xs: ..., sm: ... }`), keeping layout intention visible in JSX
- Tailwind CSS was considered but adds friction when combined with MUI's own styling system

---

### TypeScript Configuration

**Used:** Strict TypeScript with `isolatedModules` and `emitDecoratorMetadata`

**Why:**
- `isolatedModules: true` enables faster incremental builds and is required by Next.js's Babel/SWC transpiler
- Zod schema inference (`z.infer<typeof schema>`) means types are automatically correct — no duplication between schema and type declaration
- All component prop interfaces are explicitly typed, making the codebase self-documenting and IDE-friendly
