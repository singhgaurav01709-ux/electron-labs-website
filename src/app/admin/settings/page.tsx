'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '../layout';
import type { CompanySettings, WebsiteSettings } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function SettingsAdmin() {
  const [companyData, setCompanyData] = useState<CompanySettings | null>(null);
  const [websiteData, setWebsiteData] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [
      { data: cData, error: cError },
      { data: wData, error: wError }
    ] = await Promise.all([
      supabase.from('company_settings').select('*').limit(1).single(),
      supabase.from('website_settings').select('*').limit(1).single()
    ]);

    if (cError && cError.code !== 'PGRST116') showToast(cError.message, 'error');
    if (wError && wError.code !== 'PGRST116') showToast(wError.message, 'error');

    setCompanyData(cData || null);
    setWebsiteData(wData || null);
    setLoading(false);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData) return;
    setLoading(true);

    const { error } = await supabase
      .from('company_settings')
      .update(companyData)
      .eq('id', companyData.id);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Company settings updated successfully', 'success');
    }
    setLoading(false);
  };

  const handleWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteData) return;
    setLoading(true);

    const { error } = await supabase
      .from('website_settings')
      .update(websiteData)
      .eq('id', websiteData.id);

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Website settings updated successfully', 'success');
    }
    setLoading(false);
  };

  if (loading && (!companyData || !websiteData)) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.sub}>Manage company information and website settings</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Company Settings */}
        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Company Information</h2>
          {companyData && (
            <form onSubmit={handleCompanySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.field}>
                <label className={styles.label}>Company Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={companyData.company_name}
                  onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Logo URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={companyData.logo_url}
                  onChange={(e) => setCompanyData({ ...companyData, logo_url: e.target.value })}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Defaults to /logo.png</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contact Email *</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  value={companyData.contact_email}
                  onChange={(e) => setCompanyData({ ...companyData, contact_email: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contact Phone</label>
                <input
                  type="text"
                  className={styles.input}
                  value={companyData.contact_phone || ''}
                  onChange={(e) => setCompanyData({ ...companyData, contact_phone: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Address / Location</label>
                <input
                  type="text"
                  className={styles.input}
                  value={companyData.contact_address || ''}
                  onChange={(e) => setCompanyData({ ...companyData, contact_address: e.target.value })}
                />
              </div>
              <button type="submit" className={styles.addBtn} disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                {loading ? 'Saving...' : 'Save Company Info'}
              </button>
            </form>
          )}
        </div>

        {/* Website Settings */}
        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Website SEO & Settings</h2>
          {websiteData && (
            <form onSubmit={handleWebsiteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.field}>
                <label className={styles.label}>SEO Title *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={websiteData.seo_title}
                  onChange={(e) => setWebsiteData({ ...websiteData, seo_title: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>SEO Description *</label>
                <textarea
                  required
                  className={styles.textarea}
                  value={websiteData.seo_description}
                  onChange={(e) => setWebsiteData({ ...websiteData, seo_description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Favicon URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={websiteData.favicon_url}
                  onChange={(e) => setWebsiteData({ ...websiteData, favicon_url: e.target.value })}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Defaults to /favicon.ico</span>
              </div>
              <button type="submit" className={styles.addBtn} disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                {loading ? 'Saving...' : 'Save Website Settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
