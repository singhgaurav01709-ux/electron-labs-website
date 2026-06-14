'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, Bot, ClipboardCheck, CalendarCheck } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import styles from './AICallFlow.module.css';

const steps = [
  {
    icon: Phone,
    title: 'Customer Calls',
    description: 'A prospect calls your business number — at any hour of day or night.',
    color: '#8b5cf6',
  },
  {
    icon: Bot,
    title: 'AI Agent Answers',
    description: 'Your AI voice agent picks up instantly, sounding natural and professional.',
    color: '#a78bfa',
  },
  {
    icon: ClipboardCheck,
    title: 'Lead Qualification',
    description: 'The AI asks qualifying questions, handles FAQs, and captures key details.',
    color: '#06b6d4',
  },
  {
    icon: CalendarCheck,
    title: 'Appointment Booked',
    description: 'Qualified leads are booked directly into your calendar. No missed opportunities.',
    color: '#10b981',
  },
];

export default function AICallFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps sequentially
            steps.forEach((_, i) => {
              setTimeout(() => setActiveStep(i), i * 400);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.callFlow}`} id="how-it-works" ref={sectionRef}>
      <div className="container">
        <SectionHeader
          badge="How It Works"
          title="From Call to Calendar in Seconds"
          subtitle="See how AI handles your calls from start to finish — automatically."
        />

        <div className={styles.flowContainer}>
          <div className={styles.timeline}>
            <div
              className={styles.timelineFill}
              style={{ height: `${Math.max(0, (activeStep / (steps.length - 1)) * 100)}%` }}
            />
          </div>

          <div className={styles.steps}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              return (
                <div
                  key={index}
                  className={`${styles.step} ${isActive ? styles.active : ''}`}
                >
                  <div
                    className={styles.stepIcon}
                    style={{
                      borderColor: isActive ? step.color : undefined,
                      boxShadow: isActive ? `0 0 24px ${step.color}33` : undefined,
                    }}
                  >
                    <Icon size={24} style={{ color: isActive ? step.color : undefined }} />
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                  <div className={styles.stepNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
