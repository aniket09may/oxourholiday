# Global Gateway - AI Developer Context & Master Blueprint

## 1. Project Identity & Objective
* **Name:** Global Gateway
* **Location:** Pune, Maharashtra, India
* **Niche:** International Outbound Tour Packages (Southeast Asia: Thailand, Vietnam, Malaysia)
* **Business Model:** Online-to-Offline (O2O) Digital Lead Funnel.
* **Goal:** Capture local web traffic and route them to direct WhatsApp consultations or physical store visits in Pune.

## 2. Technical Architecture
* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Mobile-first, responsive)
* **Database (Upcoming):** Supabase (PostgreSQL - Region: `ap-south-1` Mumbai for latency)
* **AI Tooling:** DeepSeek V3 via OpenRouter

## 3. Strict AI Coding Rules
* **Server-First:** Default to Next.js Server Components. Only use `"use client"` directives for interactive elements (forms, state, hooks).
* **Styling:** Use standard Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary.
* **Typing:** strictly type all components, props, and database schemas using TypeScript interfaces.
* **Compliance Variable Rule:** NEVER hardcode Indian tax rates (GST, TCS) directly into calculation functions. Always structure them as configurable variables/constants, as Indian TCS thresholds fluctuate based on PAN limits.

## 4. Current Project State (Completed)
* Directory initialized at `src/`.
* `src/components/Navbar.tsx`: Global navigation built and injected into `src/app/layout.tsx`.
* `src/app/page.tsx`: Responsive, high-conversion landing page built with Hero, Destinations, and Contact sections. 
* `src/components/LeadForm.tsx`: Interactive form built with client-side state, phone number sanitization, and direct `wa.me` WhatsApp routing.

## 5. Optimized Implementation Roadmap (Pending Tasks)

### Phase 1: Rapid MVP Launch (Frontend & Local Data)
* **Task A:** Update `next.config.js` to allow remote image domains for Next.js `<Image />` optimization (SEO & Core Web Vitals priority).
* **Task B:** Create `src/data/itineraries.ts` to hold local JSON data for Thailand, Vietnam, and Malaysia packages (Bypassing headless CMS temporarily for speed-to-market).
* **Task C:** Build dynamic route `src/app/destinations/[slug]/page.tsx` to render individual package details using the local JSON data.

### Phase 2: CRM & "Ghost Lead" Prevention (Backend)
* **Task A:** Initialize Supabase project and connect environment variables (`.env.local`).
* **Task B:** Create `leads` table in PostgreSQL (schema: `id`, `name`, `phone`, `destination`, `status`, `created_at`).
* **Task C:** Refactor `src/components/LeadForm.tsx` to execute a Supabase `INSERT` operation *before* triggering the `window.open` WhatsApp redirect. This ensures lead capture even if the user abandons the WhatsApp interface.

### Phase 3: Operations & Compliance
* **Task A:** Build internal API routes for calculating package totals.
* **Task B:** Implement GST (5% Tour Operator without ITC) and TCS (dynamic threshold) logic into the final invoice generation.