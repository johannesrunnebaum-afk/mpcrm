-- Seed data matching the original hardcoded demo data.
-- Run after applying migrations.

-- ─── CUSTOMERS ───────────────────────────────────────────────────────────────
INSERT INTO customers (id, name, initials, color, plan, mrr, health_score, status, renewal_date, last_login, users_count, campaigns, projects, nps, industry) VALUES
(1, 'Aufwind GmbH',          'AG', '#7C3AED', 'Pro',      299, 92, 'Aktiv',     '2026-12-01', '2026-05-08', 8,  3, 2, 9,  'Marketing'),
(2, 'Thorge Storch Events',  'TS', '#059669', 'Starter',   99, 45, 'Gefährdet', '2026-06-15', '2026-04-20', 2,  1, 1, 6,  'Events'),
(3, 'Kreativ Studio',        'KS', '#D97706', 'Pro',      299, 78, 'Aktiv',     '2026-09-30', '2026-05-06', 5,  2, 3, 8,  'Design'),
(4, 'MediaHouse Berlin',     'MB', '#DC2626', 'Business', 599, 23, 'Gefährdet', '2026-07-01', '2026-04-10', 12, 0, 1, 3,  'Medien'),
(5, 'Marketingwerk',         'MW', '#0284C7', 'Pro',      299, 88, 'Aktiv',     '2027-01-15', '2026-05-07', 6,  4, 2, 9,  'Marketing'),
(6, 'Digital Spark',         'DS', '#DB2777', 'Starter',   99, 65, 'Aktiv',     '2026-11-01', '2026-05-05', 3,  1, 1, 7,  'Agentur'),
(7, 'Brand Force',           'BF', '#6D28D9', 'Business', 599, 31, 'Gefährdet', '2026-06-30', '2026-04-25', 9,  1, 2, 4,  'Branding'),
(8, 'Pixelwerk GmbH',        'PW', '#059669', 'Business', 599, 95, 'Aktiv',     '2027-03-01', '2026-05-08', 15, 5, 4, 10, 'Design');

-- Reset sequence after explicit ID inserts
SELECT setval(pg_get_serial_sequence('customers', 'id'), (SELECT MAX(id) FROM customers));

-- ─── CONTACTS ────────────────────────────────────────────────────────────────
INSERT INTO contacts (id, customer_id, name, role, email, phone, initials, color, last_contact) VALUES
(1, 1, 'Johannes Runnebaum', 'Marketing Manager',  'j.runnebaum@aufwind.de',        '+49 421 123456',  'JR',  '#F59E0B', '2026-05-08'),
(2, 1, 'Lisa Hoffmann',      'CMO',                'l.hoffmann@aufwind.de',          '+49 421 123457',  'LH',  '#7C3AED', '2026-04-30'),
(3, 2, 'Thorge Storch',      'Geschäftsführer',    't.storch@events.de',             '+49 4261 987654', 'TS',  '#059669', '2026-04-20'),
(4, 3, 'Maria Schmidt',      'Art Director',       'm.schmidt@kreativ.de',           '+49 30 556677',   'MS',  '#D97706', '2026-05-06'),
(5, 4, 'Klaus Berger',       'CEO',                'k.berger@mediahouse.de',         '+49 30 112233',   'KB',  '#DC2626', '2026-04-10'),
(6, 5, 'Anna Weber',         'Marketing Leiterin', 'a.weber@marketingwerk.de',       '+49 89 334455',   'AW',  '#0284C7', '2026-05-07'),
(7, 6, 'Tom Schneider',      'Gründer',            't.schneider@digitalspark.de',    '+49 40 667788',   'TS2', '#DB2777', '2026-05-05'),
(8, 7, 'Julia Braun',        'Brand Manager',      'j.braun@brandforce.de',          '+49 69 778899',   'JB',  '#6D28D9', '2026-04-25'),
(9, 8, 'Markus Klein',       'Geschäftsführer',    'm.klein@pixelwerk.de',           '+49 221 889900',  'MK',  '#059669', '2026-05-08');

