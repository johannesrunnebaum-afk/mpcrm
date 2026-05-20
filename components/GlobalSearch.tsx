'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer, Contact, Activity } from '@/lib/types'
import Avatar from './Avatar'

interface Results {
  customers: Customer[]
  contacts: Contact[]
  activities: Activity[]
}

const typeColor: Record<string, string> = { customer: '#6366F1', contact: '#0EA5E9', activity: '#F59E0B' }

export default function GlobalSearch() {
  const router = useRouter()
  const [focused, setFocused] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results>({ customers: [], contacts: [], activities: [] })
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allResults = [
    ...results.customers.map((c) => ({ type: 'customer', id: c.id, label: c.name, sub: c.industry, initials: c.initials, color: c.color, href: `/kunden/${c.id}` })),
    ...results.contacts.map((c) => ({ type: 'contact', id: c.id, label: c.name, sub: c.role, initials: c.initials, color: c.color, href: `/kontakte/${c.id}` })),
    ...results.activities.map((a) => ({ type: 'activity', id: a.id, label: a.text, sub: a.user, initials: a.initials, color: a.color, href: `/kunden/${a.customerId}` })),
  ]

  const showDropdown = focused && (query.length >= 2 || allResults.length > 0)

  // Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Click outside → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults({ customers: [], contacts: [], activities: [] }); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setSelected(0)
      } finally { setLoading(false) }
    }, 200)
  }, [query])

  function navigate(href: string) {
    router.push(href)
    setFocused(false)
    setQuery('')
    setResults({ customers: [], contacts: [], activities: [] })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, allResults.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && allResults[selected]) navigate(allResults[selected].href)
    if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur() }
  }

  const isActive = focused || hovered

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Search bar */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px',
          background: focused ? 'rgba(255,255,255,0.28)' : isActive ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.16)',
          backdropFilter: 'blur(48px) saturate(180%)',
          WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          border: `1px solid ${focused ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)'}`,
          borderRadius: focused ? '14px 14px 0 0' : 14,
          width: focused ? 320 : hovered ? 260 : 220,
          transition: 'width 0.25s ease, border-color 0.15s, background 0.15s, border-radius 0.15s',
          boxShadow: focused ? 'inset 0 1px 0 rgba(255,255,255,0.7), 0 0 0 3px rgba(99,102,241,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.5)',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <svg width="14" height="14" fill="none" stroke={focused ? '#6366F1' : '#A0A8B8'} strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0, transition: 'stroke 0.15s' }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Suchen..."
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#0F0F1A', minWidth: 0 }}
        />
        {loading
          ? <div style={{ width: 14, height: 14, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.6s linear infinite', flexShrink: 0 }} />
          : !focused && <span style={{ fontSize: 11, background: 'rgba(99,102,241,0.12)', color: '#6366F1', borderRadius: 6, padding: '2px 6px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>⌘K</span>
        }
        {focused && query && (
          <button onClick={() => { setQuery(''); setResults({ customers: [], contacts: [], activities: [] }) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0A8B8', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.3), 0 20px 50px rgba(99,102,241,0.18)',
          overflow: 'hidden',
          zIndex: 200,
          maxHeight: 380,
          overflowY: 'auto',
        }}>
          {allResults.length > 0 && (
            <>
              {results.customers.length > 0 && (
                <div style={{ padding: '8px 14px 3px', fontSize: 10, fontWeight: 700, color: '#A0A8B8', letterSpacing: '0.6px' }}>KUNDEN</div>
              )}
              {results.customers.map((c, i) => (
                <button key={`c-${c.id}`} onClick={() => navigate(`/kunden/${c.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 14px', background: selected === i ? 'rgba(99,102,241,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                  <Avatar initials={c.initials} color={c.color} size={26} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: '#0F0F1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{c.industry}</div>
                  </div>
                  <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.1)', color: '#6366F1', borderRadius: 5, padding: '1px 7px', fontWeight: 700, flexShrink: 0 }}>Kunde</span>
                </button>
              ))}

              {results.contacts.length > 0 && (
                <div style={{ padding: '8px 14px 3px', fontSize: 10, fontWeight: 700, color: '#A0A8B8', letterSpacing: '0.6px', borderTop: results.customers.length > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>KONTAKTE</div>
              )}
              {results.contacts.map((ct, i) => {
                const idx = results.customers.length + i
                return (
                  <button key={`ct-${ct.id}`} onClick={() => navigate(`/kontakte/${ct.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 14px', background: selected === idx ? 'rgba(14,165,233,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                    <Avatar initials={ct.initials} color={ct.color} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: '#0F0F1A' }}>{ct.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{ct.role}</div>
                    </div>
                    <span style={{ fontSize: 10, background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', borderRadius: 5, padding: '1px 7px', fontWeight: 700, flexShrink: 0 }}>Kontakt</span>
                  </button>
                )
              })}

              {results.activities.length > 0 && (
                <div style={{ padding: '8px 14px 3px', fontSize: 10, fontWeight: 700, color: '#A0A8B8', letterSpacing: '0.6px', borderTop: (results.customers.length + results.contacts.length) > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>AKTIVITÄTEN</div>
              )}
              {results.activities.map((a, i) => {
                const idx = results.customers.length + results.contacts.length + i
                return (
                  <button key={`a-${a.id}`} onClick={() => navigate(`/kunden/${a.customerId}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 14px', background: selected === idx ? 'rgba(245,158,11,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                    <Avatar initials={a.initials} color={a.color} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 12, color: '#0F0F1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{a.user} · {a.date}</div>
                    </div>
                    <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.1)', color: '#F59E0B', borderRadius: 5, padding: '1px 7px', fontWeight: 700, flexShrink: 0 }}>Aktivität</span>
                  </button>
                )
              })}
            </>
          )}

          {query.length >= 2 && !loading && allResults.length === 0 && (
            <div style={{ padding: '20px 14px', textAlign: 'center', color: '#A0A8B8', fontSize: 12 }}>
              Keine Ergebnisse für „{query}"
            </div>
          )}

          {query.length < 2 && (
            <div style={{ padding: '12px 14px', fontSize: 11, color: '#A0A8B8' }}>
              Mindestens 2 Zeichen eingeben · ↑↓ navigieren · Enter öffnen
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
