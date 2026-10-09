
-- Admins can view drafts, published announcements and archived records.
create policy "Admins can view all announcements"
on public.announcements
for select
to authenticated
using (public.is_admin());

-- Admins can create announcements.
create policy "Admins can create announcements"
on public.announcements
for insert
to authenticated
with check (public.is_admin());

-- Admins can edit announcements.
create policy "Admins can update announcements"
on public.announcements
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admins can delete announcements when necessary.
create policy "Admins can delete announcements"
on public.announcements
for delete
to authenticated
using (public.is_admin());
