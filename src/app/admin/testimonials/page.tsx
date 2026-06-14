'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X, Check, Ban } from 'lucide-react';
import { useToast } from '../layout';
import type { Testimonial } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function TestimonialsAdmin() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    client_name: '',
    business_name: '',
    position: '',
    quote: '',
    rating: 5,
    is_active: true,
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    display_order: 0,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(testimonials || []);
    }
    setLoading(false);
  };

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        client_name: item.client_name,
        business_name: item.business_name || '',
        position: item.position || '',
        quote: item.quote,
        rating: item.rating || 5,
        is_active: item.is_active || false,
        status: item.status || 'pending',
        display_order: item.display_order || 0,
      });
    } else {
      setEditingItem(null);
      setFormData({
        client_name: '',
        business_name: '',
        position: '',
        quote: '',
        rating: 5,
        is_active: true,
        status: 'approved',
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
          .from('testimonials')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        showToast('Testimonial updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);
        if (error) throw error;
        showToast('Testimonial created successfully', 'success');
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Testimonial deleted successfully', 'success');
      fetchData();
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setLoading(true);
    const { error } = await supabase
      .from('testimonials')
      .update({ status: newStatus, is_active: newStatus === 'approved' })
      .eq('id', id);
      
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast(`Testimonial ${newStatus}`, 'success');
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
          <h1 className={styles.title}>Testimonials (Feedback)</h1>
          <p className={styles.sub}>Manage client feedback submissions and public testimonials</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Client</th>
              <th className={styles.th}>Quote</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Visibility</th>
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
                    {item.position && `${item.position}, `}{item.business_name}
                  </span>
                </td>
                <td className={styles.td}>
                  <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.quote}
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.status} ${item.status === 'approved' ? styles.statusActive : item.status === 'rejected' ? styles.statusInactive : ''}`} style={item.status === 'pending' ? { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' } : {}}>
                    {item.status ? item.status.toUpperCase() : 'UNKNOWN'}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.status} ${item.is_active ? styles.statusActive : styles.statusInactive}`}>
                    {item.is_active ? 'Public' : 'Hidden'}
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    {item.status === 'pending' && (
                      <>
                        <button className={`${styles.iconBtn}`} style={{ color: '#4ade80' }} onClick={() => updateStatus(item.id, 'approved')} title="Approve">
                          <Check size={16} />
                        </button>
                        <button className={`${styles.iconBtn}`} style={{ color: '#ef4444' }} onClick={() => updateStatus(item.id, 'rejected')} title="Reject">
                          <Ban size={16} />
                        </button>
                      </>
                    )}
                    <button className={styles.iconBtn} onClick={() => openModal(item)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(item.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.td} style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
                  No testimonials found.
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
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
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
                    <label className={styles.label}>Position</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Business Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>
                
                <div className={styles.field}>
                  <label className={styles.label}>Quote *</label>
                  <textarea
                    required
                    className={styles.textarea}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      className={styles.input}
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
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
                  <label className={styles.label}>Status</label>
                  <select
                    className={styles.input}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Active (show on website)
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
