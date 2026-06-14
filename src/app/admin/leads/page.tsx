'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '../layout';
import type { Lead } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function LeadsAdmin() {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(leads || []);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading && data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leads</h1>
          <p className={styles.sub}>View contact form submissions (read-only)</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Contact Info</th>
              <th className={styles.th}>Business Type</th>
              <th className={styles.th}>Message</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td} style={{ whiteSpace: 'nowrap' }}>
                  {formatDate(item.created_at)}
                </td>
                <td className={styles.td}>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '0.85em', color: 'var(--color-text-dim)', marginTop: '4px' }}>
                    <a href={`mailto:${item.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.email}</a>
                  </div>
                  {item.phone && (
                    <div style={{ fontSize: '0.85em', color: 'var(--color-text-dim)' }}>
                      {item.phone}
                    </div>
                  )}
                </td>
                <td className={styles.td}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {item.business_type ? item.business_type.replace('-', ' ') : 'Not specified'}
                  </span>
                </td>
                <td className={styles.td}>
                  <div style={{ maxWidth: '400px', whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
                    {item.message || <span style={{ color: 'var(--color-text-dim)' }}>No message</span>}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.td} style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
