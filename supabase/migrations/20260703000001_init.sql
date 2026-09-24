-- CIPRESA Platform — Initial schema
-- Supersedes the old root-level supabase-schema.sql draft. Key differences
-- from that draft: lessons belong to exactly one section via a direct FK
-- (the old section_lessons many-to-many junction was unused complexity —
-- no UI ever needed a lesson in two sections), and RLS is enabled + policed
-- on every table instead of a handful.

-- ==================== HELPERS ====================
-- update_updated_at() doesn't reference any table by name, so it's safe to
-- define before any tables exist. is_admin() does reference `profiles` — as
-- a `language sql` function (not plpgsql), Postgres validates that
-- reference at CREATE FUNCTION time, so it has to come after the table is
-- created. See below, right after `profiles`.

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ==================== PROFILES & AUTH ====================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  avatar text,
  phone text,
  location text,
  bio text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin', 'superadmin')),
  is_active boolean default true,
  email_verified boolean default false,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_role on profiles(role);

-- Runs as the row owner (security definer) so it can read profiles.role
-- even when the calling policy's row-level security would otherwise
-- recurse into profiles itself. Must be defined after `profiles` exists —
-- see note above.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

alter table profiles enable row level security;

-- Deliberately no "public can view" policy: profiles carries email/phone/
-- bio, which nobody but the owner and admins should be able to select.
-- Anything the public needs to see about an instructor or a reviewer is
-- denormalized onto instructors/reviews below instead of joined from here.
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Admins can manage all profiles" on profiles
  for all using (is_admin());

-- ==================== INSTRUCTORS ====================

create table instructors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  full_name text not null,
  avatar text,
  title text not null,
  bio text,
  expertise text[] default '{}',
  total_courses integer default 0,
  total_students integer default 0,
  total_reviews integer default 0,
  rating decimal(3,2) default 0,
  social_links jsonb default '{}',
  is_verified boolean default false,
  created_at timestamptz default now()
);

alter table instructors enable row level security;

create policy "Public can view instructors" on instructors
  for select using (true);
create policy "Instructors can update own profile" on instructors
  for update using (auth.uid() = user_id);
create policy "Admins can manage instructors" on instructors
  for all using (is_admin());

-- ==================== COURSES & LMS ====================

create table course_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  image text,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table course_categories enable row level security;
create policy "Public can view course categories" on course_categories for select using (true);
create policy "Admins can manage course categories" on course_categories for all using (is_admin());

create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  short_description text,
  thumbnail text,
  preview_video text,
  category_id uuid references course_categories(id),
  instructor_id uuid references instructors(id),
  price decimal(12,2) not null default 0,
  sale_price decimal(12,2),
  currency text default 'XOF',
  duration text,
  total_lessons integer default 0,
  total_hours decimal(5,1) default 0,
  level text default 'all' check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  language text default 'Français',
  rating decimal(3,2) default 0,
  total_reviews integer default 0,
  total_students integer default 0,
  featured boolean default false,
  popular boolean default false,
  tags text[] default '{}',
  requirements text[] default '{}',
  what_you_will_learn text[] default '{}',
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_courses_category on courses(category_id);
create index idx_courses_instructor on courses(instructor_id);
create index idx_courses_featured on courses(featured) where featured = true;
create index idx_courses_published on courses(is_published) where is_published = true;

create trigger update_courses_updated_at
  before update on courses for each row execute function update_updated_at();

alter table courses enable row level security;

create policy "Public can view published courses" on courses
  for select using (is_published = true);
create policy "Instructors can view own unpublished courses" on courses
  for select using (
    exists (select 1 from instructors where id = courses.instructor_id and user_id = auth.uid())
  );
create policy "Instructors can manage own courses" on courses
  for all using (
    exists (select 1 from instructors where id = courses.instructor_id and user_id = auth.uid())
  );
create policy "Admins can manage all courses" on courses for all using (is_admin());

