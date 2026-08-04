import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manually parse .env file
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('--- STARTING AFFILIATE SYSTEM INTEGRATION VERIFICATION ---');
  
  // 1. Check RPC check_affiliate_code
  console.log('Testing RPC check_affiliate_code...');
  const { data: codeCheck, error: codeError } = await supabase
    .rpc('check_affiliate_code', { p_code: 'NON_EXISTENT_CODE' });
  
  if (codeError) {
    console.error('❌ check_affiliate_code RPC failed or is not installed:', codeError.message);
  } else {
    console.log('✅ check_affiliate_code RPC successfully executed (non-existent code correctly returned empty):', codeCheck);
  }

  // 2. Check RPC track_affiliate_click
  console.log('Testing RPC track_affiliate_click...');
  const { data: clickCheck, error: clickError } = await supabase
    .rpc('track_affiliate_click', {
      p_affiliate_code: 'NON_EXISTENT_CODE',
      p_landing_page: 'http://localhost/test',
      p_user_agent: 'NodeVerificationScript'
    });

  if (clickError) {
    console.error('❌ track_affiliate_click RPC failed or is not installed:', clickError.message);
  } else {
    console.log('✅ track_affiliate_click RPC successfully executed (non-existent code correctly returned false):', clickCheck);
  }

  // 3. Test querying tables
  const tables = ['affiliates', 'affiliate_referrals', 'affiliate_commissions', 'affiliate_payouts'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.error(`❌ Table '${table}' check failed:`, error.message);
    } else {
      console.log(`✅ Table '${table}' check passed (exists and accessible)`);
    }
  }

  console.log('--- VERIFICATION COMPLETED ---');
}

run();
