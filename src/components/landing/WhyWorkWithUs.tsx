'use client';

import { MessageSquare, Settings, Zap, ShieldCheck, RefreshCw, HeartHandshake } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import styles from './WhyWorkWithUs.module.css';

const trustPillars = [
  {
    icon: <MessageSquare size={24} />,
    title: 'Direct Communication',
    description: 'You work directly with the experts building your system. No middlemen, no confusing layers of account management.',
  },
  {
    icon: <Settings size={24} />,
    title: 'Custom Solutions',
    description: 'We do not sell cookie-cutter templates. Every AI agent and automation is tailored to your specific workflows.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Practical Automation',
    description: 'We focus on building tools that actually save you time and solve real problems, not just chasing the latest AI trends.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Transparent Process',
    description: 'Clear pricing, honest timelines, and realistic expectations. We tell you what AI can do, and what it cannot do.',
  },
  {
    icon: <RefreshCw size={24} />,
    title: 'Fast Iteration',
    description: 'We build quickly, test rigorously, and refine based on real-world usage and feedback to ensure high performance.',
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Human Support',
    description: 'Technology is great, but we believe in supporting our clients personally. We are here when you need us.',
  },
];

export default function WhyWorkWithUs() {
  return (
    <section className={`section ${styles.whyUs}`} id="why-us">
      <div className="container">
        <SectionHeader
          badge="Trust & Credibility"
          title="Why Work With Electron"
          subtitle="We prioritize honesty, transparency, and building systems that actually work."
        />

        <div className={styles.grid}>
          {trustPillars.map((pillar, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {pillar.icon}
              </div>
              <h3 className={styles.title}>{pillar.title}</h3>
              <p className={styles.description}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
