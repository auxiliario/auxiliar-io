import { redirect } from 'next/navigation';
import { getTranslations, t } from '../../../lib/i18n';
import { createServerSupabaseClient } from '../../../lib/supabase-server';
import DashboardList from '../../../components/dashboard/DashboardList';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'dashboard.title') || 'Dashboard',
  };
}

export default async function DashboardPage({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect(`/${lang}/login`);
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const { data: submissions } = await supabase
    .from('submissions')
    .select('id, status, current_step, step1_data, quote_amount, tier, lang, draft_url, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <DashboardList
      lang={lang}
      t={common.dashboard}
      submissions={submissions || []}
    />
  );
}
