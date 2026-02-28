'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { User } from 'lucide-react';
import styles from './AuthMenu.module.css';

export default function AuthMenu({ lang, t = {} }) {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (loading) return <div className={styles.placeholder} />;

  if (!user) {
    return (
      <a
        href={`/${lang}/login`}
        className={styles.trigger}
        aria-label={t.signIn || 'Sign in'}
      >
        <User size={18} strokeWidth={2} />
      </a>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const initial = (name || 'U').charAt(0).toUpperCase();

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className={styles.avatar} referrerPolicy="no-referrer" />
        ) : (
          <span className={styles.initial}>{initial}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <a
            href={`/${lang}/dashboard`}
            className={styles.dropdownItem}
            onClick={() => setOpen(false)}
          >
            {t.dashboard || 'Dashboard'}
          </a>
          <button
            className={styles.dropdownItem}
            onClick={() => {
              setOpen(false);
              signOut(lang);
            }}
          >
            {t.signOut || 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
