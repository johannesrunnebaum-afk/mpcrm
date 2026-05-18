'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellIcon, ArrowLeftIcon } from '@/components/Icons'
import GlobalSearch from '@/components/GlobalSearch'

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
  const title = isKundeDetail ? 'Kunde' : (TITLES[pathname] || pathname)

  return (
    <div style={{
      height: 58,
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.8)',
      boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isKundeDetail && (
          <Link href="/kunden" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontWeight: 500, fontSize: 13, padding: '5px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.06)' }}>
            <ArrowLeftIcon />Kunden
          </Link>
        )}
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#0F0F1A' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <GlobalSearch />

        <div style={{ position: 'relative' }}>
          <button style={{ display: 'flex', alignItems: 'center', padding: 8, borderRadius: 10, color: '#6B7280', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <BellIcon />
          </button>
          <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: '50%', background: '#EF4444', border: '1.5px solid #fff' }} />
        </div>

        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,158,11,0.35)' }}>
          JR
        </div>
      </div>
    </div>
  )
}
