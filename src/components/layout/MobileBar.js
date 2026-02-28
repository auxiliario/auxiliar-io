'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { User } from 'lucide-react';
import styles from './MobileBar.module.css';

export default function MobileBar({ lang }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const segments = pathname.split('/').filter(Boolean);
  const page = segments[1] || 'service';

  if (loading) return null;

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url;
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';
    const initial = name.charAt(0).toUpperCase() || '?';
    const isActive = page === 'dashboard';

    return (
      <div className={styles.bar}>
        <a
          href={`/${lang}/dashboard`}
          className={`${styles.fab} ${isActive ? styles.active : ''}`}
          aria-label="Dashboard"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className={styles.avatar}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className={styles.initial}>{initial}</span>
          )}
        </a>
      </div>
    );
  }

  const isActive = page === 'login';

  return (
    <div className={styles.bar}>
      <a
        href={`/${lang}/login`}
        className={`${styles.fab} ${isActive ? styles.active : ''}`}
        aria-label="Sign in"
      >
        <User size={20} strokeWidth={2} />
      </a>
    </div>
  );
}