-- Entitlements decide *access* ("can this user open the player") and are
-- deliberately separate from `enrollments` (which is a progress cache).
-- Defined here, ahead of sections/lessons, because their RLS policies
-- need to reference it. Payment-specific columns/tables land in a later
-- migration once the Nokash integration is built.
create table entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  source text not null check (source in ('purchase', 'free', 'admin_grant')),
  order_id uuid,
  granted_at timestamptz default now(),
  revoked_at timestamptz,
  unique(user_id, course_id)
);

create index idx_entitlements_user on entitlements(user_id) where revoked_at is null;
create index idx_entitlements_course on entitlements(course_id) where revoked_at is null;

alter table entitlements enable row level security;
create policy "Users can view own entitlements" on entitlements for select using (auth.uid() = user_id);
create policy "Admins can manage all entitlements" on entitlements for all using (is_admin());
-- Entitlements are otherwise only ever written by the service-role client
-- (free-course self-enroll action, or the payment webhook after a
-- confirmed charge) — never by direct client insert.

create table sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  display_order integer not null,
  created_at timestamptz default now()
);

create index idx_sections_course on sections(course_id, display_order);

alter table sections enable row level security;
create policy "Public can view sections of published courses" on sections
  for select using (exists (select 1 from courses where id = sections.course_id and is_published = true));
create policy "Instructors can manage own course sections" on sections
  for all using (
    exists (
      select 1 from courses c join instructors i on i.id = c.instructor_id
      where c.id = sections.course_id and i.user_id = auth.uid()
    )
  );
create policy "Admins can manage all sections" on sections for all using (is_admin());

create table lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  section_id uuid references sections(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  video_url text,
  video_duration text,
  display_order integer not null,
  is_preview boolean default false,
  is_free boolean default false,
  created_at timestamptz default now(),
  unique(course_id, slug)
);

create index idx_lessons_course on lessons(course_id, display_order);
create index idx_lessons_section on lessons(section_id, display_order);

alter table lessons enable row level security;
create policy "Public can view preview lessons of published courses" on lessons
  for select using (
    is_preview = true and exists (select 1 from courses where id = lessons.course_id and is_published = true)
  );
create policy "Entitled users can view course lessons" on lessons
  for select using (
    exists (
      select 1 from entitlements e
      where e.course_id = lessons.course_id and e.user_id = auth.uid() and e.revoked_at is null
    )
  );
create policy "Instructors can manage own course lessons" on lessons
  for all using (
    exists (
      select 1 from courses c join instructors i on i.id = c.instructor_id
      where c.id = lessons.course_id and i.user_id = auth.uid()
    )
  );
create policy "Admins can manage all lessons" on lessons for all using (is_admin());

create table lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  name text not null,
  url text not null,
  type text check (type in ('pdf', 'doc', 'image', 'link')),
  size text,
  created_at timestamptz default now()
);

alter table lesson_resources enable row level security;
create policy "Same access as parent lesson" on lesson_resources
  for select using (
    exists (
      select 1 from lessons l
      where l.id = lesson_resources.lesson_id
        and (
          l.is_preview = true
          or exists (select 1 from entitlements e where e.course_id = l.course_id and e.user_id = auth.uid() and e.revoked_at is null)
        )
    )
  );
create policy "Admins can manage lesson resources" on lesson_resources for all using (is_admin());

-- ==================== QUIZZES ====================

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  title text not null,
  passing_score integer default 70,
  time_limit integer,
  created_at timestamptz default now()
);

alter table quizzes enable row level security;
create policy "Entitled users can view quizzes" on quizzes
  for select using (
    exists (select 1 from entitlements e where e.course_id = quizzes.course_id and e.user_id = auth.uid() and e.revoked_at is null)
  );
create policy "Admins can manage quizzes" on quizzes for all using (is_admin());

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text,
  display_order integer not null
);

alter table quiz_questions enable row level security;
create policy "Same access as parent quiz" on quiz_questions
  for select using (
    exists (
      select 1 from quizzes q join entitlements e on e.course_id = q.course_id
      where q.id = quiz_questions.quiz_id and e.user_id = auth.uid() and e.revoked_at is null
    )
  );
