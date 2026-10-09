
-- Allow administrators to read private contact submissions.
create policy "Admins can view contact submissions"
on public.contact_submissions
for select
to authenticated
using (public.is_admin());

-- Allow administrators to update message status.
create policy "Admins can update contact submissions"
on public.contact_submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
