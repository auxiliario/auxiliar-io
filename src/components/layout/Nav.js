'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Home,
  ShieldCheck,
  Tag,
  ListOrdered,
  LayoutGrid,
  Users,
  ClipboardList,
  Grid3X3,
  Circle,
  CircleDot,
  Star,
  Heart,
} from 'lucide-react';
import styles from './Nav.module.css';

const ICON_MAP = {
  home: Home,
  shieldCheck: ShieldCheck,
  tag: Tag,
  listOrdered: ListOrdered,
  layoutGrid: LayoutGrid,
  users: Users,
  clipboardList: ClipboardList,
  grid: Grid3X3,
  circle: Circle,
  circleDot: CircleDot,
  star: Star,
  heart: Heart,
};

export default function Nav({ links }) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);

  useEffect(() => {
    // Collect section IDs from hash links only
    const ids = links
      .filter((link) => link.href.startsWith('#'))
      .map((link) => link.href.replace('#', ''))
      .filter((id) => id && id !== 'top');

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
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
    if (href === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className={styles.nav}>
      {links.map((link) => {
        const isHash = link.href.startsWith('#');
        const sectionId = isHash ? link.href.replace('#', '') : '';
        const isActive = isHash && sectionId !== 'top' && activeId === sectionId;
        const IconComponent = link.icon ? ICON_MAP[link.icon] : null;

        return (
          <a
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isActive ? styles.active : ''}`}
            onClick={(e) => handleClick(e, link.href)}
          >
            {IconComponent && (
              <span className={styles.iconWrap}>
                <IconComponent size={18} strokeWidth={2} />
              </span>
            )}
            <span className={styles.label}>{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
