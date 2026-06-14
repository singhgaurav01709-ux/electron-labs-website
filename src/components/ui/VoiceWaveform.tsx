'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './VoiceWaveform.module.css';

interface VoiceWaveformProps {
  barCount?: number;
  isPlaying?: boolean;
}

export default function VoiceWaveform({
  barCount = 40,
  isPlaying = true,
}: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const barsRef = useRef<number[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const barWidth = width / barCount;
    const gap = 2;
    const maxBarHeight = height * 0.85;
    const time = Date.now() / 1000;

    // Initialize bars
    if (barsRef.current.length === 0) {
      barsRef.current = Array.from({ length: barCount }, () => Math.random());
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < barCount; i++) {
      // Create natural voice-like waveform pattern
      const normalizedPos = i / barCount;
      const centerFactor = 1 - Math.abs(normalizedPos - 0.5) * 2;
      const envelope = Math.pow(centerFactor, 0.6);

      // Multiple sine waves for organic feel
      const wave1 = Math.sin(time * 2.5 + i * 0.3) * 0.3;
      const wave2 = Math.sin(time * 1.8 + i * 0.5) * 0.2;
      const wave3 = Math.sin(time * 3.2 + i * 0.15) * 0.15;
      const noise = (Math.random() - 0.5) * 0.08;

      const target = isPlaying
        ? Math.max(0.08, (0.35 + wave1 + wave2 + wave3 + noise) * envelope)
        : 0.05;

      // Smooth interpolation
      barsRef.current[i] += (target - barsRef.current[i]) * 0.12;
      const barHeight = barsRef.current[i] * maxBarHeight;

      const x = i * barWidth + gap / 2;
      const y = (height - barHeight) / 2;
      const actualBarWidth = barWidth - gap;

      // Gradient per bar — violet to cyan
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      const alpha = 0.5 + barsRef.current[i] * 0.5;
      gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${alpha * 0.8})`);
      gradient.addColorStop(1, `rgba(6, 182, 212, ${alpha * 0.6})`);

      ctx.beginPath();
      ctx.roundRect(x, y, actualBarWidth, barHeight, 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [barCount, isPlaying]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <div className={styles.waveformContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.glow} />
    </div>
  );
}
