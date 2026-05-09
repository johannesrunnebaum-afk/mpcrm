import type { Customer, Contact, Activity, OnboardingEntry } from './types'

export const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Aufwind GmbH', initials: 'AG', color: '#7C3AED', plan: 'Pro', mrr: 299, health: 92, status: 'Aktiv', renewal: '2026-12-01', industry: 'Marketing', users: 8, lastLogin: '2026-05-08', campaigns: 3, projects: 2, nps: 9 },
  { id: 2, name: 'Thorge Storch Events', initials: 'TS', color: '#059669', plan: 'Starter', mrr: 99, health: 45, status: 'Gefährdet', renewal: '2026-06-15', industry: 'Events', users: 2, lastLogin: '2026-04-20', campaigns: 1, projects: 1, nps: 6 },
  { id: 3, name: 'Kreativ Studio', initials: 'KS', color: '#D97706', plan: 'Pro', mrr: 299, health: 78, status: 'Aktiv', renewal: '2026-09-30', industry: 'Design', users: 5, lastLogin: '2026-05-06', campaigns: 2, projects: 3, nps: 8 },
  { id: 4, name: 'MediaHouse Berlin', initials: 'MB', color: '#DC2626', plan: 'Business', mrr: 599, health: 23, status: 'Gefährdet', renewal: '2026-07-01', industry: 'Medien', users: 12, lastLogin: '2026-04-10', campaigns: 0, projects: 1, nps: 3 },
  { id: 5, name: 'Marketingwerk', initials: 'MW', color: '#0284C7', plan: 'Pro', mrr: 299, health: 88, status: 'Aktiv', renewal: '2027-01-15', industry: 'Marketing', users: 6, lastLogin: '2026-05-07', campaigns: 4, projects: 2, nps: 9 },
  { id: 6, name: 'Digital Spark', initials: 'DS', color: '#DB2777', plan: 'Starter', mrr: 99, health: 65, status: 'Aktiv', renewal: '2026-11-01', industry: 'Agentur', users: 3, lastLogin: '2026-05-05', campaigns: 1, projects: 1, nps: 7 },
  { id: 7, name: 'Brand Force', initials: 'BF', color: '#6D28D9', plan: 'Business', mrr: 599, health: 31, status: 'Gefährdet', renewal: '2026-06-30', industry: 'Branding', users: 9, lastLogin: '2026-04-25', campaigns: 1, projects: 2, nps: 4 },
  { id: 8, name: 'Pixelwerk GmbH', initials: 'PW', color: '#059669', plan: 'Business', mrr: 599, health: 95, status: 'Aktiv', renewal: '2027-03-01', industry: 'Design', users: 15, lastLogin: '2026-05-08', campaigns: 5, projects: 4, nps: 10 },
]

export const CONTACTS: Contact[] = [
  { id: 1, customerId: 1, name: 'Johannes Runnebaum', role: 'Marketing Manager', email: 'j.runnebaum@aufwind.de', phone: '+49 421 123456', initials: 'JR', color: '#F59E0B', lastContact: '2026-05-08' },
  { id: 2, customerId: 1, name: 'Lisa Hoffmann', role: 'CMO', email: 'l.hoffmann@aufwind.de', phone: '+49 421 123457', initials: 'LH', color: '#7C3AED', lastContact: '2026-04-30' },
  { id: 3, customerId: 2, name: 'Thorge Storch', role: 'Geschäftsführer', email: 't.storch@events.de', phone: '+49 4261 987654', initials: 'TS', color: '#059669', lastContact: '2026-04-20' },
  { id: 4, customerId: 3, name: 'Maria Schmidt', role: 'Art Director', email: 'm.schmidt@kreativ.de', phone: '+49 30 556677', initials: 'MS', color: '#D97706', lastContact: '2026-05-06' },
  { id: 5, customerId: 4, name: 'Klaus Berger', role: 'CEO', email: 'k.berger@mediahouse.de', phone: '+49 30 112233', initials: 'KB', color: '#DC2626', lastContact: '2026-04-10' },
  { id: 6, customerId: 5, name: 'Anna Weber', role: 'Marketing Leiterin', email: 'a.weber@marketingwerk.de', phone: '+49 89 334455', initials: 'AW', color: '#0284C7', lastContact: '2026-05-07' },
  { id: 7, customerId: 6, name: 'Tom Schneider', role: 'Gründer', email: 't.schneider@digitalspark.de', phone: '+49 40 667788', initials: 'TS2', color: '#DB2777', lastContact: '2026-05-05' },
  { id: 8, customerId: 7, name: 'Julia Braun', role: 'Brand Manager', email: 'j.braun@brandforce.de', phone: '+49 69 778899', initials: 'JB', color: '#6D28D9', lastContact: '2026-04-25' },
  { id: 9, customerId: 8, name: 'Markus Klein', role: 'Geschäftsführer', email: 'm.klein@pixelwerk.de', phone: '+49 221 889900', initials: 'MK', color: '#059669', lastContact: '2026-05-08' },
]

