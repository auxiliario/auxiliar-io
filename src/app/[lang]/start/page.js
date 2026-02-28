import { redirect } from 'next/navigation';
import { getTranslations, t } from '../../../lib/i18n';
import { createServerSupabaseClient } from '../../../lib/supabase-server';
import WizardShell from '../../../components/wizard/WizardShell';
import SubmissionsList from '../../../components/wizard/SubmissionsList';

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

function hydrateState(submission, files) {
  const state = {};

  // Spread step data into flat state
  for (let i = 1; i <= 5; i++) {
    const stepData = submission[`step${i}_data`];
    if (stepData && typeof stepData === 'object') {
      Object.assign(state, stepData);
    }
  }

  // Restore step number
  state.step = submission.current_step || 1;

  // Map files from DB back into state shape
  const logoFiles = [];
  const faviconFiles = [];
  const autoFiles = [];
  const sectionFiles = {}; // { pageName: { sectionName: [...] } }

  (files || []).forEach((f) => {
    const entry = {
      name: f.file_name,
      size: null,
      storagePath: f.storage_path,
      fileId: f.id,
      uploaded: true,
      description: f.description || '',
    };

    switch (f.category) {
      case 'logo':
        logoFiles.push(entry);
        break;
      case 'favicon':
        faviconFiles.push(entry);
        break;
      case 'auto':
        autoFiles.push(entry);
        break;
      case 'section': {
        const meta = f.metadata || {};
        const page = meta.page;
        const section = meta.section;
        if (page && section) {
          if (!sectionFiles[page]) sectionFiles[page] = {};
          if (!sectionFiles[page][section]) sectionFiles[page][section] = [];
          sectionFiles[page][section].push(entry);
        }
        break;
      }
    }
  });

  if (logoFiles.length > 0) state.logoFiles = logoFiles;
  if (faviconFiles.length > 0) state.faviconFiles = faviconFiles;
  if (autoFiles.length > 0) state.autoFiles = autoFiles;

  // Merge section files into pageDetails
  if (state.pageDetails && Object.keys(sectionFiles).length > 0) {
    for (const [page, sections] of Object.entries(sectionFiles)) {
      if (state.pageDetails[page]?.sections) {
        for (const [section, fileList] of Object.entries(sections)) {
          if (state.pageDetails[page].sections[section]) {
            const existing = state.pageDetails[page].sections[section].files || [];
            state.pageDetails[page].sections[section].files = [...existing, ...fileList];
          }
        }
      }
    }
  }

  return state;
}

export default async function StartPage({ params, searchParams }) {
  const { lang } = await params;
  const sp = await searchParams;
  const wizard = getTranslations(lang, 'wizard');
  const common = getTranslations(lang, 'common');

  // If Supabase isn't configured, render wizard without auth (dev mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <WizardShell lang={lang} t={wizard} />;
  }

  // Auth gate
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const userId = user.id;

  // ?new=1 → create new submission
  if (sp?.new === '1') {
    const { data: newSub, error } = await supabase
      .from('submissions')
      .insert({ user_id: userId, current_step: 1, status: 'in_progress' })
      .select('id')
      .single();
    if (error) throw error;
    return (
      <WizardShell
        lang={lang}
        t={wizard}
        userId={userId}
        submissionId={newSub.id}
      />
    );
  }

  // ?id=xxx → load specific submission
  if (sp?.id) {
    const { data: sub } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', sp.id)
      .eq('user_id', userId)
      .single();

    if (!sub) redirect(`/${lang}/start`);

    const { data: files } = await supabase
      .from('files')
      .select('*')
      .eq('submission_id', sub.id);

    const initialState = hydrateState(sub, files);
    return (
      <WizardShell
        lang={lang}
        t={wizard}
        userId={userId}
        submissionId={sub.id}
        initialState={initialState}
      />
    );
  }

  // Default: list submissions or create first one
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id, status, current_step, step1_data, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (!submissions || submissions.length === 0) {
    // No submissions yet — create one and show wizard
    const { data: newSub, error } = await supabase
      .from('submissions')
      .insert({ user_id: userId, current_step: 1, status: 'in_progress' })
      .select('id')
      .single();
    if (error) throw error;
    return (
      <WizardShell
        lang={lang}
        t={wizard}
        userId={userId}
        submissionId={newSub.id}
      />
    );
  }

  // Has submissions → show list
  return (
    <SubmissionsList
      lang={lang}
      t={common.submissions}
      submissions={submissions}
    />
  );
}
