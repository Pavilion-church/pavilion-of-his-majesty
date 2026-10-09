-- Administrators can view all member profiles.
create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

-- Change only membership status through a restricted database function.
create or replace function public.set_member_status(
  target_user_id uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;

  if new_status not in ('approved', 'rejected', 'pending') then
    raise exception 'Invalid membership status';
  end if;

  update public.profiles
  set membership_status = new_status,
      updated_at = now()
  where id = target_user_id
    and role = 'member';

  if not found then
    raise exception 'Member not found or account is not an ordinary member';
  end if;
end;
$$;

revoke all on function public.set_member_status(uuid, text)
from public, anon;

grant execute on function public.set_member_status(uuid, text)
to authenticated;