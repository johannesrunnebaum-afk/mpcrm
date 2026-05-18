-- Demo seed data for mpcrm
-- Run this AFTER the schema and RLS migrations

INSERT INTO customers (id, name, initials, color, plan, mrr, health_score, status, renewal_date, last_login, users_count, campaigns, projects, nps, industry) VALUES
(1, 'TechVision GmbH', 'TV', '#7C3AED', 'Business', 4200, 87, 'Aktiv', '2026-09-15', '2026-05-12', 24, 8, 12, 9, 'Software'),
(2, 'Retail Pro AG', 'RP', '#2563EB', 'Pro', 1800, 62, 'Gefährdet', '2026-06-01', '2026-04-28', 8, 3, 4, 6, 'Handel'),
(3, 'Medianova GmbH', 'MN', '#059669', 'Starter', 490, 91, 'Aktiv', '2026-07-22', '2026-05-15', 3, 2, 1, 8, 'Medien'),
(4, 'FinanzPlus KG', 'FP', '#DC2626', 'Pro', 2100, 34, 'Gefährdet', '2026-05-28', '2026-04-10', 12, 1, 3, 4, 'Finanzen'),
(5, 'LogiKom AG', 'LK', '#D97706', 'Business', 3600, 78, 'Aktiv', '2026-10-05', '2026-05-14', 18, 5, 9, 7, 'Logistik')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contacts (customer_id, name, role, email, phone, initials, color, last_contact) VALUES
(1, 'Anna Weber', 'CEO', 'a.weber@techvision.de', '+49 151 12345678', 'AW', '#7C3AED', '2026-05-10'),
(1, 'Markus Scholl', 'CTO', 'm.scholl@techvision.de', '+49 151 87654321', 'MS', '#2563EB', '2026-05-08'),
(2, 'Sandra Braun', 'Head of Marketing', 's.braun@retailpro.de', '+49 160 11223344', 'SB', '#059669', '2026-04-25'),
(3, 'Oliver Koch', 'CEO', 'o.koch@medianova.de', '+49 170 55667788', 'OK', '#DC2626', '2026-05-15'),
(4, 'Julia Meier', 'CFO', 'j.meier@finanzplus.de', '+49 176 99887766', 'JM', '#D97706', '2026-04-08'),
(5, 'Thomas Ritter', 'Operations Manager', 't.ritter@logikom.de', '+49 151 44556677', 'TR', '#7C3AED', '2026-05-13')
ON CONFLICT DO NOTHING;

INSERT INTO activities (customer_id, type, text, user_name, initials, color, created_at) VALUES
(1, 'call', 'Quarterly Review Call — sehr positives Feedback zum neuen Dashboard', 'Lisa M.', 'LM', '#7C3AED', '2026-05-12 10:30:00+00'),
(2, 'email', 'Churn-Risiko besprochen, Eskalation an CSM-Lead', 'Tom K.', 'TK', '#DC2626', '2026-05-11 14:15:00+00'),
(3, 'note', 'Kunde möchte Enterprise-Plan evaluieren — Termin für Demo vereinbaren', 'Lisa M.', 'LM', '#059669', '2026-05-15 09:00:00+00'),
(4, 'call', 'Support-Ticket eskaliert — technische Probleme beim Import', 'Tom K.', 'TK', '#D97706', '2026-05-10 16:45:00+00'),
(5, 'email', 'NPS-Umfrage versendet', 'System', 'SY', '#6B6B6B', '2026-05-14 08:00:00+00')
ON CONFLICT DO NOTHING;

INSERT INTO onboarding (customer_id, phase, steps) VALUES
(1, 'Abgeschlossen', '[{"name":"Kickoff Call","done":true},{"name":"Datenmigration","done":true},{"name":"User-Schulung","done":true},{"name":"Go-Live","done":true}]'),
(2, 'In Bearbeitung', '[{"name":"Kickoff Call","done":true},{"name":"Datenmigration","done":true},{"name":"User-Schulung","done":false},{"name":"Go-Live","done":false}]'),
(3, 'Abgeschlossen', '[{"name":"Kickoff Call","done":true},{"name":"Setup","done":true},{"name":"Go-Live","done":true}]'),
(4, 'In Bearbeitung', '[{"name":"Kickoff Call","done":true},{"name":"Datenmigration","done":false},{"name":"User-Schulung","done":false},{"name":"Go-Live","done":false}]'),
(5, 'Geplant', '[{"name":"Kickoff Call","done":false},{"name":"Datenmigration","done":false},{"name":"User-Schulung","done":false},{"name":"Go-Live","done":false}]')
ON CONFLICT (customer_id) DO NOTHING;
