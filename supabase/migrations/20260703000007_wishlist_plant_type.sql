-- Plants are wishlistable from the encyclopedia detail page just like
-- courses/products, but wishlist_items.item_type only allowed those two
-- values — extend the check constraint to include 'plant'.
alter table wishlist_items drop constraint wishlist_items_item_type_check;
alter table wishlist_items add constraint wishlist_items_item_type_check
  check (item_type in ('course', 'product', 'plant'));
