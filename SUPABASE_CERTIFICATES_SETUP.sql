-- ═══════════════════════════════════════════════════════════════════════════
-- AMPLIFIED SKILLS / DONZEN ACCOUNTING — CERTIFICATE SYSTEM UPGRADE
-- Run this script in your Supabase Dashboard → SQL Editor
-- It is safe to re-run (idempotent)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── STEP 0: Create update_updated_at helper if it does not exist ─────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role = 'admin' FROM profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── STEP 1: Add missing columns to certificates table ───────────────────────

ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS certificate_number TEXT UNIQUE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS is_valid BOOLEAN DEFAULT TRUE;

-- ─── STEP 2: Backfill certificate_number for existing certificates ───────────

UPDATE public.certificates
SET certificate_number = 'AS-' || upper(to_hex(extract(epoch from issued_at)::bigint)) || '-' || upper(substring(md5(id::text) from 1 for 5))
WHERE certificate_number IS NULL;

-- ─── STEP 3: Make certificate_number NOT NULL ────────────────────────────────

ALTER TABLE public.certificates ALTER COLUMN certificate_number SET NOT NULL;

-- ─── STEP 4: Create auto-issuance trigger function ──────────────────────────

CREATE OR REPLACE FUNCTION auto_generate_certificate()
RETURNS TRIGGER AS $$
DECLARE
  v_cert_number TEXT;
  v_ts TEXT;
  v_rand TEXT;
BEGIN
  -- Generate unique certificate number: AS-TIMESTAMP-RANDOM
  v_ts := upper(to_hex(extract(epoch from now())::bigint));
  v_rand := upper(substring(md5(random()::text) from 1 for 5));
  v_cert_number := 'AS-' || v_ts || '-' || v_rand;

  -- Insert certificate if not already issued
  INSERT INTO public.certificates (user_id, course_id, certificate_number, is_valid)
  VALUES (NEW.user_id, NEW.course_id, v_cert_number, true)
  ON CONFLICT (user_id, course_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger to auto-generate certificate on new course review submission
DROP TRIGGER IF EXISTS trigger_auto_generate_certificate ON reviews;
CREATE TRIGGER trigger_auto_generate_certificate
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION auto_generate_certificate();

-- ─── STEP 5: Create verify_certificate secure RPC ────────────────────────────

CREATE OR REPLACE FUNCTION verify_certificate(p_cert_number TEXT)
RETURNS TABLE (
  certificate_number TEXT,
  student_name TEXT,
  course_title TEXT,
  issued_at TIMESTAMPTZ,
  is_valid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.certificate_number,
    pr.full_name AS student_name,
    pd.title AS course_title,
    c.issued_at,
    c.is_valid
  FROM public.certificates c
  JOIN public.profiles pr ON pr.id = c.user_id
  JOIN public.courses co ON co.id = c.course_id
  JOIN public.products pd ON pd.id = co.id
  WHERE c.certificate_number = p_cert_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
