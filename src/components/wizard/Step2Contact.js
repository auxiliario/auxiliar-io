'use client';

import Input from '../ui/Input';
import ChoiceButton from '../ui/ChoiceButton';
import HoursSelector from './HoursSelector';
import styles from './Step2Contact.module.css';
import shellStyles from './WizardShell.module.css';

export default function Step2Contact({ t, state, setField }) {
  const platforms = t.socialPlatforms;
  const selectedPlatforms = Object.keys(state.socials);

  function togglePlatform(platform) {
    const current = { ...state.socials };
    if (current[platform] !== undefined) {
      delete current[platform];
    } else {
      current[platform] = '';
    }
    setField('socials', current);
  }

  function setSocialUrl(platform, url) {
    setField('socials', { ...state.socials, [platform]: url });
  }

  return (
    <div>
      <h2 className={shellStyles.stepTitle}>{t.title}</h2>
      <div className={shellStyles.stepContent}>
        {/* Phone */}
        <Input
          label={t.phone}
          required
          type="tel"
          placeholder={t.phonePlaceholder}
          value={state.phone}
          onChange={(e) => setField('phone', e.target.value)}
        />

        {/* Email */}
        <Input
          label={t.email}
          required
          type="email"
          placeholder={t.emailPlaceholder}
          value={state.email}
          onChange={(e) => setField('email', e.target.value)}
        />

        {/* Address */}
        <Input
          label={t.address}
          placeholder={t.addressPlaceholder}
          value={state.address}
          onChange={(e) => setField('address', e.target.value)}
        />

        {/* Hours */}
        <HoursSelector
          hoursType={state.hoursType}
          hoursRegular={state.hoursRegular}
          hoursSeasonal={state.hoursSeasonal}
          onTypeChange={(type) => setField('hoursType', type)}
          onRegularChange={(val) => setField('hoursRegular', val)}
          onSeasonalChange={(val) => setField('hoursSeasonal', val)}
          t={t}
        />

        {/* Social platforms */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{t.socials}</div>
          <div className={styles.hint}>{t.socialsHint}</div>
          <div className={styles.platformGrid}>
            {platforms.map((p) => (
              <ChoiceButton
                key={p}
                selected={state.socials[p] !== undefined}
                onClick={() => togglePlatform(p)}
              >
                {p}
              </ChoiceButton>
            ))}
          </div>
          {selectedPlatforms.length > 0 && (
            <div className={styles.socialInputs}>
              {selectedPlatforms.map((p) => (
                <div key={p} className={styles.socialRow}>
                  <span className={styles.socialName}>{p}</span>
                  <Input
                    placeholder={t.socialPlaceholder}
                    value={state.socials[p]}
                    onChange={(e) => setSocialUrl(p, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
