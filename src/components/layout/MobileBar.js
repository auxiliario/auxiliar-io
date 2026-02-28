'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../lib/auth';
import { Home, User, LayoutDashboard, Moon, Sun, Globe } from 'lucide-react';
import styles from './MobileBar.module.css';

const LANGS = ['fr', 'en', 'es'];

export default function MobileBar({ lang }) {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, loading } = useAuth();

  const segments = pathname.split('/').filter(Boolean);
  const page = segments[1] || 'service';

  function cycleLang() {
    const idx = LANGS.indexOf(lang);
    const next = LANGS[(idx + 1) % LANGS.length];
    const segs = pathname.split('/');
    segs[1] = next;
    document.cookie = `lang=${next};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    window.location.href = segs.join('/');
  }

  const isDark = !mounted || theme === 'dark';
  const isHome = !segments[1] || page === 'service';

  return (
    <nav className={styles.bar} aria-label="Mobile navigation">
      <a
        href={`/${lang}`}
        className={`${styles.item} ${isHome ? styles.active : ''}`}
        aria-label="Home"
      >
        <Home size={20} strokeWidth={2} />
      </a>

      {!loading && user ? (
        <a
          href={`/${lang}/dashboard`}
          className={`${styles.item} ${page === 'dashboard' ? styles.active : ''}`}
          aria-label="Dashboard"
        >
          <LayoutDashboard size={20} strokeWidth={2} />
        </a>
      ) : (
        <a
          href={`/${lang}/login`}
          className={`${styles.item} ${page === 'login' ? styles.active : ''}`}
          aria-label="Sign in"
        >
          <User size={20} strokeWidth={2} />
        </a>
      )}

      <button
        className={styles.item}
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
      </button>

      <button
        className={styles.item}
        onClick={cycleLang}
        aria-label={`Language: ${lang.toUpperCase()}`}
      >
        <Globe size={20} strokeWidth={2} />
        <span className={styles.langBadge}>{lang}</span>
      </button>
    </nav>
  );
}
