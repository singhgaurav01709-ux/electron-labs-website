-- ================================================================
-- Electron — Trust & Dashboard Updates
-- ================================================================

-- Add new Settings tables
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT DEFAULT 'Electron',
  logo_url TEXT DEFAULT '/logo.png',
  contact_email TEXT DEFAULT 'hello@electron.com',
  contact_phone TEXT,
  contact_address TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seo_title TEXT DEFAULT 'Electron | Custom AI Systems',
  seo_description TEXT DEFAULT 'Practical AI automation solutions tailored to your workflow.',
  favicon_url TEXT DEFAULT '/favicon.ico',
  analytics_code TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure there is a single row for settings
INSERT INTO company_settings (company_name)
SELECT 'Electron' WHERE NOT EXISTS (SELECT * FROM company_settings);

INSERT INTO website_settings (seo_title)
SELECT 'Electron | Custom AI Systems' WHERE NOT EXISTS (SELECT * FROM website_settings);

-- Update testimonials to support approvals
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS position TEXT;
-- Ensure backward compatibility for existing records by setting them to approved
UPDATE testimonials SET status = 'approved' WHERE status = 'pending';

-- Clean up fake claims in Hero Content
UPDATE hero_content SET 
  headline = 'Custom AI systems built for growing businesses.',
  subheadline = 'Practical AI automation solutions tailored to your workflow. Focused on building useful AI tools that save time and improve customer interactions.',
  social_proof_text = 'Focused on building useful AI tools that save time and improve customer interactions.';

-- Delete all fake case studies and fake testimonials
TRUNCATE TABLE case_studies;
TRUNCATE TABLE testimonials;

-- Update Services to honest messaging
UPDATE services SET features = ARRAY['Custom workflows', 'Call routing', 'Information collection', 'Task creation'] WHERE title = 'AI Voice Agents';
UPDATE services SET title = 'Custom Automation', features = ARRAY['Workflow design', 'API integration', 'Data synchronization', 'Process optimization'] WHERE title = 'Automation Systems';

-- Rewrite FAQs to honest messaging
TRUNCATE TABLE faq_items;
INSERT INTO faq_items (question, answer, category, display_order, is_active) VALUES
('How does the AI Voice Agent work?', 'The AI voice agent answers calls using customized instructions, workflows, and business information. Capabilities depend on configuration and project requirements.', 'General', 1, true),
('How long does setup take?', 'Setup time varies depending on complexity, integrations, and business requirements. Simpler projects may be completed faster than more customized implementations.', 'General', 2, true),
('Can the AI handle complex questions?', 'The AI can handle many common and repetitive inquiries when properly configured. Some situations may still require human assistance.', 'General', 3, true),
('What happens if the AI cannot answer a question?', 'The system can be configured to collect information, transfer calls, create follow-up tasks, or escalate to a human team member.', 'General', 4, true),
('How much does it cost?', 'Pricing depends on project scope, integrations, call volume, customization requirements, and ongoing support needs.', 'Pricing', 5, true),
('Do you offer demos?', 'Demonstrations may be available depending on project requirements and current availability.', 'General', 6, true);

-- Add RLS Policies for new tables
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_company" ON company_settings FOR SELECT USING (true);
CREATE POLICY "admin_all_company" ON company_settings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "public_read_website" ON website_settings FOR SELECT USING (true);
CREATE POLICY "admin_all_website" ON website_settings FOR ALL USING (auth.role() = 'authenticated');

-- Modify testimonials RLS to allow public inserts
CREATE POLICY "public_insert_testimonials" ON testimonials FOR INSERT WITH CHECK (true);
