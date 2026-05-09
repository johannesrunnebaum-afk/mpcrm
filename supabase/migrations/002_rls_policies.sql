-- ─── Enable RLS ──────────────────────────────────────────────────────────────
ALTER TABLE customers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;

-- ─── CUSTOMERS ───────────────────────────────────────────────────────────────
CREATE POLICY "authenticated users can read customers"
  ON customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert customers"
  ON customers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update customers"
  ON customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete customers"
  ON customers FOR DELETE TO authenticated USING (true);

-- ─── CONTACTS ────────────────────────────────────────────────────────────────
CREATE POLICY "authenticated users can read contacts"
  ON contacts FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert contacts"
  ON contacts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update contacts"
  ON contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete contacts"
  ON contacts FOR DELETE TO authenticated USING (true);

-- ─── ACTIVITIES ──────────────────────────────────────────────────────────────
CREATE POLICY "authenticated users can read activities"
  ON activities FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert activities"
  ON activities FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update activities"
  ON activities FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete activities"
  ON activities FOR DELETE TO authenticated USING (true);

-- ─── ONBOARDING ──────────────────────────────────────────────────────────────
CREATE POLICY "authenticated users can read onboarding"
  ON onboarding FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated users can insert onboarding"
  ON onboarding FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated users can update onboarding"
  ON onboarding FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated users can delete onboarding"
  ON onboarding FOR DELETE TO authenticated USING (true);
