import styles from './Card.module.css';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'glass' | 'featured';
  badge?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  variant = 'default',
  badge,
  className,
  children,
}: CardProps) {
  return (
    <div className={cn(styles.card, variant !== 'default' && styles[variant], className)}>
      {badge && <span className={styles.cardBadge}>{badge}</span>}
      {children}
    </div>
  );
}
