'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './TooltipIcon.module.css';

export default function TooltipIcon({ text, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const popupRef = useRef(null);

  const positionPopup = useCallback(() => {
    if (!open || !wrapperRef.current || !popupRef.current) return;
    const trigger = wrapperRef.current.getBoundingClientRect();
    const popup = popupRef.current;
    const pw = popup.offsetWidth;

    // Position above the trigger, centered
    let left = trigger.left + trigger.width / 2 - pw / 2;
    let top = trigger.top - popup.offsetHeight - 8;

    // Clamp to viewport edges
    const margin = 12;
    if (left < margin) left = margin;
    if (left + pw > window.innerWidth - margin) left = window.innerWidth - margin - pw;

    // If would go above viewport, show below instead
    if (top < margin) {
      top = trigger.bottom + 8;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Position on open and on scroll/resize
    requestAnimationFrame(positionPopup);

    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('scroll', positionPopup, true);
    window.addEventListener('resize', positionPopup);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', positionPopup, true);
      window.removeEventListener('resize', positionPopup);
    };
  }, [open, positionPopup]);

  return (
    <span className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={ariaLabel || 'More info'}
      >
        ?
      </button>
      {open && (
        <div ref={popupRef} className={styles.popup}>
          {text}
        </div>
      )}
    </span>
  );
}
