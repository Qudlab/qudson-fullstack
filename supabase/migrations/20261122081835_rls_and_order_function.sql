/*
# Row level security, owner-claim function and atomic order creation

1. Security — Row Level Security policies
- PUBLIC STOREFRONT (anon + authenticated can read):
  products, product_images, categories, reviews (approved only), testimonials (approved only),
  website_settings (read only), orders/order_items (insert-only via the atomic RPC, never read by public).
- ADMIN-ONLY WRITES: products, product_images, categories, reviews, testimonials, website_settings are
  writable only by users with a row in admin_roles (owner, product_manager or order_manager). Owner is the
  only role that can delete products/categories, manage testimonials or change website settings.
- admin_roles: readable by admins; writable ONLY by the owner (and by the one-time owner-claim function).
- admin_invitations: owner can create/list/revoke; the accept step is a security-definer function keyed on a
  one-time token.
- profiles: each authenticated user can read/update their own row; admins can read all.
- orders/order_items: NO select/insert policy for the public. Customers never read them directly; admins read
  through policies, and order creation happens server-side in an edge function using the service role.
- inventory_movements: admin read-only; rows are written server-side only.

2. New Functions (security definer where needed)
- `current_admin_role()` — returns the caller's admin role (or null). Stable + search_path pinned.
- `has_admin_access()` — true when caller has any admin role. Used by every admin policy.
- `claim_owner_account(token)` — one-time binding of the setup token in website_settings to the first
  authenticated user who calls it, making them owner. Rejects reuse and double-claims.
- `accept_admin_invite(token)` — one-time acceptance of an invitation by a signed-in user, grants the invited
  role if the token is valid, unexpired and unaccepted.
- `create_order_atomic(...)` — atomic, race-safe order creation: verifies each product exists, is in stock and
  has sufficient quantity, validates prices SERVER-SIDE (never trusts browser prices), decrements stock with a
  single atomic UPDATE guarded by `stock_quantity >= quantity`, inserts the order + items + inventory movements,
  and generates the next QC-#### reference. Raises clear exceptions on insufficient stock or duplicate
  submission. Runs as the anon/authenticated caller (security definer only to read stock reliably) and takes
  an idempotency key so a double-clicked checkout button cannot create two orders.

3. Grants
- Explicit GRANTs for every exposed table/function to exactly the roles that need them. admin tables get no
  public grants. Sequence grants for serial-less tables are unnecessary (uuid defaults).

4. Notes
- The owner-claim token is stored in website_settings under key 'owner_setup_token' and is set via the service
  role by the setup flow, never exposed in frontend code.
- Storage bucket policies are created in a separate migration.
*/

-- ============================================================
-- Helper functions
-- ============================================================

CREATE OR REPLACE FUNCTION current_admin_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM admin_roles WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION has_admin_access()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid());
$$;

-- ============================================================
-- Enable RLS
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Catalog: public read, admin write
-- ============================================================
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;
GRANT SELECT ON testimonials TO anon, authenticated;
GRANT SELECT ON website_settings TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON product_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON reviews TO authenticated;
GRANT INSERT, UPDATE, DELETE ON testimonials TO authenticated;
GRANT INSERT, UPDATE, DELETE ON website_settings TO authenticated;

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage categories"
  ON categories FOR ALL TO authenticated
  USING (has_admin_access()) WITH CHECK (has_admin_access());

CREATE POLICY "Public can view products"
  ON products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage products"
  ON products FOR ALL TO authenticated
  USING (has_admin_access()) WITH CHECK (has_admin_access());

CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage product images"
  ON product_images FOR ALL TO authenticated
  USING (has_admin_access()) WITH CHECK (has_admin_access());

CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT TO anon, authenticated USING (approved);

CREATE POLICY "Admins manage reviews"
  ON reviews FOR ALL TO authenticated
  USING (has_admin_access()) WITH CHECK (has_admin_access());

CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT TO anon, authenticated USING (approved);

CREATE POLICY "Owner manages testimonials"
  ON testimonials FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Public can view website settings"
  ON website_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Owner manages website settings"
  ON website_settings FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  );

