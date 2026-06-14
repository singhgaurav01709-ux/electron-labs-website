'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import styles from './DemoVideo.module.css';

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Convert Google Drive link to embeddable format
  const videoUrl = 'https://drive.google.com/file/d/1UU3Ro52wo__J1hPEQP2T5b8eISmfa_wE/preview';

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className={`section ${styles.demo}`} id="demo">
      <div className="container">
        <SectionHeader
          badge="Demo"
          title="Watch a Demo"
          subtitle="See how our AI voice agent handles a real business call."
        />

        <div className={styles.videoWrapper}>
          <div className={styles.videoFrame}>
            {isPlaying ? (
              <iframe
                src={videoUrl}
                className={styles.iframe}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Demo Video"
              />
            ) : (
              <div className={styles.placeholder} onClick={handlePlay}>
                <div className={styles.placeholderBg} />
                <div className={styles.playButton}>
                  <Play size={32} fill="white" />
                </div>
                <p className={styles.placeholderText}>
                  Click to play demo
                </p>
              </div>
            )}
          </div>

          {/* Decorative glow */}
          <div className={styles.glow} />
        </div>
      </div>
    </section>
  );
}
