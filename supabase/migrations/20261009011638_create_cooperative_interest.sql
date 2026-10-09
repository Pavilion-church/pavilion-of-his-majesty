
create table public.cooperative_interest (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null unique
    references auth.users(id) on delete cascade,

  created_at timestamptz not null default now()
);

alter table public.cooperative_interest
enable row level security;

-- Members can see their own interest record.
create policy "Members can view their own cooperative interest"
on public.cooperative_interest
for select
to authenticated
using (auth.uid() = user_id);

-- Members can register their own interest only once.
create policy "Members can register cooperative interest"
on public.cooperative_interest
for insert
to authenticated
with check (auth.uid() = user_id);

-- Administrators can view all interest records.
create policy "Admins can view cooperative interest"
on public.cooperative_interest
for select
to authenticated
using (public.is_admin());
