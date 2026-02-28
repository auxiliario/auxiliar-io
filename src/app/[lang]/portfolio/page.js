import { getTranslations, t } from '../../../lib/i18n';
import PortfolioGrid from '../../../components/portfolio/PortfolioGrid';
import styles from './portfolio.module.css';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'pages.portfolio.title'),
    description: t(common, 'pages.portfolio.subtitle'),
    openGraph: {
      title: `${t(common, 'pages.portfolio.title')} | Auxiliar.io`,
      description: t(common, 'pages.portfolio.subtitle'),
    },
  };
}

export default async function PortfolioPage({ params }) {
  const { lang } = await params;
  const p = getTranslations(lang, 'portfolio');

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>{p.title}</h1>
        <p className={styles.subtitle}>{p.subtitle}</p>
      </section>

      <section className={styles.content}>
        <PortfolioGrid
          projects={p.projects}
          filters={p.filters}
          labels={p.labels}
        />
      </section>
    </div>
  );
}
