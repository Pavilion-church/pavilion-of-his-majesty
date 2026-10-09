create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  first_name text,
  last_name text,
  phone text,

  role text not null default 'member'
    check (role in ('member', 'admin', 'super_admin')),

  membership_status text not null default 'pending'
    check (membership_status in ('pending', 'approved', 'rejected')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);


-- Users can create their own profile
create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);


-- Users can update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (
    select p.role
    from public.profiles p
    where p.id = auth.uid()
  )
  and membership_status = (
    select p.membership_status
    from public.profiles p
    where p.id = auth.uid()
  )
);