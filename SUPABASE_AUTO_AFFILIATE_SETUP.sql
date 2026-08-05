-- Trigger function to automatically create an affiliate record for every new profile
CREATE OR REPLACE FUNCTION public.auto_create_affiliate_for_profile()
RETURNS TRIGGER AS $$
DECLARE
  v_code TEXT;
BEGIN
  -- Generate affiliate code if not present
  IF NEW.affiliate_code IS NULL THEN
    BEGIN
      v_code := generate_affiliate_code(NEW.full_name, NEW.id);
    EXCEPTION WHEN OTHERS THEN
      v_code := 'REF-' || upper(substring(md5(random()::text) from 1 for 6));
    END;
  ELSE
    v_code := NEW.affiliate_code;
  END IF;

  -- Create affiliate record
  INSERT INTO public.affiliates (user_id, affiliate_code, status, commission_rate)
  VALUES (NEW.id, v_code, 'active', 20.00)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on profiles
DROP TRIGGER IF EXISTS trigger_auto_create_affiliate ON profiles;
CREATE TRIGGER trigger_auto_create_affiliate
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_affiliate_for_profile();

-- Backfill: Create affiliate records for all existing profiles who don't have one
INSERT INTO public.affiliates (user_id, affiliate_code, status, commission_rate)
SELECT 
  id, 
  coalesce(affiliate_code, 'REF-' || upper(substring(md5(random()::text) from 1 for 6))), 
  'active', 
  20.00
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