create policy "Admins can manage quiz questions" on quiz_questions for all using (is_admin());

-- ==================== ENROLLMENTS ====================
-- Enrollment = "I'm taking this course" (a summary/progress-cache row).
-- Access control lives in `entitlements`, not here — see 20260703000003.

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  progress decimal(5,2) default 0,
  current_lesson uuid references lessons(id),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  certificate_id text,
  unique(user_id, course_id)
);

create index idx_enrollments_user on enrollments(user_id);
create index idx_enrollments_course on enrollments(course_id);

alter table enrollments enable row level security;
create policy "Users can view own enrollments" on enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll themselves" on enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own enrollment progress" on enrollments for update using (auth.uid() = user_id);
create policy "Admins can manage all enrollments" on enrollments for all using (is_admin());

-- ==================== CERTIFICATES ====================

create table certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id),
  certificate_url text,
  issued_at timestamptz default now()
);

alter table certificates enable row level security;
create policy "Users can view own certificates" on certificates for select using (auth.uid() = user_id);
create policy "Admins can manage certificates" on certificates for all using (is_admin());

-- ==================== MARKETPLACE ====================

create table product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  image text,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table product_categories enable row level security;
create policy "Public can view product categories" on product_categories for select using (true);
create policy "Admins can manage product categories" on product_categories for all using (is_admin());

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  images text[] default '{}',
  category_id uuid references product_categories(id),
  price decimal(12,2) not null,
  sale_price decimal(12,2),
  currency text default 'XOF',
  stock integer default 0,
  unit text,
  featured boolean default false,
  rating decimal(3,2) default 0,
  total_reviews integer default 0,
  tags text[] default '{}',
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_category on products(category_id);
create index idx_products_featured on products(featured) where featured = true;
create index idx_products_published on products(is_published) where is_published = true;

create trigger update_products_updated_at
  before update on products for each row execute function update_updated_at();

alter table products enable row level security;
create policy "Public can view published products" on products for select using (is_published = true);
create policy "Admins can manage products" on products for all using (is_admin());

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  price decimal(12,2) not null,
  stock integer default 0,
  attributes jsonb default '{}',
  created_at timestamptz default now()
);

alter table product_variants enable row level security;
create policy "Same access as parent product" on product_variants
  for select using (exists (select 1 from products where id = product_variants.product_id and is_published = true));
create policy "Admins can manage product variants" on product_variants for all using (is_admin());

-- ==================== PLANTS ENCYCLOPEDIA ====================

create table plant_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table plant_categories enable row level security;
create policy "Public can view plant categories" on plant_categories for select using (true);
create policy "Admins can manage plant categories" on plant_categories for all using (is_admin());

create table plants (
  id uuid primary key default gen_random_uuid(),
  scientific_name text not null,
  common_name text not null,
  slug text unique not null,
  images text[] default '{}',
  category_id uuid references plant_categories(id),
  description text,
  climate text[] default '{}',
  soil_type text[] default '{}',
  water_requirement text check (water_requirement in ('low', 'medium', 'high')),
  sunlight text check (sunlight in ('full', 'partial', 'shade')),
  growth_duration text,
  harvest_time text,
  estimated_yield text,
  region_compatibility text[] default '{}',
  disease_risks text[] default '{}',
  nutritional_benefits text[] default '{}',
  market_value text,
  export_potential boolean default false,
  price decimal(12,2),
  currency text default 'XOF',
  availability boolean default true,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_plants_category on plants(category_id);
create index idx_plants_availability on plants(availability) where availability = true;

create trigger update_plants_updated_at
  before update on plants for each row execute function update_updated_at();

alter table plants enable row level security;
create policy "Public can view published plants" on plants for select using (is_published = true);
create policy "Admins can manage plants" on plants for all using (is_admin());

create table plant_courses (
  plant_id uuid references plants(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  primary key (plant_id, course_id)
);

alter table plant_courses enable row level security;
create policy "Public can view plant-course links" on plant_courses for select using (true);
create policy "Admins can manage plant-course links" on plant_courses for all using (is_admin());

-- ==================== ORDERS ====================

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  total decimal(12,2) not null,
  currency text default 'XOF',
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_method text,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_orders_payment on orders(payment_status);

create trigger update_orders_updated_at
  before update on orders for each row execute function update_updated_at();

alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders" on orders for all using (is_admin());

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  item_type text not null check (item_type in ('course', 'product')),
  item_id uuid not null,
  name text not null,
  quantity integer not null default 1,
  price decimal(12,2) not null,
  image text,
  created_at timestamptz default now()
);

create index idx_order_items_order on order_items(order_id);

-- entitlements.order_id was declared before `orders` existed; wire the FK now.
alter table entitlements add constraint entitlements_order_id_fkey foreign key (order_id) references orders(id);

alter table order_items enable row level security;
create policy "Users can view own order items" on order_items
  for select using (exists (select 1 from orders where id = order_items.order_id and user_id = auth.uid()));
create policy "Users can create own order items" on order_items
  for insert with check (exists (select 1 from orders where id = order_items.order_id and user_id = auth.uid()));
create policy "Admins can manage all order items" on order_items for all using (is_admin());

-- ==================== REVIEWS ====================

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  target_id uuid not null,
  target_type text not null check (target_type in ('course', 'product')),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  is_approved boolean default false,
  created_at timestamptz default now(),
  unique(user_id, target_id, target_type)
);

