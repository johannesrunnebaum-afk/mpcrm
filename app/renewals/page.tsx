'use client'

import Link from 'next/link'
import { CUSTOMERS } from '@/lib/data'
import { daysUntil, formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { PlanBadge } from '@/components/Badge'
import HealthBar from '@/components/HealthBar'

export default function RenewalsPage() {
  const sorted = [...CUSTOMERS].sort((a, b) => daysUntil(a.renewal) - daysUntil(b.renewal))
  const urgent = sorted.filter((c) => daysUntil(c.renewal) <= 60)
  const warning = sorted.filter((c) => daysUntil(c.renewal) > 60 && daysUntil(c.renewal) <= 120)
  const ok = sorted.filter((c) => daysUntil(c.renewal) > 120)

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Renewals</h2>
        <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>Vertragsmanagement und Renewal-Pipeline</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ borderTop: '3px solid #DC2626', padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700, marginBottom: 4 }}>DRINGEND (&lt;60 Tage)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626' }}>{urgent.length}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>MRR: {urgent.reduce((s, c) => s + c.mrr, 0)} €</div>
        </Card>
        <Card style={{ borderTop: '3px solid #EA580C', padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: '#EA580C', fontWeight: 700, marginBottom: 4 }}>PLANUNG (60–120 Tage)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#EA580C' }}>{warning.length}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>MRR: {warning.reduce((s, c) => s + c.mrr, 0)} €</div>
        </Card>
        <Card style={{ borderTop: '3px solid #16A34A', padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, marginBottom: 4 }}>GUT GEPLANT (&gt;120 Tage)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#16A34A' }}>{ok.length}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>MRR: {ok.reduce((s, c) => s + c.mrr, 0)} €</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E8E8', background: '#FAFAFA' }}>
              {['Kunde', 'Plan', 'MRR', 'Renewal-Datum', 'Verbleibend', 'Health', 'Aktion'].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const days = daysUntil(c.renewal)
              const col = days <= 60 ? '#DC2626' : days <= 120 ? '#EA580C' : '#16A34A'
              const bg = days <= 60 ? '#FEE2E2' : days <= 120 ? '#FFF0E5' : '#DCFCE7'
              return (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid #E8E8E8', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={c.initials} color={c.color} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#6B6B6B' }}>{c.industry}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}><PlanBadge plan={c.plan} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13 }}>{c.mrr} €</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{formatDate(c.renewal)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: bg, color: col, fontWeight: 700, fontSize: 12 }}>
                      {days} Tage
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}><HealthBar score={c.health} width={80} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    {days <= 60 && (
                      <button style={{ padding: '5px 12px', background: '#DC2626', color: '#fff', borderRadius: 7, fontWeight: 600, fontSize: 11 }}>
                        Jetzt handeln
                      </button>
                    )}
                    {days > 60 && days <= 120 && (
                      <button style={{ padding: '5px 12px', background: '#FFF0E5', color: '#EA580C', borderRadius: 7, fontWeight: 600, fontSize: 11 }}>
                        Planen
                      </button>
                    )}
                    {days > 120 && (
                      <button style={{ padding: '5px 12px', background: '#F2F2F2', color: '#6B6B6B', borderRadius: 7, fontWeight: 500, fontSize: 11 }}>
                        Im Blick
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
