'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  MessageSquareQuote,
  Briefcase,
  FolderOpen,
  Video,
  HelpCircle,
  Settings,
  BarChart3,
} from 'lucide-react';
import styles from './Dashboard.module.css';

interface Metrics {
  leads: number;
  testimonials: number;
  caseStudies: number;
  portfolio: number;
  videos: number;
  faq: number;
  services: number;
  stats: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    const supabase = createClient();
    const tables = [
      { key: 'leads', table: 'leads' },
      { key: 'testimonials', table: 'testimonials' },
      { key: 'caseStudies', table: 'case_studies' },
      { key: 'portfolio', table: 'portfolio_projects' },
      { key: 'videos', table: 'demo_videos' },
      { key: 'faq', table: 'faq_items' },
      { key: 'services', table: 'services' },
      { key: 'stats', table: 'homepage_stats' },
    ] as const;

    const results: Record<string, number> = {};
    await Promise.all(
      tables.map(async ({ key, table }) => {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        results[key] = count ?? 0;
      })
    );

    setMetrics(results as unknown as Metrics);
    setLoading(false);
  };

  const metricCards = [
    { key: 'leads', label: 'Total Leads', icon: Users },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { key: 'caseStudies', label: 'Case Studies', icon: Briefcase },
    { key: 'portfolio', label: 'Portfolio Projects', icon: FolderOpen },
    { key: 'videos', label: 'Demo Videos', icon: Video },
    { key: 'faq', label: 'FAQ Items', icon: HelpCircle },
    { key: 'services', label: 'Services', icon: Settings },
    { key: 'stats', label: 'Homepage Stats', icon: BarChart3 },
  ];

  if (loading) {
    return <div className={styles.loadingContainer}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.dashboardSub}>Overview of your website content</p>
      </div>

      <div className={styles.metricsGrid}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Icon size={20} />
              </div>
              <div className={styles.metricValue}>
                {metrics ? metrics[card.key as keyof Metrics] : 0}
              </div>
              <div className={styles.metricLabel}>{card.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