export const ACTIVITIES: Activity[] = [
  { id: 1, type: 'system', customerId: 1, text: 'Kampagne "Social Ad Campaign" auf Abgeschlossen gesetzt', user: 'Johannes Runnebaum', initials: 'JR', color: '#F59E0B', date: '2026-05-08', time: '14:23' },
  { id: 2, type: 'email', customerId: 5, text: 'Renewal-E-Mail für 2027 gesendet', user: 'CS Team', initials: 'CS', color: '#7C3AED', date: '2026-05-07', time: '10:15' },
  { id: 3, type: 'call', customerId: 2, text: 'Checkout-Call – Nutzung besprochen, Reaktivierung offen', user: 'Sarah Mueller', initials: 'SM', color: '#059669', date: '2026-05-06', time: '11:00' },
  { id: 4, type: 'note', customerId: 4, text: 'Kunde antwortet nicht – Churn-Risiko sehr hoch', user: 'Max Richter', initials: 'MR', color: '#DC2626', date: '2026-05-05', time: '16:40' },
  { id: 5, type: 'system', customerId: 8, text: 'Onboarding abgeschlossen – alle 4 Schritte erledigt', user: 'System', initials: 'SY', color: '#059669', date: '2026-05-03', time: '09:00' },
  { id: 6, type: 'email', customerId: 7, text: 'Renewal-Erinnerung versendet (52 Tage)', user: 'CS Team', initials: 'CS', color: '#7C3AED', date: '2026-05-02', time: '08:30' },
  { id: 7, type: 'call', customerId: 3, text: 'QBR-Call – NPS 8, Upsell auf Business besprochen', user: 'Sarah Mueller', initials: 'SM', color: '#059669', date: '2026-05-01', time: '13:00' },
  { id: 8, type: 'note', customerId: 1, text: 'Feature-Wunsch: Kalender-Integration für Q3', user: 'Johannes Runnebaum', initials: 'JR', color: '#F59E0B', date: '2026-04-30', time: '15:45' },
]

export const ONBOARDING_PHASES = ['Neu', 'Kickoff geplant', 'Setup läuft', 'Training', 'Abgeschlossen']

export const ONBOARDING_DATA: OnboardingEntry[] = [
  { id: 1, customerId: 1, phase: 'Abgeschlossen', steps: [{ name: 'Kickoff-Call', done: true }, { name: 'Setup-Check', done: true }, { name: 'Training', done: true }, { name: '30-Tage-Review', done: true }] },
  { id: 2, customerId: 8, phase: 'Abgeschlossen', steps: [{ name: 'Kickoff-Call', done: true }, { name: 'Setup-Check', done: true }, { name: 'Training', done: true }, { name: '30-Tage-Review', done: true }] },
  { id: 3, customerId: 5, phase: 'Training', steps: [{ name: 'Kickoff-Call', done: true }, { name: 'Setup-Check', done: true }, { name: 'Training', done: false }, { name: '30-Tage-Review', done: false }] },
  { id: 4, customerId: 3, phase: 'Setup läuft', steps: [{ name: 'Kickoff-Call', done: true }, { name: 'Setup-Check', done: false }, { name: 'Training', done: false }, { name: '30-Tage-Review', done: false }] },
  { id: 5, customerId: 6, phase: 'Kickoff geplant', steps: [{ name: 'Kickoff-Call', done: false }, { name: 'Setup-Check', done: false }, { name: 'Training', done: false }, { name: '30-Tage-Review', done: false }] },
  { id: 6, customerId: 2, phase: 'Neu', steps: [{ name: 'Kickoff-Call', done: false }, { name: 'Setup-Check', done: false }, { name: 'Training', done: false }, { name: '30-Tage-Review', done: false }] },
  { id: 7, customerId: 7, phase: 'Neu', steps: [{ name: 'Kickoff-Call', done: false }, { name: 'Setup-Check', done: false }, { name: 'Training', done: false }, { name: '30-Tage-Review', done: false }] },
  { id: 8, customerId: 4, phase: 'Kickoff geplant', steps: [{ name: 'Kickoff-Call', done: false }, { name: 'Setup-Check', done: false }, { name: 'Training', done: false }, { name: '30-Tage-Review', done: false }] },
]
