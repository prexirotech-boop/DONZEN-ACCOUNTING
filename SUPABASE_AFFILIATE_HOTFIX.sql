-- ═══════════════════════════════════════════════════════════════════════════
-- DONZEN ACCOUNTING — AFFILIATE COMMISSION TRIGGER HOTFIX
-- Run this in Supabase Dashboard → SQL Editor
-- Fixes: double-firing, missing tier rate sync, duplicate commissions
-- Safe to re-run (idempotent)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Add unique index on order_id for proper ON CONFLICT handling ─────────
CREATE UNIQUE INDEX IF NOT EXISTS affiliate_commissions_order_id_idx ON affiliate_commissions(order_id);

-- ─── 2. Replace the commission trigger function ─────────────────────────────
CREATE OR REPLACE FUNCTION create_affiliate_commission_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_affiliate RECORD;
  v_rate NUMERIC(5,2);
  v_commission BIGINT;
BEGIN
  -- Only fire when status becomes 'paid' and affiliate_code is set
  IF NEW.status = 'paid' AND NEW.affiliate_code IS NOT NULL THEN
    -- Guard: on UPDATE, skip if already paid before (prevents double-fire)
    IF TG_OP = 'UPDATE' AND OLD.status = 'paid' THEN
      RETURN NEW;
    END IF;

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

      -- Insert commission record (skip if this order already has one)
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
      ON CONFLICT (order_id) DO NOTHING;

      -- Only update totals if we actually inserted (not a duplicate)
      IF FOUND THEN
        -- Update affiliate totals and sync tier commission rate
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
          commission_rate = CASE
            WHEN custom_rate IS NOT NULL THEN commission_rate
            WHEN total_referrals + 1 >= 50 THEN 35.00
            WHEN total_referrals + 1 >= 21 THEN 30.00
            WHEN total_referrals + 1 >= 6  THEN 25.00
            ELSE 20.00
          END,
          updated_at = NOW()
        WHERE id = v_affiliate.id;

        -- Mark the most recent unconverted referral click as converted
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
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 3. Recreate the trigger ──────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trigger_affiliate_commission ON orders;
CREATE TRIGGER trigger_affiliate_commission
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION create_affiliate_commission_on_order();
