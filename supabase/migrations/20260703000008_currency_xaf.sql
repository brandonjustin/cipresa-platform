-- CIPRESA operates in Cameroon/CEMAC, which uses the Central African CFA
-- franc (XAF), not the West African CFA franc (XOF) used by UEMOA
-- countries (Senegal, Côte d'Ivoire, etc). Both render as "CFA" and are
-- pegged 1:1 to each other, so this never affected checkout math or the
-- Nokash payload (currency isn't even sent there — see nokash.ts) — it was
-- purely a wrong label on every price. Fix column defaults and backfill any
-- existing 'XOF' rows to 'XAF'.
alter table courses alter column currency set default 'XAF';
alter table products alter column currency set default 'XAF';
alter table plants alter column currency set default 'XAF';
alter table orders alter column currency set default 'XAF';

update courses set currency = 'XAF' where currency = 'XOF';
update products set currency = 'XAF' where currency = 'XOF';
update plants set currency = 'XAF' where currency = 'XOF';
update orders set currency = 'XAF' where currency = 'XOF';
