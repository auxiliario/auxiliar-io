'use client';

import Input from '../ui/Input';
import ChoiceButton from '../ui/ChoiceButton';
import styles from './InspirationInput.module.css';

const MAX_INSPIRATIONS = 3;

function emptyInspiration() {
  return { url: '', likes: [], other: '' };
}

export default function InspirationInput({ t, inspirations, onChange }) {
  function updateInspiration(index, key, value) {
    const updated = inspirations.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    onChange(updated);
  }

  function toggleLike(index, option) {
    const current = inspirations[index].likes;
    const updated = current.includes(option)
      ? current.filter((l) => l !== option)
      : [...current, option];
    updateInspiration(index, 'likes', updated);
  }

  function addInspiration() {
    if (inspirations.length < MAX_INSPIRATIONS) {
      onChange([...inspirations, emptyInspiration()]);
    }
  }

  function removeInspiration(index) {
    onChange(inspirations.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{t.inspiration}</div>

      {/* Amber explainer */}
      <div className={styles.explainer}>
        <svg className={styles.explainerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className={styles.explainerText}>{t.inspirationExplainer}</p>
      </div>

      {/* Inspiration entries */}
      {inspirations.map((item, i) => (
        <div key={i} className={styles.entry}>
          <div className={styles.entryHeader}>
            <span className={styles.entryNumber}>#{i + 1}</span>
            {inspirations.length > 0 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeInspiration(i)}
              >
                {t.removeInspiration}
              </button>
            )}
          </div>

          <Input
            label={t.inspirationUrl}
            type="url"
            placeholder={t.inspirationUrlPlaceholder}
            value={item.url}
            onChange={(e) => updateInspiration(i, 'url', e.target.value)}
          />

          {item.url && (
            <>
              <div className={styles.likesLabel}>{t.inspirationLikes}</div>
              <div className={styles.likesGrid}>
                {t.inspirationLikesOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    small
                    selected={item.likes.includes(option)}
                    onClick={() => toggleLike(i, option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>

              <div className={styles.otherRow}>
                <Input
                  label={t.inspirationOther}
                  placeholder={t.inspirationOtherPlaceholder}
                  value={item.other}
                  onChange={(e) => updateInspiration(i, 'other', e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      ))}

      {inspirations.length < MAX_INSPIRATIONS && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={addInspiration}
        >
          {t.addInspiration}
        </button>
      )}
    </div>
  );
}
