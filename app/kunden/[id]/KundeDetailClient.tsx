'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer, Contact, Activity, OnboardingEntry } from '@/lib/types'
import { daysUntil, formatDate, healthColor, healthLabel } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { StatusBadge, PlanBadge } from '@/components/Badge'
import HealthBar from '@/components/HealthBar'
import Modal, { Field, Input, Select, Textarea, FormActions } from '@/components/Modal'
import { actionCreateActivity, actionUpsertOnboarding } from '@/lib/actions'
import { ONBOARDING_PHASES } from '@/lib/data'

interface Props {
  customer: Customer
  contacts: Contact[]
  activities: Activity[]
  onboarding: OnboardingEntry | null
}

type ActivityModal = { mode: 'activity' | 'note' }

const typeColor: Record<string, string> = { email: '#6366F1', call: '#10B981', note: '#F59E0B', system: '#94A3B8' }

export default function KundeDetailClient({ customer: c, contacts, activities, onboarding }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('overview')
  const [actModal, setActModal] = useState<ActivityModal | null>(null)
  const [actType, setActType] = useState<'email' | 'call' | 'note'>('call')
  const [actText, setActText] = useState('')
  const [actUser, setActUser] = useState('')

  const daysLeft = daysUntil(c.renewal)

  const tabs = [
    { id: 'overview', label: 'Übersicht' },
    { id: 'contacts', label: `Kontakte (${contacts.length})` },
    { id: 'activities', label: 'Aktivitäten' },
    { id: 'onboarding', label: 'Onboarding' },
  ]

  function openActivityModal(type: 'activity' | 'note') {
    setActType(type === 'note' ? 'note' : 'call')
    setActText('')
    setActUser('')
    setActModal({ mode: type })
  }

  async function handleActivitySubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await actionCreateActivity({
        customerId: c.id, type: actType,
        text: actText, user: actUser || 'Unbekannt',
        initials: actUser.split(' ').filter(Boolean).map((w) => w[0].toUpperCase()).join('').slice(0, 2) || 'XX',
        color: '#7C3AED',
      })
      router.refresh()
      setActModal(null)
    })
  }

  async function handleToggleStep(stepIndex: number) {
    if (!onboarding) return
    const newSteps = onboarding.steps.map((s, i) => i === stepIndex ? { ...s, done: !s.done } : s)
    const allDone = newSteps.every((s) => s.done)
    const newPhase = allDone ? 'Abgeschlossen' : onboarding.phase === 'Geplant' ? 'In Bearbeitung' : onboarding.phase
    startTransition(async () => { await actionUpsertOnboarding(c.id, newPhase, newSteps); router.refresh() })
  }

  async function handlePhaseChange(phase: string) {
    if (!onboarding) return
    startTransition(async () => { await actionUpsertOnboarding(c.id, phase, onboarding.steps); router.refresh() })
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Avatar initials={c.initials} color={c.color} size={52} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: '#0F0F1A' }}>{c.name}</h2>
            <StatusBadge status={c.status} />
            <PlanBadge plan={c.plan} />
          </div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>
            {c.industry} · {c.users} Nutzer · {c.campaigns} Kampagnen · {c.projects} Projekte
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => openActivityModal('note')} style={{ padding: '8px 16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontWeight: 500, fontSize: 13, background: 'rgba(255,255,255,0.8)', cursor: 'pointer', color: '#6B7280' }}>
            Notiz hinzufügen
          </button>
          <button onClick={() => openActivityModal('activity')} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            Aktivität loggen
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#A0A8B8', fontWeight: 600, marginBottom: 6, letterSpacing: '0.3px' }}>MRR</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0F0F1A' }}>{c.mrr.toLocaleString('de-DE')} €</div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#A0A8B8', fontWeight: 600, marginBottom: 6, letterSpacing: '0.3px' }}>HEALTH SCORE</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: healthColor(c.health) }}>{c.health}</div>
          <div style={{ fontSize: 11, color: healthColor(c.health), marginTop: 1 }}>{healthLabel(c.health)}</div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#A0A8B8', fontWeight: 600, marginBottom: 6, letterSpacing: '0.3px' }}>NPS</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: c.nps >= 8 ? '#10B981' : c.nps >= 6 ? '#F59E0B' : '#EF4444' }}>{c.nps}/10</div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#A0A8B8', fontWeight: 600, marginBottom: 6, letterSpacing: '0.3px' }}>RENEWAL</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F0F1A' }}>{formatDate(c.renewal)}</div>
          <div style={{ fontSize: 11, color: daysLeft <= 60 ? '#EF4444' : daysLeft <= 90 ? '#F59E0B' : '#10B981', marginTop: 1 }}>{daysLeft} Tage</div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#A0A8B8', fontWeight: 600, marginBottom: 6, letterSpacing: '0.3px' }}>LETZTER LOGIN</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F0F1A' }}>{formatDate(c.lastLogin)}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{c.users} aktive Nutzer</div>
        </Card>
      </div>

      {/* Health bar */}
      <Card style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>Health Score</span>
          <span style={{ fontWeight: 700, color: healthColor(c.health) }}>{healthLabel(c.health)}</span>
        </div>
        <div style={{ width: '100%', height: 10, background: 'rgba(0,0,0,0.06)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${c.health}%`, height: '100%', background: healthColor(c.health), borderRadius: 5, boxShadow: `0 0 8px ${healthColor(c.health)}66`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#A0A8B8' }}>
          <span>0 – Kritisch</span><span>50 – Neutral</span><span>100 – Optimal</span>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', fontWeight: tab === t.id ? 700 : 500, fontSize: 13,
            color: tab === t.id ? '#6366F1' : '#6B7280',
            borderBottom: tab === t.id ? '2px solid #6366F1' : '2px solid transparent',
            marginBottom: -1, background: 'transparent', cursor: 'pointer', border: 'none',
            borderBottomWidth: 2, borderBottomStyle: 'solid',
            borderBottomColor: tab === t.id ? '#6366F1' : 'transparent',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#0F0F1A' }}>Vertragsdetails</div>
            {[
              ['Plan', <PlanBadge key="plan" plan={c.plan} />],
              ['MRR', `${c.mrr.toLocaleString('de-DE')} €/Monat`],
              ['ARR', `${(c.mrr * 12).toLocaleString('de-DE')} €/Jahr`],
              ['Renewal', formatDate(c.renewal)],
              ['Branche', c.industry],
              ['Nutzer', `${c.users} Nutzer`],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>{k}</span>
                <span style={{ fontWeight: 500, color: '#0F0F1A' }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#0F0F1A' }}>Nutzung</div>
            {[['Kampagnen', c.campaigns], ['Projekte', c.projects], ['Aktive Nutzer', c.users], ['Letzter Login', formatDate(c.lastLogin)]].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#0F0F1A' }}>{v}</span>
              </div>
            ))}
            {c.health < 50 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 10, fontSize: 12, color: '#EF4444', fontWeight: 500, border: '1px solid rgba(239,68,68,0.15)' }}>
                ⚠️ Niedrige Nutzungsrate – Churn-Risiko! Bitte Kontakt aufnehmen.
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'contacts' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(99,102,241,0.03)' }}>
                {['Name', 'Rolle', 'E-Mail', 'Telefon', 'Letzter Kontakt'].map((h) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#A0A8B8', letterSpacing: '0.4px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((ct) => (
                <tr key={ct.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={ct.initials} color={ct.color} size={28} />
                      <span style={{ fontWeight: 500, fontSize: 13, color: '#0F0F1A' }}>{ct.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{ct.role}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6366F1', fontWeight: 500 }}>{ct.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{ct.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(ct.lastContact)}</td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#A0A8B8', fontSize: 13 }}>Keine Kontakte vorhanden</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'activities' && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={() => openActivityModal('activity')} style={{ padding: '7px 14px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer', border: 'none', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>+ Aktivität loggen</button>
          </div>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#A0A8B8', padding: 40, fontSize: 13 }}>Noch keine Aktivitäten</div>
          ) : activities.map((a) => (
            <div key={a.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Avatar initials={a.initials} color={a.color} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, color: '#0F0F1A' }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>
                  {a.user} · <span style={{ color: typeColor[a.type], fontWeight: 600 }}>{a.type}</span> · {a.date.split('-').reverse().join('.')} {a.time}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === 'onboarding' && onboarding && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A' }}>
              Onboarding Status: <span style={{ color: '#6366F1' }}>{onboarding.phase}</span>
            </div>
            <select
              value={onboarding.phase}
              onChange={(e) => handlePhaseChange(e.target.value)}
              disabled={isPending}
              style={{ padding: '6px 12px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 9, fontSize: 12, cursor: 'pointer', background: 'rgba(99,102,241,0.04)', color: '#0F0F1A', outline: 'none' }}
            >
              {ONBOARDING_PHASES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          {onboarding.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }}
              onClick={() => handleToggleStep(i)}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.done ? '#10B981' : 'rgba(99,102,241,0.06)', border: `2px solid ${s.done ? '#10B981' : 'rgba(99,102,241,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                {s.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: s.done ? '#0F0F1A' : '#6B7280', flex: 1 }}>{s.name}</span>
              {s.done
                ? <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Abgeschlossen</span>
                : <span style={{ fontSize: 11, color: '#A0A8B8' }}>Ausstehend</span>}
            </div>
          ))}
        </Card>
      )}

      {tab === 'onboarding' && !onboarding && (
        <Card>
          <div style={{ textAlign: 'center', color: '#A0A8B8', padding: 40, fontSize: 13 }}>Kein Onboarding-Eintrag vorhanden</div>
        </Card>
      )}

      {actModal && (
        <Modal title={actModal.mode === 'note' ? 'Notiz hinzufügen' : 'Aktivität loggen'} onClose={() => setActModal(null)} width={460}>
          <form onSubmit={handleActivitySubmit}>
            {actModal.mode === 'activity' && (
              <Field label="Typ">
                <Select value={actType} onChange={(e) => setActType(e.target.value as typeof actType)}>
                  <option value="call">Anruf</option>
                  <option value="email">E-Mail</option>
                  <option value="note">Notiz</option>
                </Select>
              </Field>
            )}
            <Field label="Beschreibung *">
              <Textarea required value={actText} onChange={(e) => setActText(e.target.value)} placeholder="Was ist passiert?" rows={4} />
            </Field>
            <Field label="Dein Name *">
              <Input required value={actUser} onChange={(e) => setActUser(e.target.value)} placeholder="z.B. Lisa M." />
            </Field>
            <FormActions onCancel={() => setActModal(null)} submitLabel={isPending ? 'Speichern...' : 'Speichern'} />
          </form>
        </Modal>
      )}
    </div>
  )
}
