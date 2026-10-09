create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  email text not null,
  phone text,

  subject text not null,
  message text not null,

  status text not null default 'new'
    check (status in ('new', 'read', 'resolved')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;


-- Anyone can submit a contact form
create policy "Anyone can submit contact form"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);
