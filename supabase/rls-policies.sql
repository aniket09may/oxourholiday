-- Oxour Holiday least-privilege policies
--
-- Before applying:
-- 1. Add SUPABASE_SERVICE_ROLE_KEY to the server deployment environment.
-- 2. Back up the database and review these policies in a staging project.
-- 3. Never expose the service-role key to the browser.

begin;

alter table public.packages enable row level security;
alter table public.leads enable row level security;

-- Remove legacy policies so an older permissive policy cannot override these.
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('packages', 'leads')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  end loop;
end $$;

revoke all on table public.packages from anon, authenticated;
revoke all on table public.leads from anon, authenticated;

grant select on table public.packages to anon, authenticated;

create policy "public can read active packages"
on public.packages
for select
to anon, authenticated
using (is_active is true);

grant insert (name, phone, destination, status) on table public.leads to anon, authenticated;

create policy "public can submit valid new leads"
on public.leads
for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(btrim(name)) between 2 and 80
  and phone ~ '^[0-9]{8,15}$'
  and char_length(btrim(destination)) between 2 and 120
  and sales_rep is null
  and notes is null
);

commit;
