import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manually parse .env file
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const cleanLine = line.trim();
  if (cleanLine && !cleanLine.startsWith('#')) {
    const parts = cleanLine.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Testing insert with certificate_number and is_valid columns...');
  
  // Try inserting a dummy certificate with random UUIDs to check if columns are recognized
  const dummyUserId = 'ae6ea075-5301-4a3b-840a-60795421ed12'; // admin ID which exists
  const dummyCourseId = '4e4e2b20-d62e-4f89-8894-734876614ea3'; // a product ID which exists
  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: dummyUserId,
      course_id: dummyCourseId,
      certificate_number: 'TEST-VERIFY-12345',
      is_valid: true
    })
    .select();
  
  console.log('Insert test result:', { data, error });
}

run();
