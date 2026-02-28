import { getTranslations, t } from '../../../lib/i18n';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'pages.terms.title'),
    description: t(common, 'pages.terms.subtitle'),
    openGraph: {
      title: `${t(common, 'pages.terms.title')} | Auxiliar.io`,
      description: t(common, 'pages.terms.subtitle'),
    },
  };
}

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');

  return (
    <div>
      <h1>{t(common, 'pages.terms.title')}</h1>
      <p>{t(common, 'pages.terms.subtitle')}</p>
    </div>
  );
}
