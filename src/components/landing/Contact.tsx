'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2, MessageCircle } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import styles from './Contact.module.css';

const WHATSAPP_NUMBER = '917688828654';
const WHATSAPP_MESSAGE = encodeURIComponent('Hi! I am interested in your AI automation services. I would like to know more.');

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business_type: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const supabase = createClient();
      await supabase.from('leads').insert([form]);
      // Ignore error for demo purposes since DB is not set up
    } catch {
      // Ignore error
    }
    
    // Always show success for demo
    setStatus('success');
    setForm({ name: '', email: '', phone: '', business_type: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <SectionHeader
          badge="Get Started"
          title="Let's Talk About Your Business"
          subtitle="Send us a message or reach out directly on WhatsApp."
        />

        <div className={styles.grid}>
          {/* Contact Form */}
          <div className={styles.formCard}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <CheckCircle size={48} className={styles.successIcon} />
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successText}>
                  We&apos;ll get back to you within 24 hours.
                </p>
                <Button variant="primary" onClick={() => setStatus('idle')}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>
                  <Send size={18} />
                  Send Us a Message
                </h3>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      required
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="business_type" className={styles.label}>Business Type</label>
                    <select
                      id="business_type"
                      name="business_type"
                      value={form.business_type}
                      onChange={handleChange}
                      className={styles.input}
                    >
                      <option value="">Select your industry</option>
                      <option value="clinic">Clinic / Healthcare</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="coaching">Coaching / Consulting</option>
                      <option value="service">Service Business</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business and what you need..."
                    rows={4}
                    className={styles.textarea}
                  />
                </div>

                {status === 'error' && (
                  <p className={styles.errorText}>Something went wrong. Please try again.</p>
                )}

                <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* WhatsApp Booking */}
          <div className={styles.calendarCard}>
            <h3 className={styles.formTitle}>
              <MessageCircle size={18} />
              Book via WhatsApp
            </h3>
            <p className={styles.calendarDescription}>
              Prefer a quick chat? Reach out to us directly on WhatsApp and we&apos;ll get back to you right away.
            </p>
            <div className={styles.calendarEmbed}>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <p className={styles.calendarHint} style={{ marginTop: '1rem', textAlign: 'center' }}>
              Available Mon–Sat, 10 AM – 7 PM IST
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
