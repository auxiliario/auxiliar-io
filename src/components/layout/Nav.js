'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Nav.module.css';

export default function Nav({ links }) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);

  useEffect(() => {
    // Collect section IDs from links (strip the # prefix)
    const ids = links
      .map((link) => link.href.replace('#', ''))
      .filter(Boolean);

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting section
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => observerRef.current.observe(section));

    return () => observerRef.current?.disconnect();
  }, [links]);

  function handleClick(e, href) {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className={styles.nav}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`${styles.link} ${activeId === link.href.replace('#', '') ? styles.active : ''}`}
          onClick={(e) => handleClick(e, link.href)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
