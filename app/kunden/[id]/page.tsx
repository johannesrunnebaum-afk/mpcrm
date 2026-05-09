'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { CUSTOMERS, CONTACTS, ACTIVITIES, ONBOARDING_DATA } from '@/lib/data'
import { daysUntil, formatDate, healthColor, healthLabel } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { StatusBadge, PlanBadge } from '@/components/Badge'
import HealthBar from '@/components/HealthBar'

export default function KundeDetailPage() {
  const params = useParams<{ id: string }>()
  const id = parseInt(params.id, 10)
  const [tab, setTab] = useState('overview')

  const c = CUSTOMERS.find((x) => x.id === id)
  if (!c) return <div style={{ padding: 28, color: '#6B6B6B' }}>Kunde nicht gefunden.</div>

  const contacts = CONTACTS.filter((x) => x.customerId === id)
  const activities = ACTIVITIES.filter((x) => x.customerId === id)
  const onboarding = ONBOARDING_DATA.find((x) => x.customerId === id)
  const daysLeft = daysUntil(c.renewal)

  const tabs = [
    { id: 'overview', label: 'Übersicht' },
    { id: 'contacts', label: `Kontakte (${contacts.length})` },
    { id: 'activities', label: 'Aktivitäten' },
    { id: 'onboarding', label: 'Onboarding' },
  ]

  const typeColor: Record<string, string> = { email: '#2563EB', call: '#16A34A', note: '#EA580C', system: '#6B6B6B' }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Avatar initials={c.initials} color={c.color} size={52} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>{c.name}</h2>
            <StatusBadge status={c.status} />
            <PlanBadge plan={c.plan} />
          </div>
          <div style={{ fontSize: 13, color: '#6B6B6B' }}>
            {c.industry} · {c.users} Nutzer · {c.campaigns} Kampagnen · {c.projects} Projekte
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 16px', border: '1px solid #E8E8E8', borderRadius: 8, fontWeight: 500, fontSize: 13, background: '#FFFFFF' }}>
            Notiz hinzufügen
          </button>
          <button style={{ padding: '8px 16px', background: '#1A1A1A', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
            Aktivität loggen
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, marginBottom: 6 }}>MRR</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{c.mrr} €</div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, marginBottom: 6 }}>HEALTH SCORE</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: healthColor(c.health) }}>{c.health}</div>
          <div style={{ fontSize: 11, color: healthColor(c.health) }}>{healthLabel(c.health)}</div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, marginBottom: 6 }}>NPS</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: c.nps >= 8 ? '#16A34A' : c.nps >= 6 ? '#EA580C' : '#DC2626' }}>
            {c.nps}/10
          </div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, marginBottom: 6 }}>RENEWAL</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{formatDate(c.renewal)}</div>
          <div style={{ fontSize: 11, color: daysLeft <= 60 ? '#DC2626' : daysLeft <= 90 ? '#EA580C' : '#16A34A' }}>
            {daysLeft} Tage
          </div>
        </Card>
        <Card style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, marginBottom: 6 }}>LETZTER LOGIN</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{formatDate(c.lastLogin)}</div>
          <div style={{ fontSize: 11, color: '#6B6B6B' }}>{c.users} aktive Nutzer</div>
        </Card>
      </div>

      {/* Health bar */}
      <Card style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Health Score</span>
          <span style={{ fontWeight: 700, color: healthColor(c.health) }}>{healthLabel(c.health)}</span>
        </div>
        <div style={{ width: '100%', height: 10, background: '#F2F2F2', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${c.health}%`, height: '100%', background: healthColor(c.health), borderRadius: 5 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#ABABAB' }}>
          <span>0 – Kritisch</span><span>50 – Neutral</span><span>100 – Optimal</span>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid #E8E8E8' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px',
              fontWeight: tab === t.id ? 700 : 400,
              fontSize: 13,
              color: tab === t.id ? '#1A1A1A' : '#6B6B6B',
              borderBottom: tab === t.id ? '2px solid #1A1A1A' : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Vertragsdetails</div>
            {[
              ['Plan', <PlanBadge key="plan" plan={c.plan} />],
              ['MRR', `${c.mrr} €/Monat`],
              ['ARR', `${c.mrr * 12} €/Jahr`],
              ['Renewal', formatDate(c.renewal)],
              ['Branche', c.industry],
              ['Nutzer', `${c.users} Nutzer`],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8E8E8', fontSize: 13 }}>
                <span style={{ color: '#6B6B6B' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Nutzung</div>
            {[
              ['Kampagnen', c.campaigns],
              ['Projekte', c.projects],
              ['Aktive Nutzer', c.users],
              ['Letzter Login', formatDate(c.lastLogin)],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8E8E8', fontSize: 13 }}>
                <span style={{ color: '#6B6B6B' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            {c.health < 50 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: '#FEE2E2', borderRadius: 8, fontSize: 12, color: '#DC2626', fontWeight: 500 }}>
                ⚠️ Niedrige Nutzungsrate – Churn-Risiko! Bitte Kontakt aufnehmen.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab: Contacts */}
      {tab === 'contacts' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8E8E8', background: '#FAFAFA' }}>
                {['Name', 'Rolle', 'E-Mail', 'Telefon', 'Letzter Kontakt'].map((h) => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((ct) => (
                <tr key={ct.id} style={{ borderBottom: '1px solid #E8E8E8' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={ct.initials} color={ct.color} size={28} />
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{ct.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{ct.role}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#7C3AED' }}>{ct.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{ct.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{formatDate(ct.lastContact)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Tab: Activities */}
      {tab === 'activities' && (
        <Card>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#ABABAB', padding: 32, fontSize: 13 }}>Noch keine Aktivitäten</div>
          ) : activities.map((a) => (
            <div key={a.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #E8E8E8' }}>
              <Avatar initials={a.initials} color={a.color} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 3 }}>
                  {a.user} · <span style={{ color: typeColor[a.type] }}>{a.type}</span> · {a.date.split('-').reverse().join('.')} {a.time}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Tab: Onboarding */}
      {tab === 'onboarding' && onboarding && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            Onboarding Status: <span style={{ color: '#7C3AED' }}>{onboarding.phase}</span>
          </div>
          {onboarding.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #E8E8E8' }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: s.done ? '#16A34A' : '#F2F2F2',
                  border: `2px solid ${s.done ? '#16A34A' : '#E8E8E8'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {s.done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: s.done ? '#1A1A1A' : '#6B6B6B' }}>{s.name}</span>
              {s.done
                ? <span style={{ fontSize: 11, color: '#16A34A', marginLeft: 'auto' }}>Abgeschlossen</span>
                : <span style={{ fontSize: 11, color: '#ABABAB', marginLeft: 'auto' }}>Ausstehend</span>
              }
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
