import json
import os

sql_path = r'c:\Users\Admin\Downloads\n50k-blueprint-sales_1\n50k-sales\SUPABASE_SETUP.sql'
with open(sql_path, 'r', encoding='utf-8') as f:
    sql = f.read()

data = {"query": sql}
with open('setup_query.json', 'w', encoding='utf-8') as f:
    json.dump(data, f)
