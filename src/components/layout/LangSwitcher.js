'use client';

import { usePathname } from 'next/navigation';
import styles from './LangSwitcher.module.css';

const LANGS = ['fr', 'en', 'es'];

export default function LangSwitcher({ lang, a11y = {} }) {
  const pathname = usePathname();

  function switchLang(targetLang) {
    // Replace /currentLang/... with /targetLang/...
    const segments = pathname.split('/');
    segments[1] = targetLang;
    const newPath = segments.join('/');

    // Persist preference in cookie (365 days)
    document.cookie = `lang=${targetLang};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;

    window.location.href = newPath;
  }

  return (
    <div className={styles.switcher}>
      {LANGS.map((l) => (
        <button
          key={l}
          className={`${styles.lang} ${l === lang ? styles.active : ''}`}
          onClick={() => switchLang(l)}
          aria-label={`${a11y.switchLang || 'Switch to'} ${l.toUpperCase()}`}
          aria-current={l === lang ? 'true' : undefined}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
