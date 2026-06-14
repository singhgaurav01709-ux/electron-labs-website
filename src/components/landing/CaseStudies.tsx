'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import type { CaseStudy } from '@/types/database';
import styles from './CaseStudies.module.css';

interface CaseStudiesProps {
  studies?: CaseStudy[];
}

export default function CaseStudies({ studies = [] }: CaseStudiesProps) {
  const data = studies;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.caseStudies}`} id="case-studies" ref={ref}>
      <div className="container">
        <SectionHeader
          badge="Results"
          title="Case Studies"
          subtitle="Client success stories and project results will appear here as projects are completed."
        />

        {data.length === 0 ? (
          <div className={styles.emptyState}>
            Client success stories and project results will appear here as projects are completed.
          </div>
        ) : (
          <div className={`${styles.grid} ${visible ? styles.visible : ''}`}>
            {data.map((study, index) => (
              <div
                key={study.id}
                className={`${styles.card} ${study.is_featured ? styles.featured : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <span className={styles.industry}>{study.industry}</span>
                <div className={styles.metric}>
                  <TrendingUp size={20} className={styles.metricIcon} />
                  <span className={styles.metricValue}>{study.key_metric_value}</span>
                </div>
                <h3 className={styles.cardTitle}>{study.headline}</h3>
                <p className={styles.cardDescription}>{study.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.clientName}>{study.client_name}</span>
                  <ArrowRight size={16} className={styles.arrow} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
