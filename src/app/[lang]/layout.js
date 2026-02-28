import { getTranslations, t } from '../../lib/i18n';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }, { lang: 'es' }];
}

const LOCALE_MAP = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' };

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    description: t(common, 'meta.siteDescription'),
    openGraph: {
      locale: LOCALE_MAP[lang] || 'en_US',
      description: t(common, 'meta.siteDescription'),
    },
    other: { lang },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');

  // Nav links per page — keyed by route segment
  const navConfig = {
    service: [
      { label: t(common, 'sectionNav.guarantees'), href: '#guarantees' },
      { label: t(common, 'sectionNav.pricing'), href: '#pricing' },
      { label: t(common, 'sectionNav.howItWorks'), href: '#how-it-works' },
      { label: t(common, 'sectionNav.portfolioPreview'), href: '#portfolio' },
    ],
    'social-economy': [
      { label: t(common, 'sectionNav.howItWorks'), href: '#how-it-works' },
      { label: t(common, 'sectionNav.whoThisIsFor'), href: '#who-this-is-for' },
      { label: t(common, 'sectionNav.waitlist'), href: '#waitlist' },
    ],
    portfolio: [
      { label: t(common, 'sectionNav.all'), href: '#all' },
      { label: t(common, 'sectionNav.basic'), href: '#basic' },
      { label: t(common, 'sectionNav.standard'), href: '#standard' },
      { label: t(common, 'sectionNav.advanced'), href: '#advanced' },
      { label: t(common, 'sectionNav.socialEconomy'), href: '#social-economy' },
    ],
    start: [],
    login: [],
    terms: [],
  };

  return (
    <>
      <Header lang={lang} navConfig={navConfig} a11y={common.accessibility} />
      <main>{children}</main>
      <Footer lang={lang} translations={common.footer} />
    </>
  );
}