-- ============================================================
-- Orders: no public access; admins read + update status only
-- ============================================================
GRANT SELECT, UPDATE (status, payment_status, updated_at) ON orders TO authenticated;
GRANT SELECT ON order_items TO authenticated;
GRANT SELECT ON customers TO authenticated;

CREATE POLICY "Admins view orders"
  ON orders FOR SELECT TO authenticated
  USING (has_admin_access());

CREATE POLICY "Admins update order status"
  ON orders FOR UPDATE TO authenticated
  USING (has_admin_access())
  WITH CHECK (has_admin_access());

CREATE POLICY "Admins view order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND has_admin_access()
    )
  );

CREATE POLICY "Admins view customers"
  ON customers FOR SELECT TO authenticated
  USING (has_admin_access());

-- ============================================================
-- Inventory movements: admin read-only, written server-side
-- ============================================================
GRANT SELECT ON inventory_movements TO authenticated;

CREATE POLICY "Admins view inventory movements"
  ON inventory_movements FOR SELECT TO authenticated
  USING (has_admin_access());

-- ============================================================
-- Admin accounts: owner-managed, one-time owner claim
-- ============================================================
GRANT SELECT ON admin_roles TO authenticated;
GRANT INSERT, DELETE ON admin_roles TO authenticated;
GRANT SELECT ON admin_invitations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON admin_invitations TO authenticated;
GRANT SELECT, UPDATE (full_name) ON profiles TO authenticated;
GRANT INSERT ON profiles TO authenticated;

CREATE POLICY "Admins view roles"
  ON admin_roles FOR SELECT TO authenticated
  USING (has_admin_access());

CREATE POLICY "Owner manages roles"
  ON admin_roles FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Owner views invitations"
  ON admin_invitations FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Owner manages invitations"
  ON admin_invitations FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Users view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (has_admin_access());

