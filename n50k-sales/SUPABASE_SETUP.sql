-- ═══════════════════════════════════════════════════════════════════════════
-- N50K BLUEPRINT — SUPABASE SETUP
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- Project: zisbhfwxaiqtxtkecyow
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── 1. ORDERS TABLE ────────────────────────────────────────────────────────
-- Stores every completed Paystack payment

CREATE TABLE IF NOT EXISTS orders (
  id               BIGSERIAL       PRIMARY KEY,
  reference        TEXT            UNIQUE NOT NULL,   -- Paystack transaction ref
  customer_name    TEXT            NOT NULL,
  customer_email   TEXT            NOT NULL,
  customer_phone   TEXT,
  product          TEXT            DEFAULT 'The N50K Blueprint',
  amount           INTEGER         DEFAULT 2500,      -- Amount in Naira
  status           TEXT            DEFAULT 'paid',
  created_at       TIMESTAMPTZ     DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     DEFAULT NOW()
);

-- Index for fast email lookups (e.g. resending download links)
CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (customer_email);
CREATE INDEX IF NOT EXISTS orders_ref_idx   ON orders (reference);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);


-- ─── 2. ROW LEVEL SECURITY ──────────────────────────────────────────────────

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (frontend posts orders after payment)
DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
CREATE POLICY "Allow anonymous insert"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access (for admin dashboard, webhooks)
DROP POLICY IF EXISTS "Service role full access" ON orders;
CREATE POLICY "Service role full access"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Customers can only see their own order (optional, for a customer portal)
DROP POLICY IF EXISTS "Customers read own order" ON orders;
CREATE POLICY "Customers read own order"
  ON orders FOR SELECT
  TO anon
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');


-- ─── 3. AUTO-UPDATE updated_at ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── 4. SUBSCRIBERS TABLE ───────────────────────────────────────────────────
-- Optional: Capture email leads who don't complete payment

CREATE TABLE IF NOT EXISTS subscribers (
  id           BIGSERIAL    PRIMARY KEY,
  email        TEXT         UNIQUE NOT NULL,
  name         TEXT,
  source       TEXT         DEFAULT 'sales_page',
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert on subscribers" ON subscribers;
CREATE POLICY "Allow anon insert on subscribers"
  ON subscribers FOR INSERT
  TO anon
  WITH CHECK (true);


-- ─── 5. VERIFY SETUP ────────────────────────────────────────────────────────
-- Run this SELECT to confirm everything was created correctly:

SELECT
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('orders', 'subscribers')
ORDER BY table_name;

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! Your Supabase is ready.
-- 
-- Next steps:
-- 1. Go to Settings → API in your Supabase dashboard
-- 2. Copy the "anon" public key (NOT service_role)
-- 3. Add it to your Vercel env as VITE_SUPABASE_ANON_KEY
-- 4. The service_role key should ONLY be used server-side (never in frontend)
-- ═══════════════════════════════════════════════════════════════════════════
