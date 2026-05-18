'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Activity, Customer } from '@/lib/types'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { EmailIcon, PhoneIcon, NoteIcon, TrendsIcon } from '@/components/Icons'

type Filter = 'Alle' | 'email' | 'call' | 'note' | 'system'

const TYPE_LABEL: Record<string, string> = { email: 'E-Mail', call: 'Anruf', note: 'Notiz', system: 'System' }
const TYPE_COLOR: Record<string, string> = { email: '#6366F1', call: '#10B981', note: '#F59E0B', system: '#94A3B8' }
const TYPE_ICON: Record<string, React.ReactNode> = {
  email: <EmailIcon />, call: <PhoneIcon />, note: <NoteIcon />, system: <TrendsIcon />,
}

interface Props {
  activities: Activity[]
  customers: Customer[]
}

export default function KommunikationClient({ activities, customers }: Props) {
  const [filter, setFilter] = useState<Filter>('Alle')
  const filtered = activities.filter((a) => filter === 'Alle' || a.type === filter)

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Kommunikation</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Alle Aktivitäten und Interaktionen mit deinen Kunden</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['Alle', 'email', 'call', 'note', 'system'] as Filter[]).map((f) => {
          const active = filter === f
          const col = f !== 'Alle' ? TYPE_COLOR[f] : undefined
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 10, border: 'none',
              background: active ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(99,102,241,0.06)',
              color: active ? '#fff' : '#6B7280',
              fontWeight: active ? 600 : 500, fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
              boxShadow: active ? '0 4px 10px rgba(99,102,241,0.25)' : 'none',
            }}>
              {f !== 'Alle' && (
                <span style={{ color: active ? 'rgba(255,255,255,0.8)' : col }}>{TYPE_ICON[f]}</span>
              )}
              {f === 'Alle' ? 'Alle' : TYPE_LABEL[f]}
            </button>
          )
        })}
      </div>

      <Card>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#A0A8B8', padding: 48, fontSize: 13 }}>Keine Aktivitäten gefunden</div>
        )}
        {filtered.map((a, i) => {
          const cust = customers.find((c) => c.id === a.customerId)
          const col = TYPE_COLOR[a.type]
          return (
            <div key={a.id} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              <Avatar initials={a.initials} color={a.color} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{a.user}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: col, background: col + '18', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                    {TYPE_ICON[a.type]}{TYPE_LABEL[a.type]}
                  </span>
                  <span style={{ fontSize: 11, color: '#A0A8B8' }}>→</span>
                  <Link href={`/kunden/${cust?.id}`} style={{ fontSize: 11, color: '#6366F1', fontWeight: 600 }}>{cust?.name}</Link>
                </div>
                <div style={{ fontSize: 13, color: '#0F0F1A', lineHeight: 1.5 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#A0A8B8', marginTop: 4 }}>{a.date.split('-').reverse().join('.')} · {a.time} Uhr</div>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
