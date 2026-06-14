'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../layout';
import type { PortfolioProject } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function PortfolioAdmin() {
  const [data, setData] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioProject | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    project_url: '',
    is_active: true,
    display_order: 0,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: portfolio, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(portfolio || []);
    }
    setLoading(false);
  };

  const openModal = (item?: PortfolioProject) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        category: item.category || '',
        project_url: item.project_url || '',
        is_active: item.is_active || true,
        display_order: item.display_order || 0,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        project_url: '',
        is_active: true,
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
          .from('portfolio_projects')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        showToast('Project updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .insert([formData]);
        if (error) throw error;
        showToast('Project created successfully', 'success');
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Project deleted successfully', 'success');
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
          <h1 className={styles.title}>Portfolio Projects</h1>
          <p className={styles.sub}>Manage past work and portfolio items</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Order</th>
              <th className={styles.th}>Title & Category</th>
              <th className={styles.th}>Link</th>
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
                  <br />
                  <span style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>
                    {item.category}
                  </span>
                </td>
                <td className={styles.td}>
                  {item.project_url ? (
                    <a href={item.project_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-light)' }}>
                      Link
                    </a>
                  ) : '-'}
                </td>
                <td className={styles.td}>
                  <span className={`${styles.status} ${item.is_active ? styles.statusActive : styles.statusInactive}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
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
                  No projects found.
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
                {editingItem ? 'Edit Project' : 'Add Project'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label className={styles.label}>Project Title *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Category</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Project URL</label>
                  <input
                    type="url"
                    className={styles.input}
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  />
                </div>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Active
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
