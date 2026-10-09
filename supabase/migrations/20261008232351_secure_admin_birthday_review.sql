
-- Allow authorized admins to view birthday submissions.
create policy "Admins can view birthday submissions"
on public.birthday_submissions
for select
to authenticated
using (public.is_admin());

-- Allow authorized admins to update review status.
create policy "Admins can update birthday submissions"
on public.birthday_submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Allow authorized admins to view private birthday photos.
create policy "Admins can view birthday photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'birthday-photos'
  and public.is_admin()
);

-- Allow authorized admins to delete birthday photos.
create policy "Admins can delete birthday photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'birthday-photos'
  and public.is_admin()
);
