'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ACTIVITIES, CUSTOMERS } from '@/lib/data'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { EmailIcon, PhoneIcon, NoteIcon, TrendsIcon, PlusIcon } from '@/components/Icons'

type Filter = 'Alle' | 'email' | 'call' | 'note' | 'system'

const TYPE_LABEL: Record<string, string> = { email: 'E-Mail', call: 'Anruf', note: 'Notiz', system: 'System' }
const TYPE_COLOR: Record<string, string> = { email: '#2563EB', call: '#16A34A', note: '#EA580C', system: '#6B6B6B' }
const TYPE_ICON: Record<string, React.ReactNode> = {
  email: <EmailIcon />, call: <PhoneIcon />, note: <NoteIcon />, system: <TrendsIcon />,
}

export default function KommunikationPage() {
  const [filter, setFilter] = useState<Filter>('Alle')

  const filtered = ACTIVITIES.filter((a) => filter === 'Alle' || a.type === filter)

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Kommunikation</h2>
        <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>Alle Aktivitäten und Interaktionen mit deinen Kunden</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['Alle', 'email', 'call', 'note', 'system'] as Filter[]).map((f) => {
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                border: `1px solid ${active ? '#1A1A1A' : '#E8E8E8'}`,
                background: active ? '#1A1A1A' : '#FFFFFF',
                color: active ? '#fff' : '#6B6B6B',
                fontWeight: active ? 600 : 400,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {f !== 'Alle' && (
                <span style={{ color: active ? '#fff' : TYPE_COLOR[f] }}>{TYPE_ICON[f]}</span>
              )}
              {f === 'Alle' ? 'Alle' : TYPE_LABEL[f]}
            </button>
          )
        })}
        <button
          style={{
            marginLeft: 'auto',
            padding: '7px 14px',
            border: '1px solid #E8E8E8',
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 12,
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: '#6B6B6B',
          }}
        >
          <PlusIcon />
          Aktivität loggen
        </button>
      </div>

      <Card>
        {filtered.map((a, i) => {
          const cust = CUSTOMERS.find((c) => c.id === a.customerId)
          const col = TYPE_COLOR[a.type]
          return (
            <div
              key={a.id}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 0',
                borderBottom: i < filtered.length - 1 ? '1px solid #E8E8E8' : 'none',
              }}
            >
              <Avatar initials={a.initials} color={a.color} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{a.user}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: col,
                      background: col + '22',
                      padding: '2px 8px',
                      borderRadius: 20,
                      fontWeight: 600,
                    }}
                  >
                    {TYPE_ICON[a.type]}
                    {TYPE_LABEL[a.type]}
                  </span>
                  <span style={{ fontSize: 11, color: '#ABABAB' }}>→</span>
                  <Link href={`/kunden/${cust?.id}`} style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>
                    {cust?.name}
                  </Link>
                </div>
                <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.5 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#ABABAB', marginTop: 4 }}>
                  {a.date.split('-').reverse().join('.')} · {a.time} Uhr
                </div>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
