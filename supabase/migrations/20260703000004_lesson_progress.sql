-- Per-lesson completion, replacing the old "completed_lessons text[]" idea
-- from the original draft schema (arrays make per-row RLS and analytics
-- awkward). `enrollments.progress`/`current_lesson`/`completed_at` become a
-- denormalized summary kept in sync by the trigger below, so the dashboard
-- can cheaply query "my courses in progress" without recomputing from
-- lesson_progress on every read.

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

create index idx_lesson_progress_user_course on lesson_progress(user_id, course_id);

alter table lesson_progress enable row level security;
create policy "Users can view own lesson progress" on lesson_progress for select using (auth.uid() = user_id);
create policy "Users can record own lesson progress" on lesson_progress
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from entitlements e
      where e.course_id = lesson_progress.course_id and e.user_id = auth.uid() and e.revoked_at is null
    )
  );
create policy "Users can un-complete own lesson progress" on lesson_progress
  for delete using (auth.uid() = user_id);
create policy "Admins can manage all lesson progress" on lesson_progress for all using (is_admin());

-- Keeps enrollments.progress / current_lesson / completed_at denormalized
-- from the lesson_progress rows so reads elsewhere stay cheap.
create or replace function sync_enrollment_progress()
returns trigger as $$
declare
  v_user_id uuid := coalesce(new.user_id, old.user_id);
  v_course_id uuid := coalesce(new.course_id, old.course_id);
  v_total_lessons integer;
  v_completed_lessons integer;
  v_progress decimal(5,2);
begin
  select count(*) into v_total_lessons from lessons where course_id = v_course_id;
  select count(*) into v_completed_lessons from lesson_progress where user_id = v_user_id and course_id = v_course_id;
  v_progress := case when v_total_lessons > 0 then round((v_completed_lessons::decimal / v_total_lessons) * 100, 2) else 0 end;

  insert into enrollments (user_id, course_id, progress, current_lesson, completed_at)
  values (
    v_user_id, v_course_id, v_progress,
    case when tg_op = 'INSERT' then new.lesson_id else null end,
    case when v_progress >= 100 then now() else null end
  )
  on conflict (user_id, course_id) do update
    set progress = excluded.progress,
        current_lesson = coalesce(excluded.current_lesson, enrollments.current_lesson),
        completed_at = case when excluded.progress >= 100 then coalesce(enrollments.completed_at, now()) else null end;

  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger sync_enrollment_progress_on_change
  after insert or delete on lesson_progress
  for each row execute function sync_enrollment_progress();
