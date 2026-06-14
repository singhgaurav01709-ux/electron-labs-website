'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Demo', href: '#demo' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Capabilities', href: '#benefits' },
  { label: 'Services', href: '#services' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          <a href="#hero" className={styles.logo}>
            <img src="/logo.png" alt="Electron Labs" className={styles.logoImage} width={40} height={40} />
            <span className={styles.logoText}>Electron Labs</span>
          </a>

          <div className={styles.navLinks}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.actions}>
            <Button variant="primary" size="sm" href="#contact">
              Book Consultation
              <ArrowRight size={14} />
            </Button>
          </div>

          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.mobileContent}>
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              style={{ transitionDelay: `${i * 50}ms` }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" size="lg" href="#contact" className={styles.mobileCta}>
            Book Consultation
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
