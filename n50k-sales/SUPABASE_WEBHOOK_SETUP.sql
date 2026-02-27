-- 1. Create a Webhook to trigger the Edge Function
-- Go to Supabase Dashboard -> Database -> Webhooks -> Create a new webhook

-- Name: send_order_confirmation
-- Table: orders
-- Events: INSERT
-- Type: Edge Function
-- Function: send-confirmation (select the one you deployed)

-- OR run this SQL manually if you prefer code-based setup:

-- Note: You need to replace 'YOUR_FUNCTION_URL' and 'YOUR_SERVICE_ROLE_KEY' 
-- if doing this via raw HTTP instead of the built-in Edge Function connector.
-- It is recommended to use the Dashboard UI for "Edge Function" webhooks.

-- Enable the 'http' extension if it's not already
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- Create the trigger
CREATE OR REPLACE TRIGGER on_order_paid
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://zisbhfwxaiqtxtkecyow.supabase.co/functions/v1/send-confirmation',
  'POST',
  '{"Content-Type":"application/json", "Authorization":"Bearer YOUR_SERVICE_ROLE_KEY"}',
  '{}', -- This will be populated by the record
  '1000'
);

-- IMPORTANT: The easiest way to set this up is via the Supabase Dashboard 
-- under "Database" -> "Webhooks". 
-- It allows you to select "Edge Function" directly without writing complex SQL.
