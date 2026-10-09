create table public.birthday_submissions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  first_name text not null,
  last_name text not null,

  birthday_month integer not null
    check (birthday_month between 1 and 12),

  birthday_day integer not null
    check (birthday_day between 1 and 31),

  phone text,
  email text,
  ministry text,

  photo_path text,

  consent boolean not null default false,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.birthday_submissions enable row level security;


create policy "Members can submit their own birthday"
on public.birthday_submissions
for insert
to authenticated
with check (auth.uid() = user_id);


create policy "Members can view their own birthday"
on public.birthday_submissions
for select
to authenticated
using (auth.uid() = user_id);


create policy "Members can update their own birthday"
on public.birthday_submissions
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and status = (
    select b.status
    from public.birthday_submissions b
    where b.id = birthday_submissions.id
  )
);
