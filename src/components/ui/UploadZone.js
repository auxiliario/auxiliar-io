'use client';

import { useRef, useState } from 'react';
import styles from './UploadZone.module.css';

export default function UploadZone({
  text = 'Click or drag to upload',
  subtext = '',
  accept,
  multiple = false,
  onFiles,
  className = '',
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFiles?.(files);
    e.target.value = '';
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) onFiles?.(files);
  }

  return (
    <div
      className={`${styles.zone} ${dragOver ? styles.dragOver : ''} ${className}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span className={styles.text}>{text}</span>
      {subtext && <span className={styles.subtext}>{subtext}</span>}
      <input
        ref={inputRef}
        type="file"
        className={styles.input}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </div>
  );
}