SELECT setval(pg_get_serial_sequence('contacts', 'id'), (SELECT MAX(id) FROM contacts));

-- ─── ACTIVITIES ──────────────────────────────────────────────────────────────
INSERT INTO activities (id, customer_id, type, text, user_name, initials, color, created_at) VALUES
(1, 1, 'system', 'Kampagne "Social Ad Campaign" auf Abgeschlossen gesetzt', 'Johannes Runnebaum', 'JR', '#F59E0B', '2026-05-08 14:23:00+00'),
(2, 5, 'email',  'Renewal-E-Mail für 2027 gesendet',                        'CS Team',            'CS', '#7C3AED', '2026-05-07 10:15:00+00'),
(3, 2, 'call',   'Checkout-Call – Nutzung besprochen, Reaktivierung offen', 'Sarah Mueller',      'SM', '#059669', '2026-05-06 11:00:00+00'),
(4, 4, 'note',   'Kunde antwortet nicht – Churn-Risiko sehr hoch',          'Max Richter',        'MR', '#DC2626', '2026-05-05 16:40:00+00'),
(5, 8, 'system', 'Onboarding abgeschlossen – alle 4 Schritte erledigt',    'System',             'SY', '#059669', '2026-05-03 09:00:00+00'),
(6, 7, 'email',  'Renewal-Erinnerung versendet (52 Tage)',                  'CS Team',            'CS', '#7C3AED', '2026-05-02 08:30:00+00'),
(7, 3, 'call',   'QBR-Call – NPS 8, Upsell auf Business besprochen',       'Sarah Mueller',      'SM', '#059669', '2026-05-01 13:00:00+00'),
(8, 1, 'note',   'Feature-Wunsch: Kalender-Integration für Q3',             'Johannes Runnebaum', 'JR', '#F59E0B', '2026-04-30 15:45:00+00');

SELECT setval(pg_get_serial_sequence('activities', 'id'), (SELECT MAX(id) FROM activities));

-- ─── ONBOARDING ──────────────────────────────────────────────────────────────
INSERT INTO onboarding (id, customer_id, phase, steps) VALUES
(1, 1, 'Abgeschlossen',  '[{"name":"Kickoff-Call","done":true},{"name":"Setup-Check","done":true},{"name":"Training","done":true},{"name":"30-Tage-Review","done":true}]'),
(2, 8, 'Abgeschlossen',  '[{"name":"Kickoff-Call","done":true},{"name":"Setup-Check","done":true},{"name":"Training","done":true},{"name":"30-Tage-Review","done":true}]'),
(3, 5, 'Training',       '[{"name":"Kickoff-Call","done":true},{"name":"Setup-Check","done":true},{"name":"Training","done":false},{"name":"30-Tage-Review","done":false}]'),
(4, 3, 'Setup läuft',    '[{"name":"Kickoff-Call","done":true},{"name":"Setup-Check","done":false},{"name":"Training","done":false},{"name":"30-Tage-Review","done":false}]'),
(5, 6, 'Kickoff geplant','[{"name":"Kickoff-Call","done":false},{"name":"Setup-Check","done":false},{"name":"Training","done":false},{"name":"30-Tage-Review","done":false}]'),
(6, 2, 'Neu',            '[{"name":"Kickoff-Call","done":false},{"name":"Setup-Check","done":false},{"name":"Training","done":false},{"name":"30-Tage-Review","done":false}]'),
(7, 7, 'Neu',            '[{"name":"Kickoff-Call","done":false},{"name":"Setup-Check","done":false},{"name":"Training","done":false},{"name":"30-Tage-Review","done":false}]'),
(8, 4, 'Kickoff geplant','[{"name":"Kickoff-Call","done":false},{"name":"Setup-Check","done":false},{"name":"Training","done":false},{"name":"30-Tage-Review","done":false}]');

SELECT setval(pg_get_serial_sequence('onboarding', 'id'), (SELECT MAX(id) FROM onboarding));
