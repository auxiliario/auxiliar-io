import styles from './PortfolioCard.module.css';

export default function PortfolioCard({ project, labels, compact = false }) {
  const isSocial = project.tier === 'social-economy';
  const tierDisplay = isSocial
    ? (labels?.socialEconomy || 'Social economy')
    : project.tier.charAt(0).toUpperCase() + project.tier.slice(1);

  const pageLabel = project.pageCount === 1
    ? (labels?.pages || '{count} page').replace('{count}', project.pageCount)
    : (labels?.pagesPlural || '{count} pages').replace('{count}', project.pageCount);

  const langLabel = project.languageCount === 1
    ? (labels?.languages || '{count} language').replace('{count}', project.languageCount)
    : (labels?.languagesPlural || '{count} languages').replace('{count}', project.languageCount);

  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        <span className={styles.thumbText}>{project.name}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{project.name}</span>
          <span className={`${styles.badge} ${isSocial ? styles.badgeSocial : ''}`}>
            {tierDisplay}
          </span>
        </div>
        <div className={styles.type}>{project.type}</div>
        {!compact && project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.metaItem}>{pageLabel}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaItem}>{langLabel}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaItem}>{project.languages.join(', ')}</span>
        </div>
      </div>
    </div>
  );
}
