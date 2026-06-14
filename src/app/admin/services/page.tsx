'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../layout';
import type { Service } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function ServicesAdmin() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'workflow',
    features: [] as string[],
    is_featured: false,
    display_order: 0,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(services || []);
    }
    setLoading(false);
  };

  const openModal = (item?: Service) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        icon: item.icon || 'workflow',
        features: item.features || [],
        is_featured: item.is_featured || false,
        display_order: item.display_order || 0,
      });
      setFeaturesInput(item.features ? item.features.join('\n') : '');
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        icon: 'workflow',
        features: [],
        is_featured: false,
        display_order: data.length,
      });
      setFeaturesInput('');
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

    // Convert features input (newline separated) to array
    const featuresArray = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const submissionData = { ...formData, features: featuresArray };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('services')
          .update(submissionData)
          .eq('id', editingItem.id);
        if (error) throw error;
        showToast('Service updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([submissionData]);
        if (error) throw error;
        showToast('Service created successfully', 'success');
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('services').delete().eq('id', id);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Service deleted successfully', 'success');
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
          <h1 className={styles.title}>Services</h1>
          <p className={styles.sub}>Manage core offerings and features</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Order</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Icon</th>
              <th className={styles.th}>Features</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>{item.display_order}</td>
                <td className={styles.td}>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description}
                  </div>
                </td>
                <td className={styles.td}>{item.icon}</td>
                <td className={styles.td}>
                  {item.features?.length || 0} features
                </td>
                <td className={styles.td}>
                  {item.is_featured ? (
                    <span className={`${styles.status} ${styles.statusActive}`}>Featured</span>
                  ) : (
                    <span className={`${styles.status} ${styles.statusInactive}`}>Standard</span>
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
                <td colSpan={6} className={styles.td} style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
                  No services found.
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
                {editingItem ? 'Edit Service' : 'Add Service'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Title *</label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Icon Name (Lucide)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g. phone, globe"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className={styles.field}>
                  <label className={styles.label}>Features (One per line)</label>
                  <textarea
                    className={styles.textarea}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    rows={5}
                    placeholder="24/7 call answering&#10;Lead qualification&#10;CRM integration"
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Display Order</label>
                    <input
                      type="number"
                      required
                      className={styles.input}
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  Featured (Highlight this service)
                </label>
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