create index idx_reviews_target on reviews(target_id, target_type);

alter table reviews enable row level security;
create policy "Public can view approved reviews" on reviews for select using (is_approved = true);
create policy "Users can view own reviews" on reviews for select using (auth.uid() = user_id);
create policy "Users can create own reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on reviews for update using (auth.uid() = user_id);
create policy "Admins can manage all reviews" on reviews for all using (is_admin());

-- ==================== WISHLIST ====================

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  item_type text not null check (item_type in ('course', 'product')),
  item_id uuid not null,
  added_at timestamptz default now(),
  unique(user_id, item_type, item_id)
);

alter table wishlist_items enable row level security;
create policy "Users can manage own wishlist" on wishlist_items for all using (auth.uid() = user_id);

-- ==================== BLOG ====================

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image text,
  category text,
  author text,
  author_avatar text,
  tags text[] default '{}',
  featured boolean default false,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_blog_posts_published on blog_posts(is_published) where is_published = true;

create trigger update_blog_posts_updated_at
  before update on blog_posts for each row execute function update_updated_at();

alter table blog_posts enable row level security;
create policy "Public can view published posts" on blog_posts for select using (is_published = true);
create policy "Admins can manage blog posts" on blog_posts for all using (is_admin());

-- ==================== NOTIFICATIONS ====================

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text,
  type text default 'info' check (type in ('info', 'success', 'warning', 'error')),
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

create index idx_notifications_user on notifications(user_id, is_read);

alter table notifications enable row level security;
create policy "Users can manage own notifications" on notifications for all using (auth.uid() = user_id);

-- ==================== COUPONS ====================

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed')),
  value decimal(12,2) not null,
  min_purchase decimal(12,2),
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table coupons enable row level security;
create policy "Public can view active coupons by code" on coupons for select using (is_active = true);
create policy "Admins can manage coupons" on coupons for all using (is_admin());

-- ==================== CHATBOT ====================

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  message text not null,
  is_bot boolean default false,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;
create policy "Users can manage own chat messages" on chat_messages for all using (auth.uid() = user_id);

-- ==================== AUDIT LOGS ====================

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);

create index idx_audit_logs_user on audit_logs(user_id);
create index idx_audit_logs_action on audit_logs(action, created_at);

alter table audit_logs enable row level security;
create policy "Admins can view audit logs" on audit_logs for select using (is_admin());
-- audit_logs is written exclusively via the service-role client, never by RLS-governed insert policies.

-- ==================== AUTH TRIGGER ====================

create trigger update_profiles_updated_at
  before update on profiles for each row execute function update_updated_at();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Utilisateur'),
    new.raw_user_meta_data->>'avatar',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();
