'use client';

import { useEffect, useRef } from 'react';
import styles from './AIOrb.module.css';

export default function AIOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = orb.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = (e.clientX - centerX) / 40;
      const moveY = (e.clientY - centerY) / 40;
      orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.orbContainer} ref={orbRef}>
      <div className={styles.orbGlow} />
      <div className={styles.orbRing1} />
      <div className={styles.orbRing2} />
      <div className={styles.orbCore}>
        <div className={styles.orbInner} />
        <div className={styles.orbSheen} />
      </div>
      <div className={styles.orbParticle1} />
      <div className={styles.orbParticle2} />
      <div className={styles.orbParticle3} />
    </div>
  );
}
