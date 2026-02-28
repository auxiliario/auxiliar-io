'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabase';
import Button from '../ui/Button';
import styles from './SubmissionDetail.module.css';

export default function SubmissionDetail({ lang, t, wizardT, submission }) {
  const [status, setStatus] = useState(submission.status);
  const [acting, setActing] = useState(false);

  const step1 = submission.step1_data || {};
  const step2 = submission.step2_data || {};
  const step3 = submission.step3_data || {};
  const step4 = submission.step4_data || {};

  const wt = wizardT || {};
  const s5 = wt.step5 || {};
  const sl = s5.labels || {};
  const sv = s5.values || {};

  function formatCurrency(amount) {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : lang === 'es' ? 'es-US' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  }

  function yesNoNotSure(val) {
    if (val === true || val === 'yes') return sv.yes || 'Yes';
    if (val === false || val === 'no') return sv.no || 'No';
    if (val === 'notSure') return sv.notSure || 'Not sure';
    return sv.notProvided || '—';
  }

  function formatHours() {
    if (!step2.hoursType) return sv.notProvided || '—';
    if (step2.hoursType === 'appointment') return sv.yes || 'By appointment';
    if (step2.hoursType === '24/7') return '24/7';
    if (step2.hoursType === 'seasonal') return step2.hoursSeasonal || sv.notProvided || '—';
    if (step2.hoursType === 'regular') {
      const entries = Object.entries(step2.hoursRegular || {});
      if (entries.length === 0) return sv.notProvided || '—';
      return entries
        .map(([day, val]) => {
          if (val.closed) return `${day}: Closed`;
          return `${day}: ${val.open || '?'} – ${val.close || '?'}`;
        })
        .join(', ');
    }
    return step2.hoursType;
  }

  function formatSocials() {
    const entries = Object.entries(step2.socials || {});
    if (entries.length === 0) return sv.none || 'None';
    return entries.map(([platform, url]) => `${platform}: ${url || '—'}`).join(', ');
  }

  async function handleAccept() {
    setActing(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'paid' })
      .eq('id', submission.id);
    if (!error) setStatus('paid');
    setActing(false);
  }

  async function handleDecline() {
    setActing(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'declined' })
      .eq('id', submission.id);
    if (!error) setStatus('declined');
    setActing(false);
  }

  const np = sv.notProvided || '—';

  return (
    <div className={styles.container}>
      <a href={`/${lang}/dashboard`} className={styles.backLink}>
        &larr; {t.backToList}
      </a>

      <div className={styles.topActions}>
        <Button href={`/${lang}/start?new=1`} variant="secondary" size="sm">
          {t.newProject}
        </Button>
      </div>

      <h1 className={styles.title}>{step1.businessName || t.untitled}</h1>

      {/* Status section */}
      <div className={styles.statusSection}>
        <span className={`${styles.badge} ${styles[`badge_${status}`] || ''}`}>
          {t.status?.[status] || status}
        </span>
        <p className={styles.statusDesc}>{t.statusDescriptions?.[status] || ''}</p>

        {status === 'approved' && submission.quote_amount && (
          <div className={styles.quoteSection}>
            <div className={styles.quoteAmount}>
              {t.quoteLabel}: {formatCurrency(submission.quote_amount)}
            </div>
            <div className={styles.quoteActions}>
              <Button onClick={handleAccept} disabled={acting}>
                {t.acceptButton}
              </Button>
              <Button variant="secondary" onClick={handleDecline} disabled={acting}>
                {t.declineButton}
              </Button>
            </div>
          </div>
        )}

        {status === 'in_progress' && (
          <div className={styles.continueRow}>
            <Button href={`/${lang}/start?id=${submission.id}`}>
              {t.continueButton} &rarr;
            </Button>
          </div>
        )}

        {submission.draft_url && (
          <a
            href={submission.draft_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.draftLink}
          >
            {t.draftUrlLabel} &rarr;
          </a>
        )}
      </div>

      {/* Data sections */}
      <div className={styles.sections}>
        {/* Business */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{s5.sections?.business || 'Business'}</h3>
          <div className={styles.grid}>
            <Row label={sl.businessName || 'Business'} value={step1.businessName || np} />
            <Row label={sl.businessType || 'Type'} value={step1.businessType === 'Other' ? step1.businessTypeOther : step1.businessType || np} />
            <Row label={sl.description || 'Description'} value={step1.description || np} />
            <Row label={sl.languages || 'Languages'} value={step1.languages?.length > 0 ? step1.languages.join(', ') : np} />
            {step1.languages?.length > 1 && (
              <Row label={sl.primaryLanguage || 'Primary'} value={step1.primaryLanguage || np} />
            )}
            <Row label={sl.domain || 'Domain'} value={step1.hasDomain === true ? step1.domain || yesNoNotSure(true) : yesNoNotSure(step1.hasDomain)} />
            <Row label={sl.payment || 'Payment'} value={yesNoNotSure(step1.payment)} />
            <Row label={sl.login || 'Login'} value={yesNoNotSure(step1.login)} />
          </div>
        </div>

        {/* Contact */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{s5.sections?.contact || 'Contact'}</h3>
          <div className={styles.grid}>
            <Row label={sl.phone || 'Phone'} value={step2.phone || np} />
            <Row label={sl.email || 'Email'} value={step2.email || np} />
            <Row label={sl.address || 'Address'} value={step2.address || np} />
            <Row label={sl.hours || 'Hours'} value={formatHours()} />
            <Row label={sl.socials || 'Socials'} value={formatSocials()} />
          </div>
        </div>

        {/* Look & Feel */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{s5.sections?.lookFeel || 'Appearance'}</h3>
          <div className={styles.grid}>
            <Row label={sl.logo || 'Logo'} value={step3.hasLogo ? yesNoNotSure(true) : yesNoNotSure(step3.hasLogo)} />
            <Row label={sl.favicon || 'Favicon'} value={step3.hasFavicon ? yesNoNotSure(true) : yesNoNotSure(step3.hasFavicon)} />
            <Row label={sl.brandColors || 'Colors'} value={step3.brandColorPreference === 'none' ? (sv.noPreference || 'No preference') : step3.brandColors?.length > 0 ? step3.brandColors.join(', ') : np} />
            {step3.brandColors?.length > 0 && (
              <div className={styles.colorSwatches}>
                {step3.brandColors.map((c) => (
                  <span key={c} className={styles.swatch} style={{ background: c }} title={c} />
                ))}
              </div>
            )}
            <Row label={sl.vibes || 'Style'} value={step3.vibes?.length > 0 ? step3.vibes.join(', ') : np} />
            <Row
              label={sl.inspiration || 'Inspiration'}
              value={
                step3.inspirations?.filter((ins) => ins.url).length > 0
                  ? step3.inspirations.filter((ins) => ins.url).map((ins) => ins.url).join(', ')
                  : sv.none || 'None'
              }
            />
          </div>
        </div>

        {/* Site */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{s5.sections?.site || 'Site'}</h3>
          <div className={styles.grid}>
            <Row label={sl.sitePath || 'Approach'} value={step4.sitePath === 'auto' ? (sv.auto || 'Auto') : step4.sitePath === 'manual' ? (sv.manual || 'Manual') : np} />
            {step4.sitePath === 'auto' && (
              <Row label={sl.notes || 'Notes'} value={step4.autoNotes || np} />
            )}
            {step4.sitePath === 'manual' && (
              <Row label={sl.pages || 'Pages'} value={step4.selectedPages?.length > 0 ? step4.selectedPages.join(', ') : (sv.none || 'None')} />
            )}
          </div>
        </div>
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
