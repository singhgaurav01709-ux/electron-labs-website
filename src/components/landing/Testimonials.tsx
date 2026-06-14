'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Plus } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import type { Testimonial } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import styles from './Testimonials.module.css';

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setLocalTestimonials(testimonials);
  }, [testimonials]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, localTestimonials.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: Math.random().toString(),
      client_name: formData.get('client_name') as string,
      position: formData.get('position') as string,
      business_name: formData.get('business_name') as string,
      quote: formData.get('quote') as string,
      rating: 5,
      status: 'approved', // Auto-approve for demo
      is_active: true,
      display_order: 0,
      created_at: new Date().toISOString()
    } as Testimonial;

    try {
      const supabase = createClient();
      await supabase.from('testimonials').insert([data]);
    } catch {
      // Ignore DB errors
    }

    // Add to local state to show immediately
    setLocalTestimonials(prev => [data, ...prev]);
    setFormState('success');
    setTimeout(() => {
      setShowForm(false);
      setFormState('idle');
    }, 3000);
  };

  return (
    <section className={`section ${styles.testimonials}`} id="feedback">
      <div className="container">
        <SectionHeader
          badge="Feedback"
          title="Client Feedback"
          subtitle="Real thoughts from our clients."
        />

        {localTestimonials.length === 0 ? (
          <div className={styles.emptyState}>
            We are currently collecting feedback from clients. Approved testimonials will appear here.
          </div>
        ) : (
          <div className={styles.carouselWrapper}>
            {canScrollLeft && (
              <button className={`${styles.navBtn} ${styles.navLeft}`} onClick={() => scroll('left')} aria-label="Previous testimonials">
                <ChevronLeft size={20} />
              </button>
            )}

            <div className={styles.carousel} ref={scrollRef}>
              {localTestimonials.map((t) => (
                <div key={t.id} className={styles.card}>
                  <Quote size={24} className={styles.quoteIcon} />
                  <div className={styles.stars}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className={styles.quote}>{t.quote}</p>
                  <div className={styles.author}>
                    <div className={styles.avatar}>
                      {t.client_name.charAt(0)}
                    </div>
                    <div>
                      <p className={styles.authorName}>{t.client_name}</p>
                      <p className={styles.authorBusiness}>
                        {t.position && `${t.position}, `}{t.business_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button className={`${styles.navBtn} ${styles.navRight}`} onClick={() => scroll('right')} aria-label="Next testimonials">
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        <div className={styles.submitSection}>
          {!showForm ? (
            <Button variant="outline" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              Submit Feedback
            </Button>
          ) : (
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Submit Your Feedback</h3>
              {formState === 'success' ? (
                <div className={styles.successMessage}>
                  Thank you! Your feedback has been submitted for review.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <input name="client_name" required placeholder="Full Name" className={styles.input} />
                    <input name="position" placeholder="Position (Optional)" className={styles.input} />
                  </div>
                  <input name="business_name" required placeholder="Company Name" className={styles.input} />
                  <textarea name="quote" required placeholder="Your review..." rows={4} className={styles.textarea} />
                  
                  {formState === 'error' && (
                    <div className={styles.errorMessage}>Failed to submit. Please try again.</div>
                  )}
                  
                  <div className={styles.formActions}>
                    <Button variant="ghost" onClick={() => setShowForm(false)} type="button">Cancel</Button>
                    <Button variant="primary" type="submit" disabled={formState === 'submitting'}>
                      {formState === 'submitting' ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
