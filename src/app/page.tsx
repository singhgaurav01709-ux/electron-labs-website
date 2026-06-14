import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import DemoVideo from '@/components/landing/DemoVideo';
import AICallFlow from '@/components/landing/AICallFlow';
import Benefits from '@/components/landing/Benefits';
import CaseStudies from '@/components/landing/CaseStudies';
import Services from '@/components/landing/Services';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';

async function getData() {
  try {
    const supabase = await createClient();

    const [
      { data: hero },
      { data: services },
      { data: testimonials },
      { data: caseStudies },
      { data: faqs },
    ] = await Promise.all([
      supabase.from('hero_content').select('*').limit(1).single(),
      supabase.from('services').select('*').order('display_order'),
      supabase.from('testimonials').select('*').eq('is_active', true).eq('status', 'approved').order('display_order'),
      supabase.from('case_studies').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      supabase.from('faq_items').select('*').eq('is_active', true).order('display_order'),
    ]);

    return {
      hero,
      services: services || [],
      testimonials: testimonials || [],
      caseStudies: caseStudies || [],
      faqs: faqs || [],
    };
  } catch {
    return {
      hero: null,
      services: [],
      testimonials: [],
      caseStudies: [],
      faqs: [],
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      <Navbar />
      <main>
        <Hero
          headline={data.hero?.headline}
          subheadline={data.hero?.subheadline || undefined}
          ctaPrimaryText={data.hero?.cta_primary_text || undefined}
          ctaSecondaryText={data.hero?.cta_secondary_text || undefined}
          socialProofText={data.hero?.social_proof_text || undefined}
        />
        <DemoVideo />
        <AICallFlow />
        <Benefits />
        <CaseStudies studies={data.caseStudies} />
        <Services services={data.services} />
        <Testimonials testimonials={data.testimonials} />
        <FAQ faqs={data.faqs} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
