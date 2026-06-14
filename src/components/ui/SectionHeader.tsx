import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${styles[align]}`}>
      {badge && <span className={styles.badge}>{badge}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
