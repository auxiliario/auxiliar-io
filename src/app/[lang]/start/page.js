import { getTranslations, t } from '../../../lib/i18n';
import WizardShell from '../../../components/wizard/WizardShell';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'pages.start.title'),
    description: t(common, 'pages.start.subtitle'),
    openGraph: {
      title: `${t(common, 'pages.start.title')} | Auxiliar.io`,
      description: t(common, 'pages.start.subtitle'),
    },
  };
}

export default async function StartPage({ params }) {
  const { lang } = await params;
  const wizard = getTranslations(lang, 'wizard');

  return <WizardShell lang={lang} t={wizard} />;
}
