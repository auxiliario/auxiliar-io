import { getTranslations, t } from '../../lib/i18n';
import Button from '../../components/ui/Button';
import PortfolioCard from '../../components/portfolio/PortfolioCard';
import styles from './service.module.css';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'pages.service.title'),
    description: t(common, 'pages.service.subtitle'),
    openGraph: {
      title: `${t(common, 'pages.service.title')} | Auxiliar.io`,
      description: t(common, 'pages.service.subtitle'),
    },
  };
}

export default async function ServicePage({ params }) {
  const { lang } = await params;
  const s = getTranslations(lang, 'service');
  const p = getTranslations(lang, 'portfolio');

  // Show first 3 projects as preview
  const previewProjects = p.projects.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <h1 className={styles.heroHeadline}>
          {s.hero.headline1}
          <br />
          <span className={styles.heroGradient}>{s.hero.headline2}</span>
          <br />
          {s.hero.headline3}{' '}
          <span className={styles.heroGradient}>{s.hero.headline4}</span>.
        </h1>
        <p className={styles.heroSubtitle}>{s.hero.subtitle}</p>
        <Button size="lg" href={`/${lang}/start`}>
          {s.hero.cta}
        </Button>
        <p className={styles.heroNote}>{s.hero.note}</p>
      </section>

      {/* ---- Guarantees ---- */}
      <section id="guarantees" className={styles.guarantees}>
        <h2 className={styles.sectionTitle}>{s.guarantees.title}</h2>
        <div className={styles.guaranteesGrid}>
          {s.guarantees.items.map((item, i) => (
            <div key={i} className={styles.guaranteeCard}>
              <div className={styles.guaranteeIcon}>{item.icon}</div>
              <div className={styles.guaranteeTitle}>{item.title}</div>
              <p className={styles.guaranteeDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section id="pricing" className={styles.pricing}>
        <h2 className={styles.sectionTitle}>{s.pricing.title}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.pricingTable}>
            <thead>
              <tr>
                <th></th>
                {s.pricing.tiers.map((tier) => (
                  <th
                    key={tier.name}
                    className={`${tier.highlight ? styles.highlightCol : ''} ${tier.highlight ? styles.highlightHeader : ''}`}
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['pages', 'languages', 'login', 'payment', 'booking', 'analytics', 'price'].map((row) => (
                <tr key={row}>
                  <td>{s.pricing.rows[row]}</td>
                  {s.pricing.tiers.map((tier) => (
                    <td
                      key={tier.name}
                      className={tier.highlight ? styles.highlightCol : ''}
                    >
                      {tier[row] === '\u2713' ? (
                        <span className={styles.checkmark}>&#10003;</span>
                      ) : (
                        tier[row]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className={styles.ctaRow}>
                <td></td>
                {s.pricing.tiers.map((tier) => (
                  <td key={tier.name} className={tier.highlight ? styles.highlightCol : ''}>
                    <Button
                      variant={tier.highlight ? 'primary' : 'secondary'}
                      full
                      href={`/${lang}/start`}
                    >
                      {s.pricing.cta}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how-it-works" className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>{s.howItWorks.title}</h2>
        <div className={styles.stepsGrid}>
          {s.howItWorks.steps.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Social Economy Banner ---- */}
      <section className={styles.socialBanner}>
        <div className={styles.socialCard}>
          <div className={styles.socialContent}>
            <h3 className={styles.socialTitle}>{s.socialBanner.title}</h3>
            <p className={styles.socialDesc}>{s.socialBanner.description}</p>
          </div>
          <Button variant="secondary" href={`/${lang}/social-economy`} style={{ flexShrink: 0 }}>
            {s.socialBanner.cta}
          </Button>
        </div>
      </section>

      {/* ---- Portfolio Preview ---- */}
      <section id="portfolio" className={styles.portfolioPreview}>
        <div className={styles.portfolioHeader}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
            {s.portfolioPreview.title}
          </h2>
          <a href={`/${lang}/portfolio`} className={styles.viewAll}>
            {s.portfolioPreview.viewAll}
          </a>
        </div>
        <div className={styles.portfolioGrid}>
          {previewProjects.map((project) => (
            <PortfolioCard
              key={project.name}
              project={project}
              labels={p.labels}
              compact
            />
          ))}
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalTitle}>{s.finalCta.title}</h2>
        <p className={styles.finalSubtitle}>{s.finalCta.subtitle}</p>
        <Button size="lg" href={`/${lang}/start`}>
          {s.finalCta.cta}
        </Button>
      </section>
    </div>
  );
}
