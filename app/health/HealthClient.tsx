'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Customer } from '@/lib/types'
import { formatDate, healthColor, healthBg, healthLabel } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import HealthBar from '@/components/HealthBar'
import Modal, { Field, Textarea, Input, FormActions } from '@/components/Modal'
import { actionCreateActivity } from '@/lib/actions'

export default function HealthClient({ customers }: { customers: Customer[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actModal, setActModal] = useState<{ customer: Customer } | null>(null)
  const [actText, setActText] = useState('')
  const [actUser, setActUser] = useState('')

  const sorted = [...customers].sort((a, b) => a.health - b.health)
  const gesund = customers.filter((c) => c.health >= 70).length
  const neutral = customers.filter((c) => c.health >= 40 && c.health < 70).length
  const gefaehrdet = customers.filter((c) => c.health < 40).length

  function openContact(c: Customer) {
    setActText(`Kontaktaufnahme wegen niedrigem Health Score (${c.health}) bei ${c.name}.`)
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
        color: '#EF4444',
      })
      router.refresh()
      setActModal(null)
    })
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Health Scores</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Überwache die Gesundheit deiner Kunden in Echtzeit</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ borderLeft: '3px solid #10B981', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginBottom: 4, letterSpacing: '0.3px' }}>GESUND (≥70)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10B981' }}>{gesund}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Health Score über 70</div>
        </Card>
        <Card style={{ borderLeft: '3px solid #F59E0B', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, marginBottom: 4, letterSpacing: '0.3px' }}>NEUTRAL (40–69)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#F59E0B' }}>{neutral}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Beobachten & unterstützen</div>
        </Card>
        <Card style={{ borderLeft: '3px solid #EF4444', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 700, marginBottom: 4, letterSpacing: '0.3px' }}>GEFÄHRDET (&lt;40)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#EF4444' }}>{gefaehrdet}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Sofort Maßnahmen ergreifen!</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 700, fontSize: 14, color: '#0F0F1A' }}>
          Alle Kunden nach Health Score
        </div>
        {sorted.map((c) => {
          const col = healthColor(c.health)
          const bg = healthBg(c.health)
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <Link href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                <Avatar initials={c.initials} color={c.color} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 5, color: '#0F0F1A' }}>{c.name}</div>
                  <HealthBar score={c.health} width={200} showLabel />
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{c.plan} · {c.mrr.toLocaleString('de-DE')} €/mo</div>
                  <div style={{ fontSize: 11, color: '#A0A8B8', marginTop: 2 }}>Login: {formatDate(c.lastLogin)}</div>
                </div>
                <div style={{ padding: '4px 12px', borderRadius: 20, background: bg, color: col, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                  {healthLabel(c.health)}
                </div>
              </Link>
              {c.health < 40 && (
                <button onClick={() => openContact(c)} style={{ padding: '7px 14px', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', borderRadius: 9, fontWeight: 600, fontSize: 12, flexShrink: 0, cursor: 'pointer', border: 'none', boxShadow: '0 4px 10px rgba(239,68,68,0.3)' }}>
                  Kontaktieren
                </button>
              )}
            </div>
          )
        })}
      </Card>

      {actModal && (
        <Modal title={`Kontakt aufnehmen: ${actModal.customer.name}`} onClose={() => setActModal(null)} width={460}>
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)' }}>
            Health Score: <strong>{actModal.customer.health}</strong> – Sofortmaßnahme empfohlen
          </div>
          <form onSubmit={handleSubmit}>
            <Field label="Notiz zur Kontaktaufnahme">
              <Textarea required value={actText} onChange={(e) => setActText(e.target.value)} rows={3} />
            </Field>
            <Field label="Dein Name *">
              <Input required value={actUser} onChange={(e) => setActUser(e.target.value)} placeholder="z.B. Lisa M." />
            </Field>
            <FormActions onCancel={() => setActModal(null)} submitLabel={isPending ? 'Speichern...' : 'Kontakt loggen'} />
          </form>
        </Modal>
      )}
    </div>
  )
}
