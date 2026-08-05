-- Run this in your Supabase SQL Editor to change the admin password to password123
UPDATE auth.users 
SET encrypted_password = extensions.crypt('password123', extensions.gen_salt('bf', 10)) 
WHERE email = 'admin@amplifiedskills.com';
