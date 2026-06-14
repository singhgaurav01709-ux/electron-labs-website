'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../layout';
import type { HomepageStat } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function StatsAdmin() {
  const [data, setData] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomepageStat | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: '',
    display_order: 0,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: stats, error } = await supabase
      .from('homepage_stats')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(stats || []);
    }
    setLoading(false);
  };

  const openModal = (item?: HomepageStat) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        value: item.value,
        icon: item.icon || '',
        display_order: item.display_order || 0,
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        value: '',
        icon: '',
        display_order: data.length,
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
          .from('homepage_stats')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        showToast('Stat updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('homepage_stats')
          .insert([formData]);
        if (error) throw error;
        showToast('Stat created successfully', 'success');
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('homepage_stats').delete().eq('id', id);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Stat deleted successfully', 'success');
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
          <h1 className={styles.title}>Homepage Stats</h1>
          <p className={styles.sub}>Manage the statistics shown on the landing page</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={16} />
          Add Stat
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Order</th>
              <th className={styles.th}>Label</th>
              <th className={styles.th}>Value</th>
              <th className={styles.th}>Icon</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>{item.display_order}</td>
                <td className={styles.td}>
                  <strong>{item.label}</strong>
                </td>
                <td className={styles.td}>{item.value}</td>
                <td className={styles.td}>{item.icon || '-'}</td>
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
                  No stats found.
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
                {editingItem ? 'Edit Stat' : 'Add Stat'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Label *</label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="e.g. Clients"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Value *</label>
                    <input
                      type="text"
                      required
                      className={styles.input}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="e.g. 200+"
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Icon Name (Lucide)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    />
                  </div>
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
