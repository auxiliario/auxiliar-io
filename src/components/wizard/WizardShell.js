'use client';

import { useReducer, useCallback } from 'react';
import Button from '../ui/Button';
import Step1Business from './Step1Business';
import Step2Contact from './Step2Contact';
import Step3LookFeel from './Step3LookFeel';
import Step4Site from './Step4Site';
import Step5Review from './Step5Review';
import styles from './WizardShell.module.css';

const TOTAL_STEPS = 5;

const initialState = {
  step: 1,
  // Step 1
  businessName: '',
  businessType: '',
  businessTypeOther: '',
  description: '',
  languages: [],
  primaryLanguage: '',
  hasDomain: null,
  domain: '',
  payment: null,
  login: null,
  // Step 2
  phone: '',
  email: '',
  address: '',
  hoursType: null,
  hoursRegular: {},
  hoursSeasonal: '',
  socials: {},
  // Step 3
  hasLogo: null,
  logoFiles: [],
  hasFavicon: null,
  faviconFiles: [],
  brandColorPreference: null,
  brandColors: [],
  vibes: [],
  inspirations: [],
  // Step 4
  sitePath: null,
  autoFiles: [],
  autoNotes: '',
  selectedPages: [],
  pageDetails: {},
  customPages: [],
  // Step 5
  agreedToTerms: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_STEP':
      return { ...state, step: action.step };
    default:
      return state;
  }
}

export default function WizardShell({ lang, t }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const goToStep = (step) => {
    dispatch({ type: 'SET_STEP', step });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    if (state.step < TOTAL_STEPS) {
      goToStep(state.step + 1);
    }
  };

  const goBack = () => {
    if (state.step > 1) {
      goToStep(state.step - 1);
    }
  };

  const progressText = t.progress
    .replace('{current}', state.step)
    .replace('{total}', TOTAL_STEPS);

  return (
    <div className={styles.shell}>
      {/* Progress */}
      <div className={styles.progressWrap}>
        <div className={styles.progressText}>{progressText}</div>
        <div className={styles.progressBar}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`${styles.progressSegment} ${i < state.step ? styles.progressFilled : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      {state.step === 1 && (
        <Step1Business
          lang={lang}
          t={t.step1}
          state={state}
          setField={setField}
        />
      )}
      {state.step === 2 && (
        <Step2Contact
          t={t.step2}
          state={state}
          setField={setField}
        />
      )}
      {state.step === 3 && (
        <Step3LookFeel
          t={t.step3}
          state={state}
          setField={setField}
        />
      )}
      {state.step === 4 && (
        <Step4Site
          t={t.step4}
          state={state}
          setField={setField}
        />
      )}
      {state.step === 5 && (
        <Step5Review
          lang={lang}
          t={t.step5}
          state={state}
          goToStep={goToStep}
          setField={setField}
        />
      )}

      {/* Navigation */}
      <div className={styles.nav}>
        {state.step > 1 ? (
          <Button variant="ghost" onClick={goBack}>{t.back}</Button>
        ) : (
          <div className={styles.navSpacer} />
        )}
        {state.step < TOTAL_STEPS ? (
          <Button onClick={goNext}>{t.next}</Button>
        ) : (
          <div className={styles.navSpacer} />
        )}
      </div>
    </div>
  );
}
