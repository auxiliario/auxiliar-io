import { redirect } from 'next/navigation';
import { getTranslations } from '../../../lib/i18n';
import { createServerSupabaseClient } from '../../../lib/supabase-server';
import LoginForm from '../../../components/auth/LoginForm';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: common.login?.title || 'Sign in',
  };
}

export default async function LoginPage({ params }) {
  const { lang } = await params;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect(`/${lang}/start`);
  }

  const common = getTranslations(lang, 'common');
  return <LoginForm lang={lang} t={common.login} />;
}
