'use client';

import { useState } from 'react';
import { uploadFile, deleteFile } from '../../lib/submissions';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import UploadZone from '../ui/UploadZone';
import styles from './Step4Site.module.css';
import shellStyles from './WizardShell.module.css';

export default function Step4Site({ t, state, setField, userId, submissionId }) {
  const [customPageName, setCustomPageName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [modalPage, setModalPage] = useState(null);

  // ─── Helpers ───

  function getPageName(page) {
    return typeof page === 'object' ? page.name : page;
  }

  function getSections(pageName) {
    if (t.pageSections && t.pageSections[pageName]) {
      return t.pageSections[pageName];
    }
    return [t.customPageDefaultSection || 'Content'];
  }

  function pageHasContent(pageName) {
    const detail = state.pageDetails[pageName];
    if (!detail) return false;
    if (detail.notes) return true;
    const sections = detail.sections || {};
    return Object.values(sections).some(
      (s) => (s.text && s.text.trim()) || (s.files && s.files.length > 0)
    );
  }

  // ─── Path A: Auto ───

  async function addAutoFile(files) {
    if (!userId || !submissionId) {
      const newEntries = files.map((f) => ({ file: f, description: '' }));
      setField('autoFiles', [...state.autoFiles, ...newEntries]);
      return;
    }

    for (const file of files) {
      const placeholder = { name: file.name, size: file.size, description: '', uploading: true };
      setField('autoFiles', [...state.autoFiles, placeholder]);

      try {
        const { id, storagePath } = await uploadFile({
          userId,
          submissionId,
          file,
          category: 'auto',
        });
        setField('autoFiles',
          state.autoFiles
            .filter((f) => f !== placeholder)
            .concat({ name: file.name, size: file.size, storagePath, fileId: id, uploaded: true, description: '' })
        );
      } catch (err) {
        console.error('Upload failed:', err);
        setField('autoFiles', state.autoFiles.filter((f) => f !== placeholder));
      }
    }
  }

  function setAutoFileDesc(index, desc) {
    const updated = state.autoFiles.map((item, i) =>
      i === index ? { ...item, description: desc } : item
    );
    setField('autoFiles', updated);
  }

  async function removeAutoFile(index) {
    const file = state.autoFiles[index];
    if (file?.uploaded && file.fileId) {
      await deleteFile(file.fileId, file.storagePath).catch(() => {});
    }
    setField('autoFiles', state.autoFiles.filter((_, i) => i !== index));
  }

  // ─── Path B: Manual ───

  function initPageDetails(pageName) {
    const sections = getSections(pageName);
    const sectionData = {};
    sections.forEach((s) => {
      sectionData[s] = { text: '', files: [] };
    });
    return { sections: sectionData, notes: '' };
  }

  function selectPage(pageName) {
    if (state.selectedPages.includes(pageName)) return;
    setField('selectedPages', [...state.selectedPages, pageName]);
    setField('pageDetails', {
      ...state.pageDetails,
      [pageName]: initPageDetails(pageName),
    });
  }

  function deselectPage(pageName) {
    setField('selectedPages', state.selectedPages.filter((p) => p !== pageName));
    const details = { ...state.pageDetails };
    delete details[pageName];
    setField('pageDetails', details);
  }

  function handleCardClick(pageName) {
    const isSelected = state.selectedPages.includes(pageName);
    if (!isSelected) {
      selectPage(pageName);
      setModalPage(pageName);
    } else {
      setModalPage(pageName);
    }
  }

  function addCustomPage() {
    const name = customPageName.trim();
    if (!name || state.customPages.includes(name)) return;
    setField('customPages', [...state.customPages, name]);
    setField('selectedPages', [...state.selectedPages, name]);
    setField('pageDetails', {
      ...state.pageDetails,
      [name]: initPageDetails(name),
    });
    setCustomPageName('');
    setShowCustomInput(false);
    setModalPage(name);
  }

  function removePageFromModal() {
    const page = modalPage;
    setModalPage(null);
    setField('customPages', (state.customPages || []).filter((p) => p !== page));
    setField('selectedPages', state.selectedPages.filter((p) => p !== page));
    const details = { ...state.pageDetails };
    delete details[page];
    setField('pageDetails', details);
  }

  function setSectionText(page, section, text) {
    const pageData = state.pageDetails[page] || { sections: {}, notes: '' };
    setField('pageDetails', {
      ...state.pageDetails,
      [page]: {
        ...pageData,
        sections: {
          ...pageData.sections,
          [section]: { ...pageData.sections?.[section], text },
        },
      },
    });
  }

  async function addSectionFiles(page, section, files) {
    const pageData = state.pageDetails[page] || { sections: {}, notes: '' };
    const current = pageData.sections?.[section]?.files || [];

    if (!userId || !submissionId) {
      const newFiles = files.map((f) => ({ file: f, description: '' }));
      setField('pageDetails', {
        ...state.pageDetails,
        [page]: {
          ...pageData,
          sections: {
            ...pageData.sections,
            [section]: {
              ...pageData.sections?.[section],
              files: [...current, ...newFiles],
            },
          },
        },
      });
      return;
    }

    for (const file of files) {
      try {
        const { id, storagePath } = await uploadFile({
          userId,
          submissionId,
          file,
          category: 'section',
          metadata: { page, section },
        });
        const entry = { name: file.name, size: file.size, storagePath, fileId: id, uploaded: true, description: '' };
        const freshPageData = state.pageDetails[page] || { sections: {}, notes: '' };
        const freshFiles = freshPageData.sections?.[section]?.files || [];
        setField('pageDetails', {
          ...state.pageDetails,
          [page]: {
            ...freshPageData,
            sections: {
              ...freshPageData.sections,
              [section]: {
                ...freshPageData.sections?.[section],
                files: [...freshFiles, entry],
              },
            },
          },
        });
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  }

  function setSectionFileDesc(page, section, fileIndex, desc) {
    const pageData = state.pageDetails[page] || { sections: {}, notes: '' };
    const files = (pageData.sections?.[section]?.files || []).map((f, i) =>
      i === fileIndex ? { ...f, description: desc } : f
    );
    setField('pageDetails', {
      ...state.pageDetails,
      [page]: {
        ...pageData,
        sections: {
          ...pageData.sections,
          [section]: { ...pageData.sections?.[section], files },
        },
      },
    });
  }

  async function removeSectionFile(page, section, index) {
    const pageData = state.pageDetails[page] || { sections: {}, notes: '' };
    const current = pageData.sections?.[section]?.files || [];
    const file = current[index];
    if (file?.uploaded && file.fileId) {
      await deleteFile(file.fileId, file.storagePath).catch(() => {});
    }
    setField('pageDetails', {
      ...state.pageDetails,
      [page]: {
        ...pageData,
        sections: {
          ...pageData.sections,
          [section]: {
            ...pageData.sections?.[section],
            files: current.filter((_, i) => i !== index),
          },
        },
      },
    });
  }

  function setPageNotes(page, notes) {
    const pageData = state.pageDetails[page] || { sections: {}, notes: '' };
    setField('pageDetails', {
      ...state.pageDetails,
      [page]: { ...pageData, notes },
    });
  }

  // ─── No path chosen yet ───
  if (!state.sitePath) {
    return (
      <div>
        <h2 className={shellStyles.stepTitle}>{t.title}</h2>
        <div className={styles.choiceGrid}>
          <button
            type="button"
            className={styles.choiceCard}
            onClick={() => setField('sitePath', 'auto')}
          >
            <span className={styles.choiceTitle}>{t.choiceAuto}</span>
            <span className={styles.choiceDesc}>{t.choiceAutoDesc}</span>
          </button>
          <button
            type="button"
            className={styles.choiceCard}
            onClick={() => setField('sitePath', 'manual')}
          >
            <span className={styles.choiceTitle}>{t.choiceManual}</span>
            <span className={styles.choiceDesc}>{t.choiceManualDesc}</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── Path A: Auto ───
  if (state.sitePath === 'auto') {
    return (
      <div>
        <h2 className={shellStyles.stepTitle}>{t.title}</h2>
        <div className={shellStyles.stepContent}>
          <button
            type="button"
            className={styles.pathSwitch}
            onClick={() => setField('sitePath', null)}
          >
            ← {t.choiceManual}
          </button>

          <UploadZone
            text={t.autoFiles}
            subtext={t.autoFilesHint}
            multiple
            onFiles={addAutoFile}
          />

          {state.autoFiles.length > 0 && (
            <div className={styles.fileList}>
              {state.autoFiles.map((item, i) => (
                <div key={i} className={styles.fileEntry}>
                  <div className={styles.fileHeader}>
                    <span className={styles.fileName}>
                      {item.name || (item.file && item.file.name)}
                      {item.uploading && ' ...'}
                    </span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeAutoFile(i)}
                    >
                      ×
                    </button>
                  </div>
                  <Input
                    label={t.autoFileWhat}
                    placeholder={t.autoFileWhatPlaceholder}
                    value={item.description}
                    onChange={(e) => setAutoFileDesc(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <Textarea
            label={t.autoNotes}
            placeholder={t.autoNotesPlaceholder}
            value={state.autoNotes}
            onChange={(e) => setField('autoNotes', e.target.value)}
            rows={4}
          />
        </div>
      </div>
    );
  }

  // ─── Path B: Manual ───
  const predefinedPages = t.pageOptions || [];
  const allCustomPages = state.customPages || [];

  return (
    <div>
      <h2 className={shellStyles.stepTitle}>{t.title}</h2>
      <div className={shellStyles.stepContent}>
        <button
          type="button"
          className={styles.pathSwitch}
          onClick={() => setField('sitePath', null)}
        >
          {t.changeChoice}
        </button>

        <div className={styles.fieldLabel}>{t.pages}</div>
        <div className={styles.hint}>{t.pagesHint}</div>

        {/* Page card grid */}
        <div className={styles.pageCardGrid}>
          {predefinedPages.map((page) => {
            const pageName = getPageName(page);
            const desc = typeof page === 'object' ? page.description : '';
            const isSelected = state.selectedPages.includes(pageName);
            const hasContent = pageHasContent(pageName);

            return (
              <button
                key={pageName}
                type="button"
                className={`${styles.pageCard} ${isSelected ? styles.pageCardSelected : ''}`}
                onClick={() => handleCardClick(pageName)}
              >
                <span className={styles.pageCardName}>{pageName}</span>
                {desc && <span className={styles.pageCardDesc}>{desc}</span>}
                {isSelected && hasContent && (
                  <span className={styles.contentBadge}>{t.contentAdded}</span>
                )}
              </button>
            );
          })}

          {/* Custom pages */}
          {allCustomPages.map((page) => {
            const isSelected = state.selectedPages.includes(page);
            const hasContent = pageHasContent(page);

            return (
              <button
                key={page}
                type="button"
                className={`${styles.pageCard} ${isSelected ? styles.pageCardSelected : ''}`}
                onClick={() => handleCardClick(page)}
              >
                <span className={styles.pageCardName}>{page}</span>
                {isSelected && hasContent && (
                  <span className={styles.contentBadge}>{t.contentAdded}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add custom page */}
        {!showCustomInput ? (
          <button
            type="button"
            className={styles.addCustomBtn}
            onClick={() => setShowCustomInput(true)}
          >
            {t.addCustomPage}
          </button>
        ) : (
          <div className={styles.addCustomRow}>
            <Input
              placeholder={t.customPagePlaceholder}
              value={customPageName}
              onChange={(e) => setCustomPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomPage();
                }
                if (e.key === 'Escape') {
                  setShowCustomInput(false);
                  setCustomPageName('');
                }
              }}
            />
            <Button variant="primary" size="sm" onClick={addCustomPage}>
              {t.customPageAdd}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomPageName('');
              }}
            >
              {t.customPageCancel}
            </Button>
          </div>
        )}

        {/* Decide the rest for me */}
        {state.selectedPages.length > 0 && (
          <Button
            className={styles.decideBtn}
            onClick={() => setField('sitePath', 'auto')}
          >
            {t.decideForMe}
          </Button>
        )}
      </div>

      {/* ─── Modal ─── */}
      {modalPage && (
        <div className={styles.overlay} onClick={() => setModalPage(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modalPage}</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setModalPage(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {t.modalIntro && (
                <p className={styles.modalIntro}>{t.modalIntro}</p>
              )}
              {getSections(modalPage).map((section) => {
                const sectionData =
                  state.pageDetails[modalPage]?.sections?.[section] || {
                    text: '',
                    files: [],
                  };
                const sectionLabel = t.sectionWhat
                  ? t.sectionWhat.replace('{section}', section)
                  : section;

                return (
                  <div key={section} className={styles.sectionBlock}>
                    <div className={styles.sectionTitle}>{section}</div>
                    <Textarea
                      label={sectionLabel}
                      placeholder={t.sectionWhatPlaceholder}
                      value={sectionData.text}
                      onChange={(e) =>
                        setSectionText(modalPage, section, e.target.value)
                      }
                      rows={3}
                    />
                    <UploadZone
                      text={t.sectionFiles}
                      subtext={t.sectionFilesHint}
                      multiple
                      onFiles={(files) =>
                        addSectionFiles(modalPage, section, files)
                      }
                    />
                    {sectionData.files.length > 0 && (
                      <div className={styles.fileList}>
                        {sectionData.files.map((f, i) => (
                          <div key={i} className={styles.fileEntry}>
                            <div className={styles.fileHeader}>
                              <span className={styles.fileName}>
                                {f.name || (f.file && f.file.name)}
                                {f.uploading && ' ...'}
                              </span>
                              <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() =>
                                  removeSectionFile(modalPage, section, i)
                                }
                              >
                                ×
                              </button>
                            </div>
                            <Input
                              label={t.fileWhat}
                              placeholder={t.fileWhatPlaceholder}
                              value={f.description || ''}
                              onChange={(e) =>
                                setSectionFileDesc(
                                  modalPage,
                                  section,
                                  i,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Anything else for this page */}
              <Textarea
                label={t.anythingElse}
                placeholder={t.anythingElsePlaceholder}
                value={state.pageDetails[modalPage]?.notes || ''}
                onChange={(e) => setPageNotes(modalPage, e.target.value)}
                rows={3}
              />
            </div>

            <div className={styles.modalFooter}>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePageFromModal}
              >
                {t.removePage}
              </Button>
              <Button size="sm" onClick={() => setModalPage(null)}>
                {t.saveModal}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
