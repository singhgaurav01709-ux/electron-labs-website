'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '../layout';
import type { HeroContent } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function HeroAdmin() {
  const [data, setData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    cta_primary_text: '',
    cta_primary_link: '',
    cta_secondary_text: '',
    cta_secondary_link: '',
    social_proof_text: '',
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: heroData, error } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
      showToast(error.message, 'error');
    } else if (heroData) {
      setData(heroData);
      setFormData({
        headline: heroData.headline,
        subheadline: heroData.subheadline || '',
        cta_primary_text: heroData.cta_primary_text || '',
        cta_primary_link: heroData.cta_primary_link || '',
        cta_secondary_text: heroData.cta_secondary_text || '',
        cta_secondary_link: heroData.cta_secondary_link || '',
        social_proof_text: heroData.social_proof_text || '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('hero_content')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', data.id);
        if (error) throw error;
        showToast('Hero content updated successfully', 'success');
      } else {
        // Insert new record
        const { error } = await supabase
          .from('hero_content')
          .insert([formData]);
        if (error) throw error;
        showToast('Hero content created successfully', 'success');
        fetchData(); // Refresh to get the new ID
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hero Content</h1>
          <p className={styles.sub}>Manage the main headline and calls-to-action on the landing page</p>
        </div>
      </div>

      <div className={styles.tableContainer} style={{ padding: '2rem', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.field}>
            <label className={styles.label}>Headline *</label>
            <textarea
              required
              className={styles.textarea}
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              rows={2}
              style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Subheadline</label>
            <textarea
              className={styles.textarea}
              value={formData.subheadline}
              onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Primary CTA Text</label>
              <input
                type="text"
                className={styles.input}
                value={formData.cta_primary_text}
                onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Primary CTA Link</label>
              <input
                type="text"
                className={styles.input}
                value={formData.cta_primary_link}
                onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Secondary CTA Text</label>
              <input
                type="text"
                className={styles.input}
                value={formData.cta_secondary_text}
                onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Secondary CTA Link</label>
              <input
                type="text"
                className={styles.input}
                value={formData.cta_secondary_link}
                onChange={(e) => setFormData({ ...formData, cta_secondary_link: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Social Proof Text</label>
            <input
              type="text"
              className={styles.input}
              value={formData.social_proof_text}
              onChange={(e) => setFormData({ ...formData, social_proof_text: e.target.value })}
              placeholder="e.g. Trusted by 200+ businesses across India"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className={styles.addBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
