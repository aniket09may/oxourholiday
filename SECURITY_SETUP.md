# Production security setup

The application remains compatible with the existing Supabase URL and anonymous key. For production-grade Row Level Security, complete these two deployment steps:

1. Add the Supabase `service_role` key as `SUPABASE_SERVICE_ROLE_KEY` in the server deployment environment. Never use a `NEXT_PUBLIC_` prefix for this value.
2. Review and run `supabase/rls-policies.sql` in a staging Supabase project, verify public lead submission and admin workflows, then apply it to production.

The policy script allows visitors to read active packages and submit a constrained new lead. It prevents anonymous lead reads, lead updates, package writes, and inactive-package reads. Authenticated admin operations use the server-only client and bypass RLS with the service-role key.

Also configure a unique, random `SESSION_SECRET` of at least 32 characters. The app falls back to the existing passcodes to avoid breaking current deployments, but a dedicated secret is strongly recommended.

The in-process rate limiter reduces ordinary abuse but is not a replacement for a distributed edge rate limit. Configure a platform/WAF rate limit for `/api/auth/login` and Next.js Server Action POST traffic before a high-volume launch.
