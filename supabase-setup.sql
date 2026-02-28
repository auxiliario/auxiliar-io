-- ============================================
-- Auxiliar.io — Supabase Database Setup
-- Run this in the Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Profiles (synced from auth.users)
-- ============================================

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 2. Submissions
-- ============================================

create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'in_progress' check (status in ('in_progress', 'submitted', 'evaluating', 'approved', 'declined', 'paid')),
  lang text default 'en',
  current_step integer default 1,
  step1_data jsonb default '{}',
  step2_data jsonb default '{}',
  step3_data jsonb default '{}',
  step4_data jsonb default '{}',
  step5_data jsonb default '{}',
  tier text,
  quote_amount numeric,
  draft_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.submissions enable row level security;

create policy "Users can view own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own submissions"
  on public.submissions for update
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger submissions_updated_at
  before update on public.submissions
  for each row execute function public.update_updated_at();

-- ============================================
-- 3. Files
-- ============================================

create table public.files (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  storage_path text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  category text not null check (category in ('logo', 'favicon', 'auto', 'section')),
  description text,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.files enable row level security;

create policy "Users can view own files"
  on public.files for select
  using (auth.uid() = user_id);

create policy "Users can insert own files"
  on public.files for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own files"
  on public.files for delete
  using (auth.uid() = user_id);

-- ============================================
-- 4. Storage Bucket Setup (MANUAL)
-- ============================================
-- Do these steps in the Supabase Dashboard:
--
-- 1. Go to Storage > New Bucket
-- 2. Name: "uploads"
-- 3. Set to PRIVATE (not public)
-- 4. Go to Storage > Policies for "uploads" bucket
-- 5. Add these RLS policies:
--
--    SELECT (read own files):
--      auth.uid()::text = (storage.foldername(name))[1]
--
--    INSERT (upload to own folder):
--      auth.uid()::text = (storage.foldername(name))[1]
--
--    DELETE (delete own files):
--      auth.uid()::text = (storage.foldername(name))[1]
--
-- File path convention: {user_id}/{submission_id}/{filename}
