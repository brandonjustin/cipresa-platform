-- Learning Paths: curated, ordered multi-course tracks a student can follow
-- at their own pace. Path-level "progress" is intentionally *not* stored as
-- a column here — it's derived at query time from which member courses the
-- user holds an active entitlement for / has completed, so it never drifts
-- out of sync with the underlying course data.

create table learning_paths (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  thumbnail text,
  level text default 'all' check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_learning_paths_published on learning_paths(is_published) where is_published = true;

create trigger update_learning_paths_updated_at
  before update on learning_paths for each row execute function update_updated_at();

alter table learning_paths enable row level security;
create policy "Public can view published learning paths" on learning_paths for select using (is_published = true);
create policy "Admins can manage learning paths" on learning_paths for all using (is_admin());

create table learning_path_courses (
  path_id uuid references learning_paths(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  display_order integer not null,
  is_required boolean default true,
  primary key (path_id, course_id)
);

create index idx_learning_path_courses_path on learning_path_courses(path_id, display_order);

alter table learning_path_courses enable row level security;
create policy "Public can view courses of published paths" on learning_path_courses
  for select using (exists (select 1 from learning_paths where id = learning_path_courses.path_id and is_published = true));
create policy "Admins can manage learning path courses" on learning_path_courses for all using (is_admin());

create table learning_path_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  path_id uuid references learning_paths(id) on delete cascade,
  started_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, path_id)
);

create index idx_learning_path_enrollments_user on learning_path_enrollments(user_id);

alter table learning_path_enrollments enable row level security;
create policy "Users can view own path enrollments" on learning_path_enrollments for select using (auth.uid() = user_id);
create policy "Users can start a path" on learning_path_enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own path enrollment" on learning_path_enrollments for update using (auth.uid() = user_id);
create policy "Admins can manage all path enrollments" on learning_path_enrollments for all using (is_admin());
