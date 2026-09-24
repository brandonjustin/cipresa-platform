-- Nokash Mobile Money payin needs the payer's MSISDN specifically (separate
-- from any shipping address, and required even for course-only orders that
-- have no shipping address at all).
alter table orders add column customer_phone text;
alter table orders add column customer_email text;
