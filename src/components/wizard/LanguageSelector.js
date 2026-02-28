'use client';

import ChoiceButton from '../ui/ChoiceButton';
import Select from '../ui/Select';
import TooltipIcon from '../ui/TooltipIcon';
import styles from './LanguageSelector.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
];

export default function LanguageSelector({
  selected = [],
  primary = '',
  onToggle,
  onPrimaryChange,
  label,
  tooltip,
  tooltipAriaLabel,
  primaryLabel,
}) {
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        {tooltip && <TooltipIcon text={tooltip} ariaLabel={tooltipAriaLabel} />}
      </div>
      <div className={styles.grid}>
        {LANGUAGES.map((lang) => (
          <ChoiceButton
            key={lang.code}
            selected={selected.includes(lang.code)}
            onClick={() => onToggle(lang.code)}
          >
            {lang.label}
          </ChoiceButton>
        ))}
      </div>
      {selected.length > 1 && (
        <div className={styles.primaryRow}>
          <Select
            label={primaryLabel}
            value={primary}
            onChange={(e) => onPrimaryChange(e.target.value)}
            options={selected.map((code) => ({
              value: code,
              label: LANGUAGES.find((l) => l.code === code)?.label || code,
            }))}
          />
        </div>
      )}
    </div>
  );
}
