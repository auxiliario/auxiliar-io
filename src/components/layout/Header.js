'use client';

import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import LangSwitcher from './LangSwitcher';
import AuthMenu from './AuthMenu';
import ThemeToggle from './ThemeToggle';
import Nav from './Nav';

export default function Header({ lang, navConfig, a11y = {}, authT = {} }) {
  const pathname = usePathname();

  // Determine which page we're on by checking the segment after /[lang]/
  const segments = pathname.split('/').filter(Boolean); // ['en', 'start'] etc.
  const page = segments[1] || 'service'; // default to service (home)

  const navLinks = navConfig[page] || navConfig.service || [];

  return (
    <header className={styles.header}>
      <div className={styles.row1}>
        <a href={`/${lang}`} className={styles.logo}>
          auxiliar.io
        </a>
        <div className={styles.rightGroup}>
          <LangSwitcher lang={lang} a11y={a11y} />
          <AuthMenu lang={lang} t={authT} />
          <ThemeToggle a11y={a11y} />
        </div>
      </div>
      {navLinks.length > 0 && (
        <div className={styles.row2}>
          <Nav links={navLinks} />
        </div>
      )}
    </header>
  );
}
