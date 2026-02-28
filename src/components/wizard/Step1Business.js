'use client';

import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import ChoiceButton from '../ui/ChoiceButton';
import TooltipIcon from '../ui/TooltipIcon';
import Button from '../ui/Button';
import LanguageSelector from './LanguageSelector';
import styles from './Step1Business.module.css';
import shellStyles from './WizardShell.module.css';

export default function Step1Business({ lang, t, state, setField }) {
  const businessTypeOptions = [
    ...t.businessTypes.map((bt) => ({ value: bt, label: bt })),
    { value: '__other__', label: t.businessTypeOther },
  ];

  function toggleLanguage(code) {
    const current = state.languages;
    const next = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    setField('languages', next);
    // Auto-set primary if only one
    if (next.length === 1) setField('primaryLanguage', next[0]);
    // Clear primary if deselected
    if (!next.includes(state.primaryLanguage)) {
      setField('primaryLanguage', next[0] || '');
    }
  }

  return (
    <div>
      <h2 className={shellStyles.stepTitle}>{t.title}</h2>
      <div className={shellStyles.stepContent}>
        {/* Social economy banner */}
        <div className={styles.socialBanner}>
          <span>{t.socialBanner}</span>
          <Button variant="secondary" size="sm" href={`/${lang}/social-economy`}>
            {t.socialBannerCta}
          </Button>
        </div>

        {/* Business name */}
        <Input
          label={t.businessName}
          required
          placeholder={t.businessNamePlaceholder}
          value={state.businessName}
          onChange={(e) => setField('businessName', e.target.value)}
        />

        {/* Business type */}
        <div className={styles.fieldGroup}>
          <Select
            label={t.businessType}
            placeholder={t.businessTypePlaceholder}
            options={businessTypeOptions}
            value={state.businessType}
            onChange={(e) => setField('businessType', e.target.value)}
          />
          {state.businessType === '__other__' && (
            <Input
              placeholder={t.businessTypeOtherPlaceholder}
              value={state.businessTypeOther}
              onChange={(e) => setField('businessTypeOther', e.target.value)}
            />
          )}
        </div>

        {/* Description */}
        <Textarea
          label={t.description}
          required
          placeholder={t.descriptionPlaceholder}
          value={state.description}
          onChange={(e) => setField('description', e.target.value)}
        />

        {/* Languages */}
        <LanguageSelector
          selected={state.languages}
          primary={state.primaryLanguage}
          onToggle={toggleLanguage}
          onPrimaryChange={(v) => setField('primaryLanguage', v)}
          label={t.languages}
          tooltip={t.languagesTooltip}
          tooltipAriaLabel={t.moreInfo}
          primaryLabel={t.primaryLanguage}
        />

        {/* Domain */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{t.domain}</div>
          <div className={styles.choiceRow}>
            <ChoiceButton
              selected={state.hasDomain === true}
              onClick={() => setField('hasDomain', true)}
            >
              {t.domainYes}
            </ChoiceButton>
            <ChoiceButton
              selected={state.hasDomain === false}
              onClick={() => setField('hasDomain', false)}
            >
              {t.domainNo}
            </ChoiceButton>
          </div>
          {state.hasDomain === true && (
            <Input
              label={t.domainInput}
              placeholder={t.domainInputPlaceholder}
              value={state.domain}
              onChange={(e) => setField('domain', e.target.value)}
            />
          )}
          {state.hasDomain === false && (
            <div className={styles.hint}>{t.domainNoHint}</div>
          )}
        </div>

        {/* Payment */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>
            {t.payment}
            <TooltipIcon text={t.paymentTooltip} ariaLabel={t.moreInfo} />
          </div>
          <div className={styles.choiceRow}>
            <ChoiceButton
              selected={state.payment === 'yes'}
              onClick={() => setField('payment', 'yes')}
            >
              {t.yes}
            </ChoiceButton>
            <ChoiceButton
              selected={state.payment === 'no'}
              onClick={() => setField('payment', 'no')}
            >
              {t.no}
            </ChoiceButton>
            <ChoiceButton
              selected={state.payment === 'notSure'}
              onClick={() => setField('payment', 'notSure')}
            >
              {t.notSure}
            </ChoiceButton>
          </div>
        </div>

        {/* Login */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>
            {t.login}
            <TooltipIcon text={t.loginTooltip} ariaLabel={t.moreInfo} />
          </div>
          <div className={styles.choiceRow}>
            <ChoiceButton
              selected={state.login === 'yes'}
              onClick={() => setField('login', 'yes')}
            >
              {t.yes}
            </ChoiceButton>
            <ChoiceButton
              selected={state.login === 'no'}
              onClick={() => setField('login', 'no')}
            >
              {t.no}
            </ChoiceButton>
            <ChoiceButton
              selected={state.login === 'notSure'}
              onClick={() => setField('login', 'notSure')}
            >
              {t.notSure}
            </ChoiceButton>
          </div>
        </div>
      </div>
    </div>
  );
}
