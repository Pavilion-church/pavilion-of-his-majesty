create table public.announcements (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  excerpt text,
  content text not null,

  priority text not null default 'normal'
    check (priority in ('normal', 'important', 'urgent')),

  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),

  published_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint announcements_expiry_after_publish
    check (
      expires_at is null
      or published_at is null
      or expires_at >= published_at
    )
);

alter table public.announcements enable row level security;


-- Anyone can view published announcements
create policy "Anyone can view published announcements"
on public.announcements
for select
to anon, authenticated
using (
  status = 'published'
  and (
    expires_at is null
    or expires_at >= now()
  )
);
