'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  const [barVisible, setBarVisible] = useState(false)
  const [barFading, setBarFading] = useState(false)

  useEffect(() => {
    setPending(null)
    if (barVisible) {
      setBarFading(true)
      setTimeout(() => { setBarVisible(false); setBarFading(false) }, 350)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function handleNavClick(href: string) {
    setPending(href)
    setBarVisible(true)
    setBarFading(false)
  }

  function isActive(href: string) {
    const current = pending ?? pathname
    if (href === '/') return current === '/'
    return current.startsWith(href)
  }

  return (
    <div style={{
      width: 224,
      background: 'linear-gradient(180deg, #0D0D1F 0%, #110E2A 100%)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      overflow: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
    }}>
      {/* Subtle glow at top */}
      <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 160, height: 80, background: 'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ padding: '20px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, padding: 6, boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ background: i < 2 ? '#C8FF00' : 'rgba(255,255,255,0.5)', borderRadius: 1.5 }} />
            ))}
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', color: '#FFFFFF' }}>Mpilot CRM</span>
        </div>

        {/* Workspace */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.07)', borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HomeIcon />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: 'rgba(255,255,255,0.85)' }}>Aufwind GmbH</span>
          <ChevronDownIcon />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.8px', padding: '8px 10px 6px' }}>NAVIGATION</div>
        {NAV.map(({ id, href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link key={id} href={href} onClick={() => handleNavClick(href)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '8px 10px', borderRadius: 10,
                marginBottom: 2, fontWeight: active ? 600 : 400, fontSize: 13,
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                background: active
                  ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                  : 'transparent',
                boxShadow: active
                  ? '0 4px 14px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon />
              {label}
              {id === 'health' && (
                <span style={{ marginLeft: 'auto', background: active ? 'rgba(255,255,255,0.25)' : '#DC2626', color: '#fff', borderRadius: 20, fontSize: 10, fontWeight: 700, padding: '1px 7px' }}>2</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div style={{ padding: '8px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {NAV2.map(({ href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} onClick={() => handleNavClick(href)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '8px 10px', borderRadius: 10,
                marginBottom: 2, fontWeight: active ? 600 : 400, fontSize: 13,
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                background: active ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
                boxShadow: active ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon />
              {label}
            </Link>
          )
        })}
      </div>

      {/* Navigation progress bar */}
      {barVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999, overflow: 'hidden', opacity: barFading ? 0 : 1, transition: barFading ? 'opacity 0.35s ease' : 'none', pointerEvents: 'none' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent 0%, #6366F1 30%, #C8FF00 60%, #8B5CF6 80%, transparent 100%)', backgroundSize: '300% 100%', animation: 'navProgress 1.0s linear infinite' }} />
          <style>{`@keyframes navProgress { from { background-position: 100% 0 } to { background-position: -100% 0 } }`}</style>
        </div>
      )}
    </div>
  )
}
