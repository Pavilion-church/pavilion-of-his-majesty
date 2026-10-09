
-- Administrators can view all events, including drafts and archives.
create policy "Admins can view all events"
on public.events
for select
to authenticated
using (public.is_admin());

-- Administrators can create events.
create policy "Admins can create events"
on public.events
for insert
to authenticated
with check (public.is_admin());

-- Administrators can edit events.
create policy "Admins can update events"
on public.events
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Administrators can delete events when necessary.
create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (public.is_admin());
