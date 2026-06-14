-- ================================================================
-- Grow AI Forge — Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables
-- ================================================================

-- Hero Content
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL DEFAULT 'Never Miss Another Lead Again',
  subheadline TEXT DEFAULT 'AI Voice Agents that answer calls, qualify prospects, and book appointments 24/7.',
  cta_primary_text TEXT DEFAULT 'Book Consultation',
  cta_primary_link TEXT DEFAULT '#contact',
  cta_secondary_text TEXT DEFAULT 'Watch Demo',
  cta_secondary_link TEXT DEFAULT '#demo',
  social_proof_text TEXT DEFAULT 'Trusted by 200+ businesses across India',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'workflow',
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  business_name TEXT,
  quote TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case Studies
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  industry TEXT,
  headline TEXT NOT NULL,
  description TEXT,
  key_metric TEXT,
  key_metric_value TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  project_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo Videos
CREATE TABLE IF NOT EXISTS demo_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Statistics
CREATE TABLE IF NOT EXISTS homepage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (contact form submissions)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- Row Level Security
-- ================================================================

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read policies (for landing page)
CREATE POLICY "public_read_hero" ON hero_content FOR SELECT USING (true);
CREATE POLICY "public_read_services" ON services FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_case_studies" ON case_studies FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_portfolio" ON portfolio_projects FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_faq" ON faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_videos" ON demo_videos FOR SELECT USING (true);
CREATE POLICY "public_read_stats" ON homepage_stats FOR SELECT USING (true);

-- Public insert for leads (contact form)
CREATE POLICY "public_insert_leads" ON leads FOR INSERT WITH CHECK (true);

-- Authenticated admin full access
CREATE POLICY "admin_all_hero" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_case_studies" ON case_studies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_portfolio" ON portfolio_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_faq" ON faq_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_videos" ON demo_videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_stats" ON homepage_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_read_leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');

-- ================================================================
-- Seed Data
-- ================================================================

-- Insert default hero content
INSERT INTO hero_content (headline, subheadline) VALUES (
  'Never Miss Another Lead Again',
  'AI Voice Agents that answer calls, qualify prospects, and book appointments 24/7.'
);

-- Insert default services
INSERT INTO services (title, description, icon, features, is_featured, display_order) VALUES
('AI Voice Agents', 'Intelligent voice agents that answer calls, qualify leads, handle FAQs, and book appointments 24/7.', 'phone', ARRAY['24/7 call answering', 'Lead qualification', 'Appointment booking', 'FAQ handling', 'CRM integration', 'Custom voice & script'], true, 1),
('AI Ad Creatives', 'AI-generated ad creatives that convert. High-performing ad copy, images, and video scripts.', 'megaphone', ARRAY['Ad copy generation', 'Creative testing', 'Audience targeting', 'Performance optimization'], false, 2),
('Business Websites', 'Premium, conversion-optimized websites designed to turn visitors into customers.', 'globe', ARRAY['Custom design', 'SEO optimization', 'Mobile-first', 'Fast loading'], false, 3),
('Automation Systems', 'End-to-end business automation. CRM integrations, email sequences, and workflow automation.', 'workflow', ARRAY['CRM automation', 'Email sequences', 'Workflow design', 'Tool integration'], false, 4);
