'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../layout';
import type { DemoVideo } from '@/types/database';
import styles from '../AdminPage.module.css';

export default function VideosAdmin() {
  const [data, setData] = useState<DemoVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DemoVideo | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    video_url: '',
    is_primary: false,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: videos, error } = await supabase
      .from('demo_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setData(videos || []);
    }
    setLoading(false);
  };

  const openModal = (item?: DemoVideo) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        video_url: item.video_url,
        is_primary: item.is_primary || false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        video_url: '',
        is_primary: data.length === 0, // Make primary if it's the first video
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
      // If this video is marked as primary, unmark others first
      if (formData.is_primary) {
        await supabase.from('demo_videos').update({ is_primary: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      }

      if (editingItem) {
        const { error } = await supabase
          .from('demo_videos')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        showToast('Video updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('demo_videos')
          .insert([formData]);
        if (error) throw error;
        showToast('Video created successfully', 'success');
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('demo_videos').delete().eq('id', id);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Video deleted successfully', 'success');
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
          <h1 className={styles.title}>Demo Videos</h1>
          <p className={styles.sub}>Manage videos shown on the landing page</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={16} />
          Add Video
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Video URL</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>
                  <strong>{item.title || 'Untitled'}</strong>
                </td>
                <td className={styles.td}>
                  <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={item.video_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-light)' }}>
                      {item.video_url}
                    </a>
                  </div>
                </td>
                <td className={styles.td}>
                  {item.is_primary ? (
                    <span className={`${styles.status} ${styles.statusActive}`}>Primary Video</span>
                  ) : (
                    <span className={`${styles.status} ${styles.statusInactive}`}>Alternative</span>
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
                <td colSpan={4} className={styles.td} style={{ textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
                  No videos found.
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
                {editingItem ? 'Edit Video' : 'Add Video'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className={styles.field}>
                  <label className={styles.label}>Video URL (YouTube/Vimeo embed URL or MP4) *</label>
                  <input
                    type="url"
                    required
                    className={styles.input}
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.is_primary}
                    onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                  />
                  Set as Primary Video (shows in the hero/main demo section)
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
