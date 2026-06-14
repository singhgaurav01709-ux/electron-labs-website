'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import type { FaqItem } from '@/types/database';
import styles from './FAQ.module.css';

const fallbackFaqs: FaqItem[] = [
  {
    id: '1',
    question: 'How does the AI Voice Agent work?',
    answer: 'The AI voice agent answers calls using customized instructions, workflows, and business information. Capabilities depend on configuration and project requirements.',
    category: 'General',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'How long does setup take?',
    answer: 'Setup time varies depending on complexity, integrations, and business requirements. Simpler projects may be completed faster than more customized implementations.',
    category: 'General',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'Can the AI handle complex questions?',
    answer: 'The AI can handle many common and repetitive inquiries when properly configured. Some situations may still require human assistance.',
    category: 'General',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'What happens if the AI cannot answer a question?',
    answer: 'The system can be configured to collect information, transfer calls, create follow-up tasks, or escalate to a human team member.',
    category: 'General',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    question: 'How much does it cost?',
    answer: 'Pricing depends on project scope, integrations, call volume, customization requirements, and ongoing support needs.',
    category: 'Pricing',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    question: 'Do you offer demos?',
    answer: 'Demonstrations may be available depending on project requirements and current availability.',
    category: 'Pricing',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

interface FAQProps {
  faqs?: FaqItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  const data = faqs && faqs.length > 0 ? faqs : fallbackFaqs;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={`section ${styles.faq}`} id="faq">
      <div className="container">
        <SectionHeader
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers."
        />

        <div className={styles.accordion}>
          {data.sort((a, b) => a.display_order - b.display_order).map((item) => (
            <div
              key={item.id}
              className={`${styles.item} ${openId === item.id ? styles.open : ''}`}
            >
              <button
                className={styles.trigger}
                onClick={() => toggle(item.id)}
                aria-expanded={openId === item.id}
              >
                <span className={styles.question}>{item.question}</span>
                <ChevronDown size={18} className={styles.chevron} />
              </button>
              <div className={styles.content}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
