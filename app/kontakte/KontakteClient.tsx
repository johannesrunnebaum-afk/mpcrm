'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Contact, Customer } from '@/lib/types'
import { formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { SearchIcon, PlusIcon } from '@/components/Icons'

interface Props {
  contacts: Contact[]
  customers: Customer[]
}

export default function KontakteClient({ contacts, customers }: Props) {
  const [search, setSearch] = useState('')

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Kontakte</h2>
          <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>{contacts.length} Kontakte insgesamt</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#1A1A1A', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
          <PlusIcon />Kontakt hinzufügen
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 8, padding: '7px 12px', flex: 1, maxWidth: 280 }}>
          <SearchIcon />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kontakte suchen..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%' }} />
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E8E8', background: '#FAFAFA' }}>
              {['Name', 'Unternehmen', 'Rolle', 'E-Mail', 'Telefon', 'Letzter Kontakt'].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ct) => {
              const cust = customers.find((c) => c.id === ct.customerId)
              return (
                <tr key={ct.id} style={{ borderBottom: '1px solid #E8E8E8', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${ct.customerId}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={ct.initials} color={ct.color} size={32} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{ct.name}</span>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <Avatar initials={cust?.initials || '?'} color={cust?.color || '#6B6B6B'} size={20} />
                      <span>{cust?.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{ct.role}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#7C3AED' }}>{ct.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{ct.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{formatDate(ct.lastContact)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
