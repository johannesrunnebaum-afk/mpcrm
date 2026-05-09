'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CUSTOMERS } from '@/lib/data'
import { daysUntil, formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { StatusBadge, PlanBadge } from '@/components/Badge'
import HealthBar from '@/components/HealthBar'
import { SearchIcon, PlusIcon, ChevronRightIcon } from '@/components/Icons'

export default function KundenPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Alle')

  const filtered = CUSTOMERS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Alle' || c.status === filter
    return matchSearch && matchFilter
  })

  const totalMrr = CUSTOMERS.reduce((s, c) => s + c.mrr, 0)

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Kunden</h2>
          <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>
            {CUSTOMERS.length} Kunden insgesamt · {totalMrr.toLocaleString('de-DE')} € MRR
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 16px',
            background: '#1A1A1A',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <PlusIcon />
          Kunde hinzufügen
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: '#FFFFFF',
            border: '1px solid #E8E8E8',
            borderRadius: 8,
            padding: '7px 12px',
            flex: 1,
            maxWidth: 280,
          }}
        >
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kunden durchsuchen..."
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%' }}
          />
        </div>
        {['Alle', 'Aktiv', 'Gefährdet'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: `1px solid ${filter === f ? '#1A1A1A' : '#E8E8E8'}`,
              background: filter === f ? '#1A1A1A' : '#FFFFFF',
              color: filter === f ? '#fff' : '#1A1A1A',
              fontWeight: filter === f ? 600 : 400,
              fontSize: 13,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E8E8', background: '#FAFAFA' }}>
              {['Kunde', 'Plan', 'MRR', 'Health Score', 'Status', 'Letzter Login', 'Renewal', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '11px 16px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#6B6B6B',
                    letterSpacing: '0.3px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const days = daysUntil(c.renewal)
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
                        <div style={{ fontSize: 11, color: '#6B6B6B' }}>{c.industry} · {c.users} Nutzer</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}><PlanBadge plan={c.plan} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13 }}>{c.mrr} €</td>
                  <td style={{ padding: '12px 16px' }}><HealthBar score={c.health} width={80} /></td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{formatDate(c.lastLogin)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 500 }}>{formatDate(c.renewal)}</div>
                      <div style={{ color: days <= 60 ? '#DC2626' : days <= 90 ? '#EA580C' : '#6B6B6B', fontSize: 11, marginTop: 1 }}>
                        {days} Tage
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${c.id}`}><ChevronRightIcon /></Link>
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
