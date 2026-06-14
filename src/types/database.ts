export interface HeroContent {
  id: string;
  headline: string;
  subheadline: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  social_proof_text: string | null;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string | null;
  contact_address: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  updated_at: string;
}

export interface WebsiteSettings {
  id: string;
  seo_title: string;
  seo_description: string;
  favicon_url: string;
  analytics_code: string | null;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  business_name: string | null;
  position: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected';
  display_order: number;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  client_name: string;
  industry: string | null;
  headline: string;
  description: string | null;
  key_metric: string | null;
  key_metric_value: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  project_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DemoVideo {
  id: string;
  title: string | null;
  video_url: string;
  thumbnail_url: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface HomepageStat {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  message: string | null;
  created_at: string;
}
