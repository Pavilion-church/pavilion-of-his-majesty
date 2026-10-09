-- ============================================================
-- Bootstrap church development super administrator
-- ============================================================

do $$
declare
  target_user_id uuid;
begin

  select id
  into target_user_id
  from auth.users
  where email = 'thepavilionofhismajesty@gmail.com';

  if target_user_id is null then
    raise exception
      'Development church account was not found in auth.users';
  end if;

  update public.profiles
  set
    role = 'super_admin',
    membership_status = 'approved',
    updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception
      'Profile for the development church account was not found';
  end if;

end
$$;
