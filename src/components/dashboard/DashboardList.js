'use client';

import Button from '../ui/Button';
import styles from './DashboardList.module.css';

export default function DashboardList({ lang, t, submissions }) {
  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatCurrency(amount) {
    if (!amount && amount !== 0) return null;
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : lang === 'es' ? 'es-US' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  }

  if (submissions.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t.title}</h1>
        <div className={styles.empty}>
          <p className={styles.emptyText}>{t.emptyState}</p>
          <Button href={`/${lang}/start`}>{t.newProject}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.title}</h1>

      <div className={styles.list}>
        {submissions.map((sub) => {
          const name = sub.step1_data?.businessName || t.untitled;
          const statusKey = sub.status || 'in_progress';
          const statusLabel = t.status?.[statusKey] || statusKey;
          const showQuote = sub.quote_amount && ['approved', 'paid'].includes(statusKey);

          return (
            <a
              key={sub.id}
              href={`/${lang}/dashboard/${sub.id}`}
              className={styles.card}
            >
              <div className={styles.cardBody}>
                <div className={styles.cardName}>{name}</div>
                <div className={styles.cardMeta}>
                  <span className={`${styles.badge} ${styles[`badge_${statusKey}`] || ''}`}>
                    {statusLabel}
                  </span>
                  {showQuote && (
                    <span className={styles.quote}>{formatCurrency(sub.quote_amount)}</span>
                  )}
                </div>
                <div className={styles.cardDate}>{formatDate(sub.updated_at)}</div>
              </div>
              <div className={styles.cardArrow}>&rsaquo;</div>
            </a>
          );
        })}
      </div>

      <div className={styles.newRow}>
        <Button href={`/${lang}/start?new=1`}>{t.newProject}</Button>
      </div>
    </div>
  );
}
