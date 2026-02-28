'use client';

import ChoiceButton from '../ui/ChoiceButton';
import Textarea from '../ui/Textarea';
import styles from './HoursSelector.module.css';

const DAYS_DEFAULT = {
  mon: { closed: false, open: '09:00', close: '17:00' },
  tue: { closed: false, open: '09:00', close: '17:00' },
  wed: { closed: false, open: '09:00', close: '17:00' },
  thu: { closed: false, open: '09:00', close: '17:00' },
  fri: { closed: false, open: '09:00', close: '17:00' },
  sat: { closed: true, open: '', close: '' },
  sun: { closed: true, open: '', close: '' },
};

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function HoursSelector({
  hoursType,
  hoursRegular,
  hoursSeasonal,
  onTypeChange,
  onRegularChange,
  onSeasonalChange,
  t,
}) {
  const types = ['regular', 'appointment', '24/7', 'seasonal'];

  function initRegular() {
    if (Object.keys(hoursRegular).length === 0) {
      onRegularChange(DAYS_DEFAULT);
    }
  }

  function handleTypeClick(type) {
    onTypeChange(type);
    if (type === 'regular') initRegular();
  }

  function setDayField(dayKey, field, value) {
    const current = hoursRegular[dayKey] || DAYS_DEFAULT[dayKey];
    const updated = { ...hoursRegular, [dayKey]: { ...current, [field]: value } };
    onRegularChange(updated);
  }

  function toggleClosed(dayKey) {
    const current = hoursRegular[dayKey] || DAYS_DEFAULT[dayKey];
    setDayField(dayKey, 'closed', !current.closed);
  }

  return (
    <div className={styles.field}>
      <div className={styles.label}>{t.hours}</div>
      <div className={styles.typeGrid}>
        {types.map((type) => (
          <ChoiceButton
            key={type}
            selected={hoursType === type}
            onClick={() => handleTypeClick(type)}
          >
            {t.hoursTypes[type]}
          </ChoiceButton>
        ))}
      </div>

      {hoursType === 'appointment' && (
        <div className={styles.hint}>{t.hoursAppointmentHint}</div>
      )}

      {hoursType === '24/7' && (
        <div className={styles.hint}>{t.hours247Hint}</div>
      )}

      {hoursType === 'seasonal' && (
        <Textarea
          placeholder={t.hoursSeasonalPlaceholder}
          value={hoursSeasonal}
          onChange={(e) => onSeasonalChange(e.target.value)}
        />
      )}

      {hoursType === 'regular' && (
        <div className={styles.dayGrid}>
          {DAY_KEYS.map((dayKey, i) => {
            const day = hoursRegular[dayKey] || DAYS_DEFAULT[dayKey];
            return (
              <div key={dayKey} className={styles.dayRow}>
                <span className={styles.dayName}>{t.hoursRegularDays[i]}</span>
                <ChoiceButton
                  small
                  selected={day.closed}
                  onClick={() => toggleClosed(dayKey)}
                >
                  {t.hoursClosed}
                </ChoiceButton>
                <div className={styles.timeInputs}>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={day.closed ? '' : day.open}
                    disabled={day.closed}
                    onChange={(e) => setDayField(dayKey, 'open', e.target.value)}
                  />
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={day.closed ? '' : day.close}
                    disabled={day.closed}
                    onChange={(e) => setDayField(dayKey, 'close', e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
