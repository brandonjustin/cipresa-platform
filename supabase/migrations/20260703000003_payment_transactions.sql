-- Payment transactions track every Nokash payin attempt against an order,
-- keyed by a unique idempotency key derived from Nokash's own reference so
-- webhook retries (which every payment aggregator does) never double-charge
-- or double-grant an entitlement. Written exclusively by the checkout
-- server action (on initiate) and the webhook route (on status update),
-- both using the service-role client — there is no client-facing write path.

create table payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  provider text not null default 'nokash',
  provider_reference text,
  idempotency_key text unique not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'cancelled')),
  raw_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_payment_transactions_order on payment_transactions(order_id);
create index idx_payment_transactions_status on payment_transactions(status);

create trigger update_payment_transactions_updated_at
  before update on payment_transactions for each row execute function update_updated_at();

alter table payment_transactions enable row level security;
create policy "Users can view own payment transactions" on payment_transactions
  for select using (exists (select 1 from orders where id = payment_transactions.order_id and user_id = auth.uid()));
create policy "Admins can manage all payment transactions" on payment_transactions for all using (is_admin());
