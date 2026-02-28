'use client';

import styles from './ChoiceButton.module.css';

export default function ChoiceButton({
  children,
  selected = false,
  small = false,
  className = '',
  ...props
}) {
  const classes = [
    styles.button,
    selected && styles.selected,
    small && styles.sm,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
