const fs = require('fs');
const sqlPath = 'c:\\Users\\Admin\\Downloads\\n50k-blueprint-sales_1\\n50k-sales\\SUPABASE_SETUP.sql';
const sql = fs.readFileSync(sqlPath, 'utf8');
const data = { query: sql };
fs.writeFileSync('setup_query.json', JSON.stringify(data));
