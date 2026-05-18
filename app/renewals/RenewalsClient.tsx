'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Customer } from '@/lib/types'
import { daysUntil, formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { PlanBadge } from '@/components/Badge'
import HealthBar from '@/components/HealthBar'
import Modal, { Field, Textarea, Input, FormActions } from '@/components/Modal'
import { actionCreateActivity } from '@/lib/actions'

export default function RenewalsClient({ customers }: { customers: Customer[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actModal, setActModal] = useState<{ customer: Customer } | null>(null)
  const [actText, setActText] = useState('')
  const [actUser, setActUser] = useState('')

  const sorted = [...customers].sort((a, b) => daysUntil(a.renewal) - daysUntil(b.renewal))
  const urgent = sorted.filter((c) => daysUntil(c.renewal) <= 60)
  const warning = sorted.filter((c) => daysUntil(c.renewal) > 60 && daysUntil(c.renewal) <= 120)
  const ok = sorted.filter((c) => daysUntil(c.renewal) > 120)

  function openAction(c: Customer) {
    setActText(`Renewal-Gespräch mit ${c.name} geführt. Renewal am ${formatDate(c.renewal)}.`)
    setActUser('')
    setActModal({ customer: c })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!actModal) return
    startTransition(async () => {
      await actionCreateActivity({
        customerId: actModal.customer.id, type: 'call',
        text: actText, user: actUser || 'Unbekannt',
        initials: actUser.split(' ').filter(Boolean).map((w) => w[0].toUpperCase()).join('').slice(0, 2) || 'XX',
        color: '#7C3AED',
      })
      router.refresh()
      setActModal(null)
    })
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Renewals</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Vertragsmanagement und Renewal-Pipeline</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ borderTop: '3px solid #EF4444', padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 700, marginBottom: 4, letterSpacing: '0.3px' }}>DRINGEND (&lt;60 Tage)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#EF4444' }}>{urgent.length}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>MRR: {urgent.reduce((s, c) => s + c.mrr, 0).toLocaleString('de-DE')} €</div>
        </Card>
        <Card style={{ borderTop: '3px solid #F59E0B', padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, marginBottom: 4, letterSpacing: '0.3px' }}>PLANUNG (60–120 Tage)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F59E0B' }}>{warning.length}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>MRR: {warning.reduce((s, c) => s + c.mrr, 0).toLocaleString('de-DE')} €</div>
        </Card>
        <Card style={{ borderTop: '3px solid #10B981', padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginBottom: 4, letterSpacing: '0.3px' }}>GUT GEPLANT (&gt;120 Tage)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10B981' }}>{ok.length}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>MRR: {ok.reduce((s, c) => s + c.mrr, 0).toLocaleString('de-DE')} €</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(99,102,241,0.03)' }}>
              {['Kunde', 'Plan', 'MRR', 'Renewal-Datum', 'Verbleibend', 'Health', 'Aktion'].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#A0A8B8', letterSpacing: '0.4px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const days = daysUntil(c.renewal)
              const urgent = days <= 60
              const warn = days <= 120
              const col = urgent ? '#EF4444' : warn ? '#F59E0B' : '#10B981'
              const bg = urgent ? 'rgba(239,68,68,0.1)' : warn ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={c.initials} color={c.color} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>{c.industry}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}><PlanBadge plan={c.plan} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13, color: '#0F0F1A' }}>{c.mrr.toLocaleString('de-DE')} €</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#0F0F1A' }}>{formatDate(c.renewal)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: bg, color: col, fontWeight: 700, fontSize: 12 }}>{days} Tage</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}><HealthBar score={c.health} width={80} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openAction(c)} style={{
                      padding: '6px 14px',
                      background: urgent ? 'linear-gradient(135deg, #EF4444, #DC2626)' : warn ? 'rgba(245,158,11,0.12)' : 'rgba(0,0,0,0.04)',
                      color: urgent ? '#fff' : warn ? '#F59E0B' : '#6B7280',
                      borderRadius: 9, fontWeight: 600, fontSize: 11, cursor: 'pointer', border: 'none',
                      boxShadow: urgent ? '0 4px 10px rgba(239,68,68,0.25)' : 'none',
                    }}>
                      {urgent ? 'Jetzt handeln' : warn ? 'Planen' : 'Im Blick'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {actModal && (
        <Modal title={`Renewal-Aktion: ${actModal.customer.name}`} onClose={() => setActModal(null)} width={460}>
          <form onSubmit={handleSubmit}>
            <Field label="Aktivität">
              <Textarea required value={actText} onChange={(e) => setActText(e.target.value)} rows={3} />
            </Field>
            <Field label="Dein Name *">
              <Input required value={actUser} onChange={(e) => setActUser(e.target.value)} placeholder="z.B. Lisa M." />
            </Field>
            <FormActions onCancel={() => setActModal(null)} submitLabel={isPending ? 'Speichern...' : 'Aktivität loggen'} />
          </form>
        </Modal>
      )}
    </div>
  )
}
