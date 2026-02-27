const fs = require('fs');
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc2JoZnd4YWlxdHh0a2VjeW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjExODg3MCwiZXhwIjoyMDg3Njk0ODcwfQ.73ZbPmer59jf1SqXb9Ey7L1DhHwubQmGHlv5n-N2QSs';
const sql = `
-- Create the trigger for the Edge Function
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- This SQL triggers the edge function directly
CREATE OR REPLACE TRIGGER on_order_paid
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://zisbhfwxaiqtxtkecyow.supabase.co/functions/v1/send-confirmation',
  'POST',
  '{"Content-Type":"application/json", "Authorization":"Bearer ${serviceRoleKey}"}',
  '{}', -- Body will be populated by row data
  '1000'
);
`;

const data = { query: sql };
fs.writeFileSync('webhook_query.json', JSON.stringify(data));
