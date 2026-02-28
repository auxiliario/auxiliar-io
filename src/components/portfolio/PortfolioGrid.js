'use client';

import { useState, useEffect } from 'react';
import PortfolioCard from './PortfolioCard';
import styles from './PortfolioGrid.module.css';

const FILTER_KEYS = ['all', 'basic', 'standard', 'advanced', 'social-economy'];

export default function PortfolioGrid({ projects, filters, labels }) {
  const [active, setActive] = useState('all');

  // Listen for hash changes from the header Nav
  useEffect(() => {
    function onHash() {
      const hash = window.location.hash.replace('#', '');
      if (FILTER_KEYS.includes(hash)) {
        setActive(hash);
      }
    }
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function handleFilter(key) {
    setActive(key);
    // Update hash so header Nav highlights correctly
    window.history.replaceState(null, '', `#${key}`);
  }

  const filtered = active === 'all'
    ? projects
    : projects.filter((p) => p.tier === active);

  return (
    <div>
      {/* Filter bar */}
      <div id="all" className={styles.filterBar}>
        {FILTER_KEYS.map((key) => {
          const label = key === 'social-economy'
            ? filters.socialEconomy
            : filters[key];
          return (
            <button
              key={key}
              id={key !== 'all' ? key : undefined}
              type="button"
              className={`${styles.filterBtn} ${active === key ? styles.filterActive : ''}`}
              onClick={() => handleFilter(key)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map((project) => (
          <PortfolioCard
            key={project.name}
            project={project}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}
