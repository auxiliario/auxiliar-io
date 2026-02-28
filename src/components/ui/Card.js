import styles from './Card.module.css';

export default function Card({
  children,
  hoverable = false,
  className = '',
  style,
  ...props
}) {
  const classes = [
    styles.card,
    hoverable && styles.hoverable,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}
