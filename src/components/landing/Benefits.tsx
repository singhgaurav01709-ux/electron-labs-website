'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Phone,
  CalendarCheck,
  CalendarX2,
  HelpCircle,
  UserPlus,
  PhoneForwarded,
  MessageSquare,
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import styles from './Benefits.module.css';

const capabilities = [
  {
    icon: Phone,
    title: 'Answer Incoming Calls',
    description: 'Your AI assistant picks up every call instantly — 24/7, no hold time.',
  },
  {
    icon: CalendarCheck,
    title: 'Book Appointments',
    description: 'Automatically schedules appointments directly into your calendar.',
  },
  {
    icon: CalendarX2,
    title: 'Reschedule & Cancel',
    description: 'Handles rescheduling and cancellation requests without human involvement.',
  },
  {
    icon: HelpCircle,
    title: 'Answer FAQs',
    description: 'Responds to common questions about your services, pricing, and availability.',
  },
  {
    icon: UserPlus,
    title: 'Collect Lead Details',
    description: 'Captures caller name, contact info, and requirements automatically.',
  },
  {
    icon: PhoneForwarded,
    title: 'Transfer Urgent Calls',
    description: 'Routes urgent or complex calls directly to your human staff when needed.',
  },
  {
    icon: MessageSquare,
    title: 'Send SMS / WhatsApp Confirmation',
    description: 'Sends booking confirmations and follow-ups via SMS or WhatsApp.',
  },
];

export default function Benefits() {
  const gridRef = useRef<HTMLDivElement>(null);
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

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.benefits}`} id="benefits">
      <div className="container">
        <SectionHeader
          badge="AI Capabilities"
          title="What Can Your AI Assistant Do?"
          subtitle="Basic Package"
        />

        <div
          className={`${styles.grid} ${visible ? styles.visible : ''}`}
          ref={gridRef}
        >
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={styles.card}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={24} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
