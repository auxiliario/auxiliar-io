import { getTranslations, t } from '../../../lib/i18n';
import SocialEconomyClient from '../../../components/social/SocialEconomyClient';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'pages.socialEconomy.title'),
    description: t(common, 'pages.socialEconomy.subtitle'),
    openGraph: {
      title: `${t(common, 'pages.socialEconomy.title')} | Auxiliar.io`,
      description: t(common, 'pages.socialEconomy.subtitle'),
    },
  };
}

export default async function SocialEconomyPage({ params }) {
  const { lang } = await params;
  const s = getTranslations(lang, 'social');

  return <SocialEconomyClient lang={lang} s={s} />;
}
