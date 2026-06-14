'use client';

import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  MessageSquareQuote,
  Briefcase,
  FolderOpen,
  Video,
  HelpCircle,
  Settings,
  Star,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import styles from './AdminLayout.module.css';

// Toast context
interface ToastState {
  message: string;
  type: 'success' | 'error';
  id: number;
}

interface ToastContextValue {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/case-studies', label: 'Case Studies', icon: Briefcase },
  { href: '/admin/portfolio', label: 'Portfolio', icon: FolderOpen },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/services', label: 'Services', icon: Settings },
  { href: '/admin/hero', label: 'Hero', icon: Star },
  { href: '/admin/stats', label: 'Stats', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { divider: true },
  { href: '/admin/leads', label: 'Leads', icon: Users },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [fadingToasts, setFadingToasts] = useState<Set<number>>(new Set());

  // Don't render the admin layout on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setFadingToasts((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        setFadingToasts((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 300);
    }, 3000);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className={styles.adminContainer}>
        {/* Mobile Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarBrand}>
            <div className={styles.brandName}>Electron Labs</div>
            <div className={styles.brandSub}>Admin Panel</div>
          </div>

          <nav className={styles.sidebarNav}>
            {navItems.map((item, index) => {
              if ('divider' in item) {
                return <div key={index} className={styles.navDivider} />;
              }
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={styles.navIcon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut className={styles.navIcon} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>{children}</main>

        {/* Toasts */}
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${
              toast.type === 'success' ? styles.toastSuccess : styles.toastError
            } ${fadingToasts.has(toast.id) ? styles.toastFadeOut : ''}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
