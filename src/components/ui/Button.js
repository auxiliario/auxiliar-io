'use client';

import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  href,
  className = '',
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    full && styles.full,
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
