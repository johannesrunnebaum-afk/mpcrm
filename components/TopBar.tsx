'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BellIcon, ArrowLeftIcon } from '@/components/Icons'
import GlobalSearch from '@/components/GlobalSearch'
import type { Profile } from '@/lib/types'

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

interface Props { profile: Profile }

export default function TopBar({ profile }: Props) {
  const pathname = usePathname()
  const isKundeDetail = pathname.startsWith('/kunden/') && pathname !== '/kunden/'
  const isKontaktDetail = pathname.startsWith('/kontakte/') && pathname !== '/kontakte/'
  const title = isKundeDetail ? 'Kunde' : isKontaktDetail ? 'Kontakt' : (TITLES[pathname] || pathname)

  const fullName = `${profile.firstName} ${profile.lastName}`.trim()

  return (
    <div style={{
      height: 58,
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.75)',
      boxShadow: '0 1px 0 rgba(99,102,241,0.06), 0 4px 20px rgba(0,0,0,0.03)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isKundeDetail && (
          <Link href="/kunden" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontWeight: 500, fontSize: 13, padding: '5px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.06)' }}>
            <ArrowLeftIcon />Kunden
          </Link>
        )}
        {isKontaktDetail && (
          <Link href="/kontakte" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontWeight: 500, fontSize: 13, padding: '5px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.06)' }}>
            <ArrowLeftIcon />Kontakte
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

        <Link href="/einstellungen" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', borderRadius: 24, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)', cursor: 'pointer', textDecoration: 'none' }}>
          <ProfileAvatar profile={profile} size={28} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0F0F1A', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fullName}</span>
        </Link>
      </div>
    </div>
  )
}

export function ProfileAvatar({ profile, size = 34 }: { profile: Profile; size?: number }) {
  if (profile.avatarUrl) {
    return (
      <img
        src={profile.avatarUrl}
        alt={profile.initials}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: `0 2px 8px ${profile.avatarColor}55` }}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}bb)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0, boxShadow: `0 2px 8px ${profile.avatarColor}55` }}>
      {profile.initials}
    </div>
  )
}
