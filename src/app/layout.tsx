import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import GlobalAurora from '@/components/ui/GlobalAurora';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'Electron Labs | Custom AI Systems';
  let description = 'Practical AI automation solutions tailored to your workflow.';
  
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase.from('website_settings').select('*').limit(1).single();
    if (settings) {
      title = settings.seo_title || title;
      description = settings.seo_description || description;
    }
  } catch (e) {
    // Ignore if not configured
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      siteName: 'Electron Labs',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let companyName = 'Electron Labs';
  let contactEmail = 'hello@electronlabs.in';
  
  try {
    const supabase = await createClient();
    const { data: company } = await supabase.from('company_settings').select('*').limit(1).single();
    if (company) {
      companyName = company.company_name;
      contactEmail = company.contact_email;
    }
  } catch (e) {
    // Ignore if not configured
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: companyName,
              description: 'Practical AI automation solutions tailored to your workflow.',
              url: 'https://electron.com',
              contactPoint: {
                '@type': 'ContactPoint',
                email: contactEmail,
                contactType: 'sales',
              },
            }),
          }}
        />
      </head>
      <body>
        <GlobalAurora />
        {children}
      </body>
    </html>
  );
}
