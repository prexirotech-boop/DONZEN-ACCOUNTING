-- Drop NOT NULL constraint on certificate_no to prevent insert errors when certificate_number is used
ALTER TABLE public.certificates ALTER COLUMN certificate_no DROP NOT NULL;

-- Trigger to automatically sync certificate_no and certificate_number columns for compatibility
CREATE OR REPLACE FUNCTION public.sync_certificate_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_no IS NULL AND NEW.certificate_number IS NOT NULL THEN
    NEW.certificate_no := NEW.certificate_number;
  ELSIF NEW.certificate_number IS NULL AND NEW.certificate_no IS NOT NULL THEN
    NEW.certificate_number := NEW.certificate_no;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_certificate_columns ON public.certificates;
CREATE TRIGGER trigger_sync_certificate_columns
  BEFORE INSERT OR UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_certificate_columns();
