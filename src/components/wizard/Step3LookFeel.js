'use client';

import { useState } from 'react';
import ChoiceButton from '../ui/ChoiceButton';
import UploadZone from '../ui/UploadZone';
import TooltipIcon from '../ui/TooltipIcon';
import InspirationInput from './InspirationInput';
import styles from './Step3LookFeel.module.css';
import shellStyles from './WizardShell.module.css';

export default function Step3LookFeel({ t, state, setField }) {
  const [colorInput, setColorInput] = useState('#4ade80');

  function addColor() {
    if (!state.brandColors.includes(colorInput)) {
      setField('brandColors', [...state.brandColors, colorInput]);
    }
  }

  function removeColor(color) {
    setField('brandColors', state.brandColors.filter((c) => c !== color));
  }

  function toggleVibe(vibe) {
    if (state.vibes.includes(vibe)) {
      setField('vibes', state.vibes.filter((v) => v !== vibe));
    } else {
      setField('vibes', [...state.vibes, vibe]);
    }
  }

  return (
    <div>
      <h2 className={shellStyles.stepTitle}>{t.title}</h2>
      <div className={shellStyles.stepContent}>
        {/* Logo */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{t.logo}</div>
          <div className={styles.yesNoRow}>
            <ChoiceButton
              selected={state.hasLogo === true}
              onClick={() => setField('hasLogo', true)}
              small
            >
              {t.logoYes}
            </ChoiceButton>
            <ChoiceButton
              selected={state.hasLogo === false}
              onClick={() => setField('hasLogo', false)}
              small
            >
              {t.logoNo}
            </ChoiceButton>
          </div>
          {state.hasLogo && (
            <div className={styles.uploadArea}>
              <UploadZone
                text={t.logoUpload}
                subtext={t.logoUploadHint}
                accept="image/*,.svg"
                multiple
                onFiles={(files) =>
                  setField('logoFiles', [...state.logoFiles, ...files])
                }
              />
              {state.logoFiles.length > 0 && (
                <div className={styles.fileList}>
                  {state.logoFiles.map((f, i) => (
                    <div key={i} className={styles.fileItem}>
                      <span className={styles.fileName}>{f.name}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() =>
                          setField(
                            'logoFiles',
                            state.logoFiles.filter((_, j) => j !== i)
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Favicon */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>
            {t.favicon}
            <TooltipIcon text={t.faviconTooltip} ariaLabel={t.moreInfo} />
          </div>
          <div className={styles.yesNoRow}>
            <ChoiceButton
              selected={state.hasFavicon === true}
              onClick={() => setField('hasFavicon', true)}
              small
            >
              {t.faviconYes}
            </ChoiceButton>
            <ChoiceButton
              selected={state.hasFavicon === false}
              onClick={() => setField('hasFavicon', false)}
              small
            >
              {t.faviconNo}
            </ChoiceButton>
          </div>
          {state.hasFavicon && (
            <div className={styles.uploadArea}>
              <UploadZone
                text={t.faviconUpload}
                subtext={t.faviconUploadHint}
                accept="image/*,.svg,.ico"
                multiple
                onFiles={(files) =>
                  setField('faviconFiles', [...state.faviconFiles, ...files])
                }
              />
              {state.faviconFiles.length > 0 && (
                <div className={styles.fileList}>
                  {state.faviconFiles.map((f, i) => (
                    <div key={i} className={styles.fileItem}>
                      <span className={styles.fileName}>{f.name}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() =>
                          setField(
                            'faviconFiles',
                            state.faviconFiles.filter((_, j) => j !== i)
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Brand colors */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{t.brandColors}</div>
          <div className={styles.hint}>{t.brandColorsHint}</div>
          <div className={styles.colorSection}>
            <ChoiceButton
              selected={state.brandColorPreference === 'none'}
              onClick={() => {
                setField('brandColorPreference', 'none');
                setField('brandColors', []);
              }}
            >
              {t.noPreference}
            </ChoiceButton>
            <ChoiceButton
              selected={state.brandColorPreference === 'custom'}
              onClick={() => setField('brandColorPreference', 'custom')}
            >
              {t.brandColors}
            </ChoiceButton>
          </div>
          {state.brandColorPreference === 'custom' && (
            <div className={styles.colorPicker}>
              <div className={styles.colorInputRow}>
                <input
                  type="color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className={styles.colorSwatch}
                />
                <span className={styles.colorHex}>{colorInput}</span>
                <button
                  type="button"
                  className={styles.addColorBtn}
                  onClick={addColor}
                >
                  {t.addColor}
                </button>
              </div>
              {state.brandColors.length > 0 && (
                <div className={styles.colorList}>
                  {state.brandColors.map((color) => (
                    <div key={color} className={styles.colorChip}>
                      <span
                        className={styles.chipSwatch}
                        style={{ background: color }}
                      />
                      <span className={styles.chipHex}>{color}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeColor(color)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vibes */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>{t.vibes}</div>
          <div className={styles.hint}>{t.vibesHint}</div>
          <div className={styles.vibeGrid}>
            {t.vibeOptions.map((vibe) => (
              <ChoiceButton
                key={vibe}
                selected={state.vibes.includes(vibe)}
                onClick={() => toggleVibe(vibe)}
              >
                {vibe}
              </ChoiceButton>
            ))}
          </div>
        </div>

        {/* Inspiration */}
        <InspirationInput
          t={t}
          inspirations={state.inspirations}
          onChange={(val) => setField('inspirations', val)}
        />
      </div>
    </div>
  );
}
