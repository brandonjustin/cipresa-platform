-- Nothing ever wrote to `enrollments` before this release — enrollInFreeCourse
-- and the purchase-fulfillment path only touched `entitlements`, and
-- toggleLessonProgress only touched `lesson_progress`. The dashboard's
-- "cours en cours / terminés / heures apprises / progression" all read from
-- `enrollments`, so every user's stats showed zero regardless of real
-- activity. App code now maintains `enrollments` going forward (see
-- src/lib/actions/courses.ts and src/lib/payments/fulfillment.ts); this
-- backfills one row per pre-existing, non-revoked entitlement so already-
-- active users see correct stats immediately instead of starting at zero,
-- with progress computed from whatever lesson_progress already exists.
insert into enrollments (user_id, course_id, progress, completed_at)
select
  e.user_id,
  e.course_id,
  case when total.cnt = 0 then 0
       else least(100, round(100.0 * coalesce(done.cnt, 0) / total.cnt))
  end as progress,
  case when total.cnt > 0 and coalesce(done.cnt, 0) >= total.cnt then now() else null end as completed_at
from entitlements e
join lateral (
  select count(*) as cnt from lessons l where l.course_id = e.course_id
) total on true
left join lateral (
  select count(*) as cnt from lesson_progress lp where lp.user_id = e.user_id and lp.course_id = e.course_id
) done on true
where e.revoked_at is null
on conflict (user_id, course_id) do nothing;
