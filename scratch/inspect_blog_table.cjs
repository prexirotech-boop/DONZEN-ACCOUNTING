const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jpppqzzooywmzzpaugcl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcHBxenpvb3l3bXp6cGF1Z2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzU3MzMsImV4cCI6MjEwMDMxMTczM30.54NynJ26GXlmSbawepbg8XrlIMZTEmpcbmz6g_NECdg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Querying blog_posts table...');
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error querying blog_posts:', error.message);
  } else {
    console.log('Successfully queried blog_posts! Found data:', data);
  }
}

main();
