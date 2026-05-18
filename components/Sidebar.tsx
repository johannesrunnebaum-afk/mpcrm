'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CUSTOMERS } from '@/lib/data'
import {
  DashboardIcon, KundenIcon, KontakteIcon, HealthIcon, OnboardingIcon,
  RenewalsIcon, KommIcon, BerichteIcon, SettingsIcon, HelpIcon,
  ChevronDownIcon, HomeIcon,
} from '@/components/Icons'

const NAV = [
  { id: 'dashboard', href: '/', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'kunden', href: '/kunden', label: 'Kunden', Icon: KundenIcon },
  { id: 'kontakte', href: '/kontakte', label: 'Kontakte', Icon: KontakteIcon },
  { id: 'health', href: '/health', label: 'Health Scores', Icon: HealthIcon },
  { id: 'onboarding', href: '/onboarding', label: 'Onboarding', Icon: OnboardingIcon },
  { id: 'renewals', href: '/renewals', label: 'Renewals', Icon: RenewalsIcon },
  { id: 'kommunikation', href: '/kommunikation', label: 'Kommunikation', Icon: KommIcon },
  { id: 'berichte', href: '/berichte', label: 'Berichte', Icon: BerichteIcon },
]

const NAV2 = [
  { href: '/einstellungen', label: 'Einstellungen', Icon: SettingsIcon },
  { href: '/hilfe', label: 'Hilfe & Support', Icon: HelpIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [pending, setPending] = useState<string | null>(null)
  const atRisk = CUSTOMERS.filter((c) => c.status === 'Gefährdet').length

  useEffect(() => { setPending(null) }, [pathname])

  function isActive(href: string) {
    const current = pending ?? pathname
    if (href === '/') return current === '/'
    return current.startsWith(href)
  }

  return (
    <div
      style={{
        width: 220,
        background: '#FFFFFF',
        borderRight: '1px solid #E8E8E8',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#1A1A1A',
              borderRadius: 7,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2.5,
              padding: 5,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ background: '#C8FF00', borderRadius: 1.5 }} />
            ))}
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>Mpilot CRM</span>
        </div>

        {/* Workspace */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            background: '#F2F2F2',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HomeIcon />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Aufwind GmbH</span>
          <ChevronDownIcon />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
        {NAV.map(({ id, href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={id}
              href={href}
              onClick={() => setPending(href)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                marginBottom: 1,
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                color: active ? '#1A1A1A' : '#6B6B6B',
                background: active ? '#C8FF00' : 'transparent',
                textAlign: 'left',
                position: 'relative',
                transition: 'background .15s',
              }}
            >
              <Icon />
              {label}
              {id === 'health' && atRisk > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: '#DC2626',
                    color: '#fff',
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 7px',
                  }}
                >
                  {atRisk}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div style={{ padding: '8px 10px 16px', borderTop: '1px solid #E8E8E8' }}>
        {NAV2.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setPending(href)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              marginBottom: 1,
              fontWeight: 400,
              fontSize: 13,
              color: '#6B6B6B',
              background: 'transparent',
            }}
          >
            <Icon />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
