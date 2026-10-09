-- Each member should have one birthday submission record.
create unique index if not exists
  birthday_submissions_one_per_user
on public.birthday_submissions (user_id);