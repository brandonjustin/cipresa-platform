-- Tracks who has used which coupon so `coupons.max_uses` and one-per-user
-- limits are enforced atomically at the database layer (defense in depth
-- beyond whatever the checkout server action already validates) — a
-- `select ... for update` row lock prevents two concurrent checkouts from
-- both squeezing through the last remaining use of a max_uses coupon.

create table coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  coupon_id uuid references coupons(id) on delete cascade not null,
  order_id uuid references orders(id) on delete cascade not null,
  redeemed_at timestamptz default now(),
  unique(user_id, coupon_id)
);

alter table coupon_redemptions enable row level security;
create policy "Users can view own coupon redemptions" on coupon_redemptions for select using (auth.uid() = user_id);
create policy "Admins can manage coupon redemptions" on coupon_redemptions for all using (is_admin());
-- No client insert policy: redemptions are created exclusively by the
-- checkout server action via the service-role client, inside the same
-- transaction that creates the order.

create or replace function apply_coupon_redemption()
returns trigger as $$
declare
  v_coupon coupons%rowtype;
begin
  select * into v_coupon from coupons where id = new.coupon_id for update;

  if not found or not v_coupon.is_active then
    raise exception 'Coupon is not active';
  end if;
  if v_coupon.expires_at is not null and v_coupon.expires_at < now() then
    raise exception 'Coupon has expired';
  end if;
  if v_coupon.max_uses is not null and v_coupon.used_count >= v_coupon.max_uses then
    raise exception 'Coupon has reached its usage limit';
  end if;

  update coupons set used_count = used_count + 1 where id = new.coupon_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger apply_coupon_redemption_on_insert
  before insert on coupon_redemptions
  for each row execute function apply_coupon_redemption();
