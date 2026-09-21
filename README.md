This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Global Gateway: Project Blueprint & Technical Architecture

**Core Objective:** Generate high-intent leads via digital channels/SEO and convert them into physical footfall at the Pune office for Thailand, Vietnam, and Malaysia packages.

## 1. The Conversion Funnel (O2O Strategy)
*   **The Hook:** Facebook and Google Ads targeting the Pune area (e.g., "Thailand tour packages from Pune").
*   **The Landing Page:** A mobile-first, high-speed website. The primary Call to Action (CTA) is "Download Full Itinerary" or "Claim Free Visa Consultation."
*   **Lead Capture & Trigger:** User enters their name and phone number.
*   **Automation:** The system instantly sends the itinerary PDF to their WhatsApp.
*   **The Offline Close:** The Pune sales team receives an alert on Zoho, calls the lead, and invites them to the physical store to finalize the booking.

## 2. Technology Stack & Cost Control
This stack uses a **Decoupled (Headless) Architecture** designed to keep initial operational costs at exactly ₹0/month by utilizing generous free tiers, ensuring seamless future upgrades.
*   **Frontend (Website):** Next.js (React) + Tailwind CSS. Hosted on Vercel (Hobby Tier). Mobile-first, auto-resizing images, and instant loading via Edge caching.
*   **Backend & Database:** Supabase (PostgreSQL). Hosted in the Mumbai (ap-south-1) region for data privacy compliance.
*   **Content Management (CMS):** Sanity.io. Allows staff to update itineraries without touching code.
*   **Communication:** Interakt or Wati (WhatsApp Business API) for sending itineraries; MSG91 for DLT-compliant transactional SMS in India.
*   **Internal Operations:** Zoho Workplace (Standard Plan at ₹99/user/month) for professional email; Zoho Books (India Edition) for compliant travel invoicing.
*   **Payments (Future Phase):** PhonePe Payment Gateway or Razorpay for UPI, EMI, and Netbanking.

## 3. Regulatory & Compliance Architecture (India-Specific)
*   **TCS (Tax Collected at Source):** A seller of an overseas tour program package must collect TCS from the traveler under Section 206C(1G) of the Income Tax Act. The current rate is a flat 2% of the package value from the first rupee, with no minimum threshold. The database will mandate PAN card capture; otherwise, a higher rate applies. TCS is not taxed again and will sit below the GST total as a separate collected amount.
*   **GST:** Tour packages billed as a principal operator attract 5% GST (SAC code 998555) without Input Tax Credit.
*   **Data Privacy (DPDP Act):** Strict privacy policies and explicit consent checkboxes for handling passports, PAN cards, and dietary preferences.
*   **Local Licensing:** Shop & Establishment Act (Gumasta License) for the Pune store, plus Udyam (MSME) Registration.

## 4. Phased Rollout Plan
*   **Phase 1: The Lead Engine (Weeks 1-4):** Next.js frontend, Sanity.io CMS, and basic lead capture. Focus on SEO and speed. No payment gateways yet.
*   **Phase 2: Operations & CRM (Weeks 5-8):** Supabase database integration for storing leads. WhatsApp API integration for automated itinerary dispatch. Zoho tracking for the sales team.
*   **Phase 3: E-Commerce & Compliance (Weeks 9-12+):** PhonePe/Razorpay integration for online booking advances. Automated, GST/TCS-compliant invoicing via Zoho Books.

## 5. Security & Future Upgradability
*   **API Versioning:** The Next.js frontend communicates with the backend via APIs. Future CRM or vendor portal additions will use a `v2` API, ensuring the live website never breaks.
*   **Non-Destructive Database Migrations:** Database schema updates will use an "Expand-and-Contract" pattern to prevent downtime when adding new features like payment statuses.
*   **Server-Side RBAC:** Role-Based Access Control runs on the backend, inherently blocking unauthorized users (e.g., vendors accessing admin routes).
*   **Authentication:** HTTP-Only Cookies to prevent XSS attacks, with a framework ready for WebAuthn/FIDO2 Passkeys.