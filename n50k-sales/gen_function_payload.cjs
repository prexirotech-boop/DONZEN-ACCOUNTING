const fs = require('fs');
const codePath = 'c:\\Users\\Admin\\Downloads\\n50k-blueprint-sales_1\\n50k-sales\\supabase\\functions\\send-confirmation\\index.ts';
const code = fs.readFileSync(codePath, 'utf8');
const data = {
    name: 'send-confirmation',
    slug: 'send-confirmation',
    body: code,
    verify_jwt: false
};
fs.writeFileSync('function_payload.json', JSON.stringify(data));
