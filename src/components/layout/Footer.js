import styles from './Footer.module.css';
import LangSwitcher from './LangSwitcher';

export default function Footer({ lang, translations }) {
  const t = translations;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <a href={`/${lang}`} className={styles.logo}>
            auxiliar.io
          </a>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} Auxiliar.io — {t.copyright}
          </span>
        </div>

        <nav className={styles.navLinks}>
          <a href={`/${lang}`} className={styles.link}>{t.service}</a>
          <a href={`/${lang}/portfolio`} className={styles.link}>{t.portfolio}</a>
          <a href={`/${lang}/social-economy`} className={styles.link}>{t.socialEconomy}</a>
          <a href={`/${lang}/start`} className={styles.link}>{t.contact}</a>
        </nav>

        <nav className={styles.legalLinks}>
          <a href={`/${lang}/terms`} className={styles.link}>{t.terms}</a>
          <a href={`/${lang}/terms`} className={styles.link}>{t.privacy}</a>
        </nav>

        <div className={styles.bottom}>
          <LangSwitcher lang={lang} />
        </div>
      </div>
    </footer>
  );
}
