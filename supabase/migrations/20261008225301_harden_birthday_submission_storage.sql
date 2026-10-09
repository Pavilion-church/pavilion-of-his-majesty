-- ============================================================
-- Birthday submission security hardening
-- ============================================================

-- Ensure the birthday photo bucket exists and remains private.
insert into storage.buckets (
  id,
  name,
  public
)
values (
  'birthday-photos',
  'birthday-photos',
  false
)
on conflict (id) do update
set public = false;


-- ============================================================
-- Storage policies
-- ============================================================

-- Remove the old member upload policy if it already exists so
-- this migration can safely establish the intended rule.
drop policy if exists "Members can upload their own birthday photo"
on storage.objects;

create policy "Members can upload their own birthday photo"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'birthday-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Members can only read their own birthday photo.
drop policy if exists "Members can view their own birthday photo"
on storage.objects;

create policy "Members can view their own birthday photo"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'birthday-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Members can replace/update only their own birthday photo.
drop policy if exists "Members can update their own birthday photo"
on storage.objects;

create policy "Members can update their own birthday photo"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'birthday-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'birthday-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Members can delete only their own birthday photo.
drop policy if exists "Members can delete their own birthday photo"
on storage.objects;

create policy "Members can delete their own birthday photo"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'birthday-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);