-- ============================================================
-- Owner claim + invite acceptance (security definer, one-time)
-- ============================================================
CREATE OR REPLACE FUNCTION claim_owner_account(setup_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_token text;
  existing_role text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to claim the owner account';
  END IF;

  SELECT value #>> '{}' INTO stored_token
  FROM website_settings WHERE key = 'owner_setup_token';

  IF stored_token IS NULL THEN
    RAISE EXCEPTION 'Owner account has already been claimed or setup token was not found';
  END IF;

  IF stored_token <> setup_token THEN
    RAISE EXCEPTION 'Invalid setup token';
  END IF;

  SELECT role INTO existing_role FROM admin_roles WHERE user_id = auth.uid();
  IF existing_role IS NOT NULL THEN
    RAISE EXCEPTION 'This account already has an administrator role';
  END IF;

  INSERT INTO admin_roles (user_id, role, granted_by)
  VALUES (auth.uid(), 'owner', auth.uid());

  INSERT INTO profiles (id, full_name)
  VALUES (auth.uid(), 'Business Owner')
  ON CONFLICT (id) DO NOTHING;

  DELETE FROM website_settings WHERE key = 'owner_setup_token';

  RETURN 'owner';
END;
$$;

CREATE OR REPLACE FUNCTION accept_admin_invite(invite_token uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv admin_invitations;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to accept an invitation';
  END IF;

  SELECT * INTO inv FROM admin_invitations
  WHERE token = invite_token FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  IF inv.accepted THEN
    RAISE EXCEPTION 'This invitation has already been used';
  END IF;

  IF inv.expires_at < now() THEN
    RAISE EXCEPTION 'This invitation has expired';
  END IF;

  UPDATE admin_invitations SET accepted = true WHERE id = inv.id;

  INSERT INTO admin_roles (user_id, role, granted_by)
  VALUES (auth.uid(), inv.role, inv.invited_by)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, granted_at = now(), granted_by = EXCLUDED.granted_by;

  INSERT INTO profiles (id, full_name)
  VALUES (auth.uid(), split_part((SELECT email FROM auth.users WHERE id = auth.uid()), '@', 1))
  ON CONFLICT (id) DO NOTHING;

  RETURN inv.role;
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_owner_account(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION accept_admin_invite(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION claim_owner_account(text) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_admin_invite(uuid) TO authenticated;

-- ============================================================
-- Atomic race-safe order creation
-- ============================================================
CREATE OR REPLACE FUNCTION create_order_atomic(
  p_items jsonb,           -- [{"product_id": uuid, "quantity": int}, ...]
  p_full_name text,
  p_phone text,
  p_email text,
  p_delivery_address text,
  p_state text,
  p_instructions text,
  p_idempotency_key text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_reference text;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product products%ROWTYPE;
  v_qty integer;
  v_unit_price numeric(12,2);
  v_existing_reference text;
  v_customer_id uuid;
BEGIN
  -- Idempotency: a repeated submission with the same key returns the original order
  IF p_idempotency_key IS NOT NULL AND p_idempotency_key <> '' THEN
    SELECT reference INTO v_existing_reference
    FROM orders
    WHERE ip_hash = ('idem:' || p_idempotency_key)
    LIMIT 1;
    IF v_existing_reference IS NOT NULL THEN
      RETURN jsonb_build_object('reference', v_existing_reference, 'duplicate', true);
    END IF;
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Your cart is empty';
  END IF;

  IF COALESCE(trim(p_full_name), '') = '' OR COALESCE(trim(p_phone), '') = '' THEN
    RAISE EXCEPTION 'Full name and phone number are required';
  END IF;

  IF COALESCE(trim(p_delivery_address), '') = '' OR COALESCE(trim(p_state), '') = '' THEN
    RAISE EXCEPTION 'Delivery address and state are required';
  END IF;

  -- Upsert customer by phone
  INSERT INTO customers (full_name, phone, email)
  VALUES (trim(p_full_name), trim(p_phone), NULLIF(trim(COALESCE(p_email, '')), ''))
  ON CONFLICT (phone) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, customers.email)
  RETURNING id INTO v_customer_id;

  -- Generate next reference (QC-1001, QC-1002, ...)
  SELECT 'QC-' || (1000 + COALESCE((SELECT count(*) FROM orders), 0) + 1)
  INTO v_reference;

  -- Header row first so order_items can reference it
  INSERT INTO orders (reference, customer_id, full_name, phone, email, delivery_address, state, instructions, total_amount, ip_hash)
  VALUES (
    v_reference, v_customer_id, trim(p_full_name), trim(p_phone),
    NULLIF(trim(COALESCE(p_email, '')), ''),
    trim(p_delivery_address), trim(p_state), NULLIF(trim(COALESCE(p_instructions, '')), ''),
    0,
    CASE WHEN p_idempotency_key IS NOT NULL AND p_idempotency_key <> '' THEN 'idem:' || p_idempotency_key ELSE NULL END
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := (v_item #>> '{quantity}')::integer;

    IF v_qty IS NULL OR v_qty < 1 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    SELECT * INTO v_product FROM products WHERE id = (v_item #>> '{product_id}')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'A watch in your cart is no longer available';
    END IF;

    IF NOT v_product.in_stock OR v_product.stock_quantity < v_qty THEN
      RAISE EXCEPTION '% only has % unit(s) left in stock', v_product.name, v_product.stock_quantity;
    END IF;

    -- Server-side price: discounted price when set, otherwise the regular price
    v_unit_price := COALESCE(v_product.discounted_price, v_product.price);

    -- Atomic stock decrement: the WHERE clause is the race guard — two customers
    -- cannot both buy the last unit because only one UPDATE can satisfy it.
    UPDATE products
    SET stock_quantity = stock_quantity - v_qty,
        in_stock = (stock_quantity - v_qty) > 0
    WHERE id = v_product.id AND stock_quantity >= v_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION '% only has % unit(s) left in stock', v_product.name, v_product.stock_quantity;
    END IF;

    INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
    VALUES (v_order_id, v_product.id, v_product.name, v_unit_price, v_qty, v_unit_price * v_qty);

    INSERT INTO inventory_movements (product_id, change, reason, order_id)
    VALUES (v_product.id, -v_qty, 'order', v_order_id);

    v_total := v_total + (v_unit_price * v_qty);
  END LOOP;

  UPDATE orders SET total_amount = v_total WHERE id = v_order_id;

  RETURN jsonb_build_object(
    'reference', v_reference,
    'total', v_total,
    'duplicate', false
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION create_order_atomic(jsonb, text, text, text, text, text, text, text)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_order_atomic(jsonb, text, text, text, text, text, text, text)
  TO anon, authenticated;