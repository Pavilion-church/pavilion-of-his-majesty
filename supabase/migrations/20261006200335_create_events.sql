create table public.events (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,

  short_description text,
  description text,

  category text not null default 'General',

  start_date timestamptz not null,
  end_date timestamptz,

  location text,

  image_path text,

  featured boolean not null default false,

  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),

  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_end_after_start
    check (end_date is null or end_date >= start_date)
);

-- Anyone can view published events
create policy "Anyone can view published events"
on public.events
for select
to anon, authenticated
using (status = 'published');

alter table public.events enable row level security;