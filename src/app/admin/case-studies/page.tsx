'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../layout';
import type { CaseStudy } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function CaseStudiesAdmin() {
  const [data, setData] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudy | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    client_name: '',
    industry: '',
    headline: '',
    description: '',
    key_metric: '',
    key_metric_value: '',
    is_featured: false,
    is_active: true,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: caseStudies, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(caseStudies || []);
    }
    setLoading(false);
  };

  const openModal = (item?: CaseStudy) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        client_name: item.client_name,
        industry: item.industry || '',
        headline: item.headline,
        description: item.description || '',
        key_metric: item.key_metric || '',
        key_metric_value: item.key_metric_value || '',
        is_featured: item.is_featured || false,
        is_active: item.is_active || true,
      });
    } else {
      setEditingItem(null);
      setFormData({
        client_name: '',
        industry: '',
        headline: '',
        description: '',
        key_metric: '',
        key_metric_value: '',
        is_featured: false,
        is_active: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('case_studies')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        showToast('Case study updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([formData]);
        if (error) throw error;
        showToast('Case study created successfully', 'success');
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('case_studies').delete().eq('id', id);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Case study deleted successfully', 'success');
      fetchData();
    }
    setLoading(false);
  };

  if (loading && data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Case Studies</h1>
          <p className={styles.sub}>Manage client success stories</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={16} />
          Add Case Study
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Client</th>
              <th className={styles.th}>Headline</th>
              <th className={styles.th}>Key Metric</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>
                  <strong>{item.client_name}</strong>
                  <br />
                  <span style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>
                    {item.industry}
                  </span>
                </td>
                <td className={styles.td}>
                  <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.headline}
                  </div>
                </td>
                <td className={styles.td}>
                  <strong>{item.key_metric_value}</strong> {item.key_metric}
                </td>
                <td className={styles.td}>
                  <span className={`${styles.status} ${item.is_active ? styles.statusActive : styles.statusInactive}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {item.is_featured && (
                    <span className={`${styles.status} ${styles.statusActive}`} style={{ marginLeft: '4px' }}>
                      Featured
                    </span>
                  )}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => openModal(item)}>
                      <Pencil size={16} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.td} style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
                  No case studies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingItem ? 'Edit Case Study' : 'Add Case Study'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Client Name *</label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label className={styles.label}>Industry</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Headline *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  />
                </div>
                
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Key Metric (e.g. ROI)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.key_metric}
                      onChange={(e) => setFormData({ ...formData, key_metric: e.target.value })}
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label className={styles.label}>Key Metric Value (e.g. 300%)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.key_metric_value}
                      onChange={(e) => setFormData({ ...formData, key_metric_value: e.target.value })}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    Active
                  </label>
                  
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    Featured
                  </label>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.addBtn} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
