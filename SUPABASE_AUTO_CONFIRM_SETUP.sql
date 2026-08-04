-- Trigger function to auto-confirm user email upon signup (no confirmed_at since it is a generated column)
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create BEFORE INSERT trigger on auth.users (runs right before the user is inserted)
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user_email();

-- Backup: Ensure any existing users who paid have their email confirmed
CREATE OR REPLACE FUNCTION public.auto_confirm_user_on_paid_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' THEN
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.customer_email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_paid_confirm ON orders;
CREATE TRIGGER on_order_paid_confirm
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user_on_paid_order();
