import { createClient } from './supabase';

// ─── Step data extraction ───

const STEP_FIELDS = {
  1: ['businessName', 'businessType', 'businessTypeOther', 'description', 'languages', 'primaryLanguage', 'hasDomain', 'domain', 'payment', 'login'],
  2: ['phone', 'email', 'address', 'hoursType', 'hoursRegular', 'hoursSeasonal', 'socials'],
  3: ['hasLogo', 'hasFavicon', 'brandColorPreference', 'brandColors', 'vibes', 'inspirations'],
  4: ['sitePath', 'autoNotes', 'selectedPages', 'customPages'],
  5: ['agreedToTerms'],
};

function extractStepData(state, step) {
  const fields = STEP_FIELDS[step];
  if (!fields) return {};
  const data = {};
  fields.forEach((f) => {
    if (state[f] !== undefined) data[f] = state[f];
  });
  // Step 4: include sanitized pageDetails
  if (step === 4) {
    data.pageDetails = sanitizePageDetails(state.pageDetails);
  }
  return data;
}

function sanitizePageDetails(pageDetails) {
  if (!pageDetails) return {};
  const clean = {};
  for (const [page, detail] of Object.entries(pageDetails)) {
    const cleanSections = {};
    if (detail.sections) {
      for (const [section, sData] of Object.entries(detail.sections)) {
        cleanSections[section] = {
          text: sData.text || '',
          files: (sData.files || []).map((f) => ({
            name: f.name || (f.file && f.file.name) || 'unknown',
            description: f.description || '',
            storagePath: f.storagePath || null,
            fileId: f.fileId || null,
          })),
        };
      }
    }
    clean[page] = { sections: cleanSections, notes: detail.notes || '' };
  }
  return clean;
}

// ─── Save a single step ───

export async function saveStep(submissionId, state, step) {
  const supabase = createClient();
  const data = extractStepData(state, step);
  const update = {
    [`step${step}_data`]: data,
    current_step: step,
  };
  const { error } = await supabase
    .from('submissions')
    .update(update)
    .eq('id', submissionId);
  if (error) console.error('saveStep error:', error);
}

// ─── Submit the wizard (save all + mark submitted) ───

export async function submitWizard(submissionId, state) {
  const supabase = createClient();
  const update = {
    step1_data: extractStepData(state, 1),
    step2_data: extractStepData(state, 2),
    step3_data: extractStepData(state, 3),
    step4_data: extractStepData(state, 4),
    step5_data: extractStepData(state, 5),
    current_step: 5,
    status: 'submitted',
  };
  const { error } = await supabase
    .from('submissions')
    .update(update)
    .eq('id', submissionId);
  if (error) throw error;
}

// ─── File upload ───

export async function uploadFile({ userId, submissionId, file, category, description, metadata }) {
  const supabase = createClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/${submissionId}/${timestamp}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(storagePath, file);
  if (uploadError) throw uploadError;

  const { data, error: dbError } = await supabase
    .from('files')
    .insert({
      submission_id: submissionId,
      storage_path: storagePath,
      file_name: file.name,
      category,
      description: description || null,
      metadata: metadata || {},
    })
    .select('id')
    .single();
  if (dbError) throw dbError;

  return { id: data.id, storagePath };
}

// ─── File deletion ───

export async function deleteFile(fileId, storagePath) {
  const supabase = createClient();
  if (storagePath) {
    await supabase.storage.from('uploads').remove([storagePath]);
  }
  const { error } = await supabase.from('files').delete().eq('id', fileId);
  if (error) console.error('deleteFile error:', error);
}
