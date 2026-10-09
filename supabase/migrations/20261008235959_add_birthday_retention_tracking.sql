
-- Track whether the church has celebrated the member.
alter table public.birthday_submissions
  add column if not exists celebration_status text
    not null default 'pending'
    check (
      celebration_status in (
        'pending',
        'completed',
        'not_required'
      )
    ),
  add column if not exists celebration_completed_at timestamptz;

-- Track the private photo's lifecycle independently
-- from the birthday record.
alter table public.birthday_submissions
  add column if not exists photo_retention_status text
    not null default 'retained'
    check (
      photo_retention_status in (
        'retained',
        'review_required',
        'deleted'
      )
    ),
  add column if not exists photo_deleted_at timestamptz;
