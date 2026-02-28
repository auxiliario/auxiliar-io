import { redirect, notFound } from 'next/navigation';
import { getTranslations, t } from '../../../../lib/i18n';
import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import SubmissionDetail from '../../../../components/dashboard/SubmissionDetail';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const common = getTranslations(lang, 'common');
  return {
    title: t(common, 'dashboard.detailTitle') || 'Project details',
  };
}

export default async function DashboardDetailPage({ params }) {
  const { lang, id } = await params;
  const common = getTranslations(lang, 'common');
  const wizard = getTranslations(lang, 'wizard');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect(`/${lang}/login`);
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!submission) notFound();

  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('submission_id', id);

  return (
    <SubmissionDetail
      lang={lang}
      t={common.dashboard}
      wizardT={wizard}
      submission={submission}
      files={files || []}
    />
  );
}
