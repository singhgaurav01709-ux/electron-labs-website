'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import AIOrb from '@/components/ui/AIOrb';
import VoiceWaveform from '@/components/ui/VoiceWaveform';
import MagicRings from '@/components/ui/MagicRings';
import styles from './Hero.module.css';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  socialProofText?: string;
}

export default function Hero({
  headline = 'Custom AI systems built for growing businesses.',
  subheadline = 'Practical AI automation solutions tailored to your workflow.',
  ctaPrimaryText = 'Book Consultation',
  ctaSecondaryText = 'Watch Demo',
  socialProofText = 'Focused on building useful AI tools that save time and improve customer interactions.',
}: HeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className={styles.hero} id="hero">
      {/* Animated Background */}
      <div className={styles.bgMesh} />
      <div className={styles.bgGradient} />
      <div className={styles.gridPattern} />
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6, pointerEvents: 'none', overflow: 'hidden' }}>
        <MagicRings
          color="#A855F7"
          colorTwo="#6366F1"
          ringCount={9}
          speed={1.3}
          attenuation={9.5}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.07}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.03}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.65}
          parallax={0.05}
          clickBurst={false}
        />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.textContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              AI-Powered Voice Agents
            </span>
          </motion.div>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {headline}
          </motion.h1>

          <motion.p
            className={styles.subheadline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {subheadline}
          </motion.p>

          <motion.div
            className={styles.waveformWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <VoiceWaveform barCount={45} />
          </motion.div>

          <motion.div
            className={styles.ctas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button variant="primary" size="lg" href="#contact">
              {ctaPrimaryText}
              <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="lg" href="#demo">
              <Play size={16} />
              {ctaSecondaryText}
            </Button>
          </motion.div>

          <motion.p
            className={styles.socialProof}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {socialProofText}
          </motion.p>
        </div>

        <motion.div
          className={styles.orbWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <AIOrb />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className={styles.bottomFade} />
    </section>
  );
}
