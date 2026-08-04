-- ═══════════════════════════════════════════════════════════════════════════
-- AMPLIFIED SKILLS / DONZEN ACCOUNTING — AFFILIATE SYSTEM SETUP
-- Run this script in your Supabase Dashboard → SQL Editor
-- It is safe to re-run (idempotent using IF NOT EXISTS / OR REPLACE)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── STEP 1: Extend existing tables ──────────────────────────────────────────

-- Add affiliate_code and status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS affiliate_enabled BOOLEAN DEFAULT TRUE;

-- Add referral tracking columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_id UUID;

-- ─── STEP 2: Create affiliate_code generator function ─────────────────────────

CREATE OR REPLACE FUNCTION generate_affiliate_code(user_name TEXT, user_id UUID)
RETURNS TEXT AS $$
DECLARE
  base TEXT;
  code TEXT;
  suffix TEXT;
  attempts INT := 0;
BEGIN
  -- Build base from first name (up to 6 chars, uppercase, alphanumeric only)
  base := upper(regexp_replace(split_part(coalesce(user_name, 'USER'), ' ', 1), '[^A-Za-z0-9]', '', 'g'));
  base := left(base, 6);
  IF length(base) < 2 THEN base := 'USER'; END IF;

  LOOP
    -- Generate 4-char random suffix from UUID
    suffix := upper(substring(replace(user_id::text, '-', ''), attempts * 4 + 1, 4));
    code := base || '-' || suffix;

    -- Check uniqueness
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE affiliate_code = code) THEN
      RETURN code;
    END IF;

    attempts := attempts + 1;
    IF attempts > 10 THEN
      -- Fallback: use random md5
      code := base || '-' || upper(substring(md5(random()::text), 1, 4));
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── STEP 3: Auto-assign affiliate codes to existing users ───────────────────

UPDATE profiles
SET affiliate_code = generate_affiliate_code(full_name, id)
WHERE affiliate_code IS NULL;

-- ─── STEP 4: Create trigger to auto-assign affiliate_code on new user signup ──

