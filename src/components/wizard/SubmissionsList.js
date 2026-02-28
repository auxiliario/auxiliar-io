'use client';

import Button from '../ui/Button';
import styles from './SubmissionsList.module.css';

export default function SubmissionsList({ lang, t, submissions }) {
  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.title}</h2>

      <div className={styles.list}>
        {submissions.map((sub) => {
          const name = sub.step1_data?.businessName || t.untitled;
          const statusKey = sub.status || 'in_progress';
          const statusLabel = t.status?.[statusKey] || statusKey;
          const stepLabel = t.step
            ? t.step.replace('{step}', sub.current_step || 1)
            : '';
          const isEditable = sub.status === 'in_progress';

          return (
            <div key={sub.id} className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.cardName}>{name}</div>
                <div className={styles.cardMeta}>
                  <span className={`${styles.badge} ${styles[`badge_${statusKey}`] || ''}`}>
                    {statusLabel}
                  </span>
                  {isEditable && (
                    <span className={styles.stepInfo}>{stepLabel}</span>
                  )}
                </div>
                <div className={styles.cardDate}>
                  {t.lastUpdated} {formatDate(sub.updated_at)}
                </div>
              </div>
              <div className={styles.cardActions}>
                {isEditable ? (
                  <Button href={`/${lang}/start?id=${sub.id}`} size="sm">
                    {t.continue}
                  </Button>
                ) : (
                  <Button href={`/${lang}/start?id=${sub.id}`} variant="secondary" size="sm">
                    {t.view}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.newRow}>
        <Button href={`/${lang}/start?new=1`}>{t.newProject}</Button>
      </div>
    </div>
  );
}
