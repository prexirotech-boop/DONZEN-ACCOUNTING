-- Allow authenticated users who are admins to write settings
DROP POLICY IF EXISTS "Admins can write settings" ON public.settings;
CREATE POLICY "Admins can write settings"
ON public.settings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Insert default certificate configuration settings row
INSERT INTO public.settings (id, value)
VALUES (
  'certificate_config',
  '{"default_template": "coursera", "instructor_name": "Samuel Onainor", "instructor_title": "Founder & CEO, Donzen Accounting Hub", "signature_url": "", "use_signature_image": false}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
