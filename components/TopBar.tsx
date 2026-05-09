'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CUSTOMERS } from '@/lib/data'
import { SearchIcon, BellIcon, ArrowLeftIcon } from '@/components/Icons'

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/kunden': 'Kunden',
  '/kontakte': 'Kontakte',
  '/health': 'Health Scores',
  '/onboarding': 'Onboarding',
  '/renewals': 'Renewals',
  '/kommunikation': 'Kommunikation',
  '/berichte': 'Berichte',
  '/einstellungen': 'Einstellungen',
  '/hilfe': 'Hilfe & Support',
}

export default function TopBar() {
  const pathname = usePathname()

  const isKundeDetail = pathname.startsWith('/kunden/') && pathname !== '/kunden/'
  const customerId = isKundeDetail ? parseInt(pathname.split('/')[2], 10) : null
  const customer = customerId ? CUSTOMERS.find((c) => c.id === customerId) : null

  const title = isKundeDetail ? (customer?.name || 'Kunde') : (TITLES[pathname] || pathname)

  return (
    <div
      style={{
        height: 56,
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E8E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isKundeDetail && (
          <Link
            href="/kunden"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#6B6B6B',
              fontWeight: 500,
              fontSize: 13,
              padding: '6px 10px',
              borderRadius: 7,
            }}
          >
            <ArrowLeftIcon />
            Kunden
          </Link>
        )}
        <h1 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F2F2F2',
            borderRadius: 8,
            padding: '7px 13px',
            width: 220,
          }}
        >
          <SearchIcon />
          <input
            placeholder="Suchen..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              color: '#1A1A1A',
              fontSize: 13,
            }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 8,
              borderRadius: 8,
              color: '#6B6B6B',
            }}
          >
            <BellIcon />
          </button>
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#DC2626',
              border: '2px solid #FFFFFF',
            }}
          />
        </div>

        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#F59E0B',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          JR
        </div>
      </div>
    </div>
  )
}
