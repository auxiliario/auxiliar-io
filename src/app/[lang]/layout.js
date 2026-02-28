import { getTranslations, t } from '../../lib/i18n';
import { AuthProvider } from '../../lib/auth';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import MobileBar from '../../components/layout/MobileBar';

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

  const homeLabel = t(common, 'sectionNav.home');

  // Nav links per page — keyed by route segment
  const navConfig = {
    service: [
      { label: homeLabel, href: '#top', icon: 'home' },
      { label: t(common, 'sectionNav.guarantees'), href: '#guarantees', icon: 'shieldCheck' },
      { label: t(common, 'sectionNav.pricing'), href: '#pricing', icon: 'tag' },
      { label: t(common, 'sectionNav.howItWorks'), href: '#how-it-works', icon: 'listOrdered' },
      { label: t(common, 'sectionNav.portfolioPreview'), href: '#portfolio', icon: 'layoutGrid' },
    ],
    'social-economy': [
      { label: homeLabel, href: `/${lang}`, icon: 'home' },
      { label: t(common, 'sectionNav.howItWorks'), href: '#how-it-works', icon: 'listOrdered' },
      { label: t(common, 'sectionNav.whoThisIsFor'), href: '#who-this-is-for', icon: 'users' },
      { label: t(common, 'sectionNav.waitlist'), href: '#waitlist', icon: 'clipboardList' },
    ],
    portfolio: [
      { label: homeLabel, href: `/${lang}`, icon: 'home' },
      { label: t(common, 'sectionNav.all'), href: '#all', icon: 'grid' },
      { label: t(common, 'sectionNav.basic'), href: '#basic', icon: 'circle' },
      { label: t(common, 'sectionNav.standard'), href: '#standard', icon: 'circleDot' },
      { label: t(common, 'sectionNav.advanced'), href: '#advanced', icon: 'star' },
      { label: t(common, 'sectionNav.socialEconomy'), href: '#social-economy', icon: 'heart' },
    ],
    start: [],
    login: [],
    dashboard: [],
    terms: [],
  };

  return (
    <AuthProvider>
      <Header lang={lang} navConfig={navConfig} a11y={common.accessibility} authT={common.authMenu} />
      <main>{children}</main>
      <MobileBar lang={lang} />
      <Footer lang={lang} translations={common.footer} />
    </AuthProvider>
  );
}
