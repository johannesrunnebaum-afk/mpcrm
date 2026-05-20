-- ─── Profiles table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            BIGINT PRIMARY KEY DEFAULT 1,
  first_name    TEXT NOT NULL DEFAULT 'Johannes',
  last_name     TEXT NOT NULL DEFAULT 'Runnebaum',
  email         TEXT NOT NULL DEFAULT 'johannes.runnebaum@gmail.com',
  role          TEXT NOT NULL DEFAULT 'Admin',
  initials      TEXT NOT NULL DEFAULT 'JR',
  avatar_color  TEXT NOT NULL DEFAULT '#F59E0B',
  avatar_url    TEXT,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Default row (single profile, no auth yet)
INSERT INTO profiles (id, first_name, last_name, email, role, initials, avatar_color)
VALUES (1, 'Johannes', 'Runnebaum', 'johannes.runnebaum@gmail.com', 'Admin', 'JR', '#F59E0B')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_profiles" ON profiles FOR ALL TO anon USING (true) WITH CHECK (true);

-- ─── Storage bucket for avatars ───────────────────────────────────────────────
-- Run this in Supabase Dashboard → Storage → New bucket:
--   Name: avatars
--   Public: yes
-- Then add this policy in Storage → avatars → Policies:
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "anon_upload_avatars" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "anon_update_avatars" ON storage.objects
  FOR UPDATE TO anon USING (bucket_id = 'avatars');

CREATE POLICY "public_read_avatars" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'avatars');
