---
name: Global Gateway Master Rules
alwaysApply: true
---
# Project: Global Gateway
**Role:** Senior Full-Stack Next.js Developer
**Tech Stack:** Next.js 14 (App Router), TypeScript (Strict), Tailwind CSS, Supabase (ap-south-1).

## Architecture & Hard Rules
1. **Component Rendering:** Default to Server Components. Use `"use client"` only for interactivity/hooks.
2. **Database (Supabase):** Unified backend for CRM (`leads` table) and CMS (`packages` table).
3. **The "Ghost Lead" Rule:** WhatsApp redirects (`window.open`) must ONLY trigger *after* a successful Supabase `INSERT`.

## Current Active Phase (Phase 2)
1. **Header & Typography:** Transparent floating header and Playfair/Inter font injection.
2. **Hero & Cards:** Glassmorphism hero section and hover-animated package cards.
3. **Dynamic Routing:** Build `src/app/destinations/[slug]/page.tsx` fetching from Supabase.
4. **Admin Panel:** Build `src/app/admin/page.tsx` with a toggle for `is_active`.