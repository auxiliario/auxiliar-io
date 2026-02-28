'use client';

import { useState } from 'react';
import { submitWizard } from '../../lib/submissions';
import Button from '../ui/Button';
import styles from './Step5Review.module.css';
import shellStyles from './WizardShell.module.css';

export default function Step5Review({ lang, t, state, goToStep, setField, userId, submissionId }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const s = t.sections;
  const l = t.labels;
  const v = t.values;

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');

    if (submissionId) {
      try {
        await submitWizard(submissionId, state);
        setSubmitted(true);
      } catch (err) {
        console.error('Submit error:', err);
        setSubmitError(err.message || 'Something went wrong.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Dev mode (no Supabase) — simulate
      await new Promise((r) => setTimeout(r, 800));
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  function yesNoNotSure(val) {
    if (val === true || val === 'yes') return v.yes;
    if (val === false || val === 'no') return v.no;
    if (val === 'notSure') return v.notSure;
    return v.notProvided;
  }

  function formatHours() {
    if (!state.hoursType) return v.notProvided;
    if (state.hoursType === 'appointment') return v.yes;
    if (state.hoursType === '24/7') return '24/7';
    if (state.hoursType === 'seasonal') return state.hoursSeasonal || v.notProvided;
    if (state.hoursType === 'regular') {
      const entries = Object.entries(state.hoursRegular);
      if (entries.length === 0) return v.notProvided;
      return entries
        .map(([day, val]) => {
          if (val.closed) return `${day}: Closed`;
          return `${day}: ${val.open || '?'} – ${val.close || '?'}`;
        })
        .join(', ');
    }
    return state.hoursType;
  }

  function formatSocials() {
    const entries = Object.entries(state.socials);
    if (entries.length === 0) return v.none;
    return entries.map(([platform, url]) => `${platform}: ${url || '—'}`).join(', ');
  }

  return (
    <div>
      <h2 className={shellStyles.stepTitle}>{t.title}</h2>
      <p className={styles.summary}>{t.summary}</p>

      <div className={styles.sections}>
        {/* Section 1: Business */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{s.business}</h3>
            <button type="button" className={styles.editBtn} onClick={() => goToStep(1)}>
              {t.edit}
            </button>
          </div>
          <div className={styles.grid}>
            <Row label={l.businessName} value={state.businessName || v.notProvided} />
            <Row label={l.businessType} value={state.businessType === 'Other' ? state.businessTypeOther : state.businessType || v.notProvided} />
            <Row label={l.description} value={state.description || v.notProvided} />
            <Row label={l.languages} value={state.languages.length > 0 ? state.languages.join(', ') : v.notProvided} />
            {state.languages.length > 1 && (
              <Row label={l.primaryLanguage} value={state.primaryLanguage || v.notProvided} />
            )}
            <Row label={l.domain} value={state.hasDomain === true ? state.domain || v.yes : state.hasDomain === false ? v.no : v.notProvided} />
            <Row label={l.payment} value={yesNoNotSure(state.payment)} />
            <Row label={l.login} value={yesNoNotSure(state.login)} />
          </div>
        </div>

        {/* Section 2: Contact */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{s.contact}</h3>
            <button type="button" className={styles.editBtn} onClick={() => goToStep(2)}>
              {t.edit}
            </button>
          </div>
          <div className={styles.grid}>
            <Row label={l.phone} value={state.phone || v.notProvided} />
            <Row label={l.email} value={state.email || v.notProvided} />
            <Row label={l.address} value={state.address || v.notProvided} />
            <Row label={l.hours} value={formatHours()} />
            <Row label={l.socials} value={formatSocials()} />
          </div>
        </div>

        {/* Section 3: Look & feel */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{s.lookFeel}</h3>
            <button type="button" className={styles.editBtn} onClick={() => goToStep(3)}>
              {t.edit}
            </button>
          </div>
          <div className={styles.grid}>
            <Row label={l.logo} value={state.hasLogo ? `${v.yes} (${state.logoFiles.length} file${state.logoFiles.length !== 1 ? 's' : ''})` : state.hasLogo === false ? v.no : v.notProvided} />
            <Row label={l.favicon} value={state.hasFavicon ? `${v.yes} (${state.faviconFiles.length} file${state.faviconFiles.length !== 1 ? 's' : ''})` : state.hasFavicon === false ? v.no : v.notProvided} />
            <Row label={l.brandColors} value={state.brandColorPreference === 'none' ? v.noPreference : state.brandColors.length > 0 ? state.brandColors.join(', ') : v.notProvided} />
            {state.brandColorPreference === 'custom' && state.brandColors.length > 0 && (
              <div className={styles.colorSwatches}>
                {state.brandColors.map((c) => (
                  <span key={c} className={styles.swatch} style={{ background: c }} title={c} />
                ))}
              </div>
            )}
            <Row label={l.vibes} value={state.vibes.length > 0 ? state.vibes.join(', ') : v.notProvided} />
            <Row
              label={l.inspiration}
              value={
                state.inspirations.filter((ins) => ins.url).length > 0
                  ? state.inspirations
                      .filter((ins) => ins.url)
                      .map((ins) => ins.url)
                      .join(', ')
                  : v.none
              }
            />
          </div>
        </div>

        {/* Section 4: Site */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{s.site}</h3>
            <button type="button" className={styles.editBtn} onClick={() => goToStep(4)}>
              {t.edit}
            </button>
          </div>
          <div className={styles.grid}>
            <Row label={l.sitePath} value={state.sitePath === 'auto' ? v.auto : state.sitePath === 'manual' ? v.manual : v.notProvided} />
            {state.sitePath === 'auto' && (
              <>
                <Row label={l.files} value={state.autoFiles.length > 0 ? `${state.autoFiles.length} file${state.autoFiles.length !== 1 ? 's' : ''}` : v.none} />
                <Row label={l.notes} value={state.autoNotes || v.notProvided} />
              </>
            )}
            {state.sitePath === 'manual' && (
              <Row label={l.pages} value={state.selectedPages.length > 0 ? state.selectedPages.join(', ') : v.none} />
            )}
          </div>
        </div>
      </div>

      {/* Terms + Submit */}
      <div className={styles.termsRow}>
        <label className={styles.termsLabel}>
          <input
            type="checkbox"
            checked={state.agreedToTerms}
            onChange={(e) => setField('agreedToTerms', e.target.checked)}
            className={styles.checkbox}
          />
          <span>
            {t.terms}{' '}
            <a href={`/${lang}/terms`} target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
              {t.termsLink}
            </a>
          </span>
        </label>
      </div>

      <div className={styles.submitRow}>
        {submitted ? (
          <div className={styles.submittedMsg}>{t.submitted}</div>
        ) : (
          <>
            {submitError && <p className={styles.errorMsg}>{submitError}</p>}
            <Button
              full
              disabled={!state.agreedToTerms || submitting}
              onClick={handleSubmit}
            >
              {submitting ? '...' : t.submitButton}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