CREATE OR REPLACE FUNCTION auto_assign_affiliate_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.affiliate_code IS NULL THEN
    NEW.affiliate_code := generate_affiliate_code(NEW.full_name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_assign_affiliate_code ON profiles;
CREATE TRIGGER trigger_assign_affiliate_code
  BEFORE INSERT OR UPDATE OF full_name ON profiles
  FOR EACH ROW EXECUTE FUNCTION auto_assign_affiliate_code();

-- ─── STEP 5: AFFILIATES table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS affiliates (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID UNIQUE NOT NULL,
  affiliate_code     TEXT UNIQUE NOT NULL,
  status             TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  tier               TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  commission_rate    NUMERIC(5,2) DEFAULT 20.00, -- percentage e.g. 20.00 = 20%
  custom_rate        NUMERIC(5,2),               -- admin override, overrides tier rate
  total_clicks       INTEGER DEFAULT 0,
  total_referrals    INTEGER DEFAULT 0,
  total_earnings     BIGINT DEFAULT 0,           -- in kobo/cents
  total_paid         BIGINT DEFAULT 0,           -- amount already paid out
  payout_method      TEXT,                       -- 'bank_transfer', 'paypal', etc.
  payout_details     JSONB DEFAULT '{}',         -- bank/paypal details
  notes              TEXT,                       -- admin notes
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  
  -- Named constraint matching frontend requests (profiles!affiliates_user_id_fkey)
  CONSTRAINT affiliates_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─── STEP 6: AFFILIATE_REFERRALS table (click tracking) ──────────────────────

CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id    UUID NOT NULL,
  affiliate_code  TEXT NOT NULL,
  visitor_ip      TEXT,
  landing_page    TEXT,
  user_agent      TEXT,
  converted       BOOLEAN DEFAULT FALSE,
  order_id        BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  
  -- Named constraint matching frontend requests
  CONSTRAINT affiliate_referrals_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS affiliate_referrals_affiliate_id_idx ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_referrals_code_idx ON affiliate_referrals(affiliate_code);

-- ─── STEP 7: AFFILIATE_COMMISSIONS table ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id    UUID NOT NULL,
  order_id        BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  order_amount    BIGINT NOT NULL,    -- in kobo
  commission_rate NUMERIC(5,2) NOT NULL,
  commission_amount BIGINT NOT NULL, -- in kobo
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled')),
  payout_id       UUID,              -- links to affiliate_payouts when paid
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  -- Named constraint matching frontend requests (affiliates!affiliate_commissions_affiliate_id_fkey)
  CONSTRAINT affiliate_commissions_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS affiliate_commissions_affiliate_id_idx ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_commissions_status_idx ON affiliate_commissions(status);

-- ─── STEP 8: AFFILIATE_PAYOUTS table ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id      UUID NOT NULL,
  amount            BIGINT NOT NULL,  -- total payout in kobo
  commission_ids    UUID[],           -- which commissions are included
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  payout_method     TEXT,
  transaction_ref   TEXT,
  payout_details    JSONB DEFAULT '{}',
  notes             TEXT,
  paid_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  
  -- Named constraint matching frontend requests (affiliates!affiliate_payouts_affiliate_id_fkey)
  CONSTRAINT affiliate_payouts_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

-- ─── STEP 9: Commission trigger — fires on new paid order ───────────────────

CREATE OR REPLACE FUNCTION create_affiliate_commission_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_affiliate RECORD;
  v_rate NUMERIC(5,2);
  v_commission BIGINT;
BEGIN
  -- Only fire on new paid orders that have an affiliate_code
  IF NEW.status = 'paid' AND NEW.affiliate_code IS NOT NULL THEN
    -- Look up the affiliate
    SELECT a.* INTO v_affiliate
    FROM affiliates a
    WHERE a.affiliate_code = NEW.affiliate_code
      AND a.status = 'active'
    LIMIT 1;

    IF FOUND THEN
      -- Use custom rate if set, else use tier commission rate
      v_rate := COALESCE(v_affiliate.custom_rate, v_affiliate.commission_rate);
      v_commission := ROUND((NEW.amount::NUMERIC * v_rate) / 100);

      -- Insert commission record
      INSERT INTO affiliate_commissions (
        affiliate_id,
        order_id,
        order_amount,
        commission_rate,
        commission_amount,
        status
      ) VALUES (
        v_affiliate.id,
        NEW.id,
        NEW.amount,
        v_rate,
        v_commission,
        'pending'
      )
      ON CONFLICT DO NOTHING;

      -- Update affiliate totals
      UPDATE affiliates
      SET
        total_referrals = total_referrals + 1,
        total_earnings  = total_earnings + v_commission,
        tier = CASE
          WHEN total_referrals + 1 >= 50 THEN 'platinum'
          WHEN total_referrals + 1 >= 21 THEN 'gold'
          WHEN total_referrals + 1 >= 6  THEN 'silver'
          ELSE 'bronze'
        END,
        updated_at = NOW()
      WHERE id = v_affiliate.id;

      -- Mark referral as converted
      UPDATE affiliate_referrals
      SET converted = TRUE, order_id = NEW.id
      WHERE id = (
        SELECT id
        FROM affiliate_referrals
        WHERE affiliate_code = NEW.affiliate_code
          AND converted = FALSE
        ORDER BY created_at DESC
        LIMIT 1
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_affiliate_commission ON orders;
CREATE TRIGGER trigger_affiliate_commission
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION create_affiliate_commission_on_order();

-- ─── STEP 10: Auto-create affiliate record when user profile is created ───────

CREATE OR REPLACE FUNCTION auto_create_affiliate()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO affiliates (user_id, affiliate_code, status)
  VALUES (NEW.id, NEW.affiliate_code, 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_create_affiliate ON profiles;
CREATE TRIGGER trigger_create_affiliate
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION auto_create_affiliate();

-- ─── STEP 11: Back-fill affiliates for all existing users ────────────────────

INSERT INTO affiliates (user_id, affiliate_code, status)
SELECT id, affiliate_code, 'active'
FROM profiles
WHERE affiliate_code IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- ─── STEP 12: secure check_affiliate_code RPC function ───────────────────────

CREATE OR REPLACE FUNCTION check_affiliate_code(p_code TEXT)
RETURNS TABLE (id UUID, affiliate_code TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.affiliate_code
  FROM affiliates a
  WHERE a.affiliate_code = p_code
    AND a.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── STEP 13: secure track_affiliate_click RPC function ──────────────────────

CREATE OR REPLACE FUNCTION track_affiliate_click(
  p_affiliate_code TEXT,
  p_landing_page TEXT,
  p_user_agent TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_affiliate RECORD;
BEGIN
  -- Look up the active affiliate
  SELECT id, status INTO v_affiliate
  FROM affiliates
  WHERE affiliate_code = p_affiliate_code
    AND status = 'active'
  LIMIT 1;

  IF FOUND THEN
    -- Insert the referral click record
    INSERT INTO affiliate_referrals (
      affiliate_id,
      affiliate_code,
      landing_page,
      user_agent
    ) VALUES (
      v_affiliate.id,
      p_affiliate_code,
      p_landing_page,
      p_user_agent
    );

    -- Increment the click count on affiliates
    UPDATE affiliates
    SET total_clicks = COALESCE(total_clicks, 0) + 1
    WHERE id = v_affiliate.id;

    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── STEP 14: backward compatible increment_affiliate_clicks RPC ──────────────

CREATE OR REPLACE FUNCTION increment_affiliate_clicks(p_affiliate_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE affiliates
  SET total_clicks = COALESCE(total_clicks, 0) + 1
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── STEP 15: update_updated_at triggers for new tables ──────────────────────

DO $$ DECLARE tbl TEXT; BEGIN
  FOREACH tbl IN ARRAY ARRAY['affiliates','affiliate_commissions','affiliate_payouts'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_updated_at ON %I', tbl, tbl);
    EXECUTE format('CREATE TRIGGER %I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', tbl, tbl);
  END LOOP;
END $$;

-- ─── STEP 16: Row Level Security ─────────────────────────────────────────────

ALTER TABLE affiliates              ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts       ENABLE ROW LEVEL SECURITY;

-- Affiliates SELECT: users see their own, admins see all
CREATE POLICY "affiliates_self_read"  ON affiliates FOR SELECT USING (user_id = auth.uid() OR is_admin());
-- Affiliates UPDATE: users can update their own (for payout settings)
CREATE POLICY "affiliates_self_update" ON affiliates FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "affiliates_admin_all"  ON affiliates FOR ALL USING (is_admin());

-- Referrals: affiliates see their own, admins see all
CREATE POLICY "referrals_self_read"  ON affiliate_referrals FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()) OR is_admin());
CREATE POLICY "referrals_anon_ins"   ON affiliate_referrals FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "referrals_auth_ins"   ON affiliate_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "referrals_admin_all"  ON affiliate_referrals FOR ALL USING (is_admin());

-- Commissions: affiliates see their own, admins manage all
CREATE POLICY "commissions_self_read" ON affiliate_commissions FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()) OR is_admin());
CREATE POLICY "commissions_admin_all" ON affiliate_commissions FOR ALL USING (is_admin());

-- Payouts: affiliates see their own, admins manage all
CREATE POLICY "payouts_self_read"  ON affiliate_payouts FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()) OR is_admin());
CREATE POLICY "payouts_admin_all"  ON affiliate_payouts FOR ALL USING (is_admin());

-- ─── STEP 17: Seed default platform affiliate settings ────────────────────────

INSERT INTO settings (id, value) VALUES
  ('affiliate_config', '{
    "enabled": true,
    "default_commission_rate": 20,
    "bronze_rate": 20,
    "silver_rate": 25,
    "gold_rate": 30,
    "platinum_rate": 35,
    "bronze_min_referrals": 0,
    "silver_min_referrals": 6,
    "gold_min_referrals": 21,
    "platinum_min_referrals": 50,
    "cookie_duration_days": 30,
    "min_payout_amount": 5000,
    "payout_currency": "NGN"
  }')
ON CONFLICT (id) DO NOTHING;
