'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, Megaphone, Globe, Workflow, Check, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import type { Service } from '@/types/database';
import styles from './Services.module.css';

const iconMap: Record<string, React.ElementType> = {
  phone: Phone,
  megaphone: Megaphone,
  globe: Globe,
  workflow: Workflow,
};

const fallbackServices: Service[] = [
  {
    id: '1',
    title: 'AI Voice Agents',
    description: 'Intelligent voice agents that answer calls, qualify leads, handle FAQs, and book appointments 24/7. Never miss a lead again.',
    icon: 'phone',
    features: ['24/7 call answering', 'Lead qualification', 'Appointment booking', 'FAQ handling', 'CRM integration', 'Custom voice & script'],
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'AI Ad Creatives',
    description: 'AI-generated ad creatives that convert. We create high-performing ad copy, images, and video scripts optimized for your audience.',
    icon: 'megaphone',
    features: ['Ad copy generation', 'Creative testing', 'Audience targeting', 'Performance optimization'],
    is_featured: false,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Business Websites',
    description: 'Premium, conversion-optimized websites designed to turn visitors into customers. Fast, modern, and built to perform.',
    icon: 'globe',
    features: ['Custom design', 'SEO optimization', 'Mobile-first', 'Fast loading'],
    is_featured: false,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Automation Systems',
    description: 'End-to-end business automation that eliminates manual work. CRM integrations, email sequences, and workflow automation.',
    icon: 'workflow',
    features: ['CRM automation', 'Email sequences', 'Workflow design', 'Tool integration'],
    is_featured: false,
    display_order: 4,
    created_at: new Date().toISOString(),
  },
];

interface ServicesProps {
  services?: Service[];
}

export default function Services({ services }: ServicesProps) {
  const data = services && services.length > 0 ? services : fallbackServices;
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.services}`} id="services" ref={ref}>
      <div className="container">
        <SectionHeader
          badge="Services"
          title="Everything You Need to Grow"
          subtitle="From AI voice agents to full automation — we handle the tech so you can focus on your business."
        />

        <div className={`${styles.grid} ${visible ? styles.visible : ''}`}>
          {data.sort((a, b) => a.display_order - b.display_order).map((service, index) => {
            const Icon = iconMap[service.icon || 'workflow'] || Workflow;
            return (
              <div
                key={service.id}
                className={`${styles.card} ${service.is_featured ? styles.featured : ''}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {service.is_featured && (
                  <span className={styles.popularBadge}>Most Popular</span>
                )}

                <div className={styles.cardHeader}>
                  <div className={`${styles.iconWrapper} ${service.is_featured ? styles.iconFeatured : ''}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                </div>

                <p className={styles.cardDescription}>{service.description}</p>

                <ul className={styles.features}>
                  {(service.features || []).map((feature, i) => (
                    <li key={i} className={styles.feature}>
                      <Check size={14} className={styles.checkIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={service.is_featured ? 'primary' : 'ghost'}
                  size="md"
                  href="#contact"
                  className={styles.cardCta}
                >
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
