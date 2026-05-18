'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer, Contact, Activity } from '@/lib/types'
import Avatar from './Avatar'

interface Results {
  customers: Customer[]
  contacts: Contact[]
  activities: Activity[]
}

export default function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results>({ customers: [], contacts: [], activities: [] })
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allResults = [
    ...results.customers.map((c) => ({ type: 'customer' as const, id: c.id, label: c.name, sub: c.industry, initials: c.initials, color: c.color, href: `/kunden/${c.id}` })),
    ...results.contacts.map((c) => ({ type: 'contact' as const, id: c.id, label: c.name, sub: c.role, initials: c.initials, color: c.color, href: `/kunden/${c.customerId}` })),
    ...results.activities.map((a) => ({ type: 'activity' as const, id: a.id, label: a.text, sub: a.user, initials: a.initials, color: a.color, href: `/kunden/${a.customerId}` })),
  ]

  const openSearch = useCallback(() => {
    setOpen(true)
    setQuery('')
    setResults({ customers: [], contacts: [], activities: [] })
    setSelected(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch() }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openSearch])

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

  function navigate(href: string) { router.push(href); setOpen(false) }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, allResults.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && allResults[selected]) navigate(allResults[selected].href)
  }

  const typeColor: Record<string, string> = { customer: '#6366F1', contact: '#0EA5E9', activity: '#F59E0B' }
  const typeLabel: Record<string, string> = { customer: 'Kunde', contact: 'Kontakt', activity: 'Aktivität' }

  if (!open) return (
    <button
      onClick={openSearch}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, cursor: 'pointer', fontSize: 13, color: '#6B7280', minWidth: 220 }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      Suchen...
      <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(99,102,241,0.12)', color: '#6366F1', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>⌘K</span>
    </button>
  )

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,15,26,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFF 100%)', borderRadius: 20, width: '100%', maxWidth: 580, boxShadow: '0 24px 80px rgba(99,102,241,0.2), 0 1px 0 rgba(255,255,255,0.8) inset', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.9)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <svg width="18" height="18" fill="none" stroke="#A0A8B8" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kunden, Kontakte, Aktivitäten suchen..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', color: '#0F0F1A' }}
          />
          {loading && <div style={{ width: 16, height: 16, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
          <kbd style={{ fontSize: 11, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 6, padding: '2px 8px', color: '#6366F1', fontWeight: 600 }}>Esc</kbd>
        </div>

        {allResults.length > 0 && (
          <div style={{ maxHeight: 420, overflow: 'auto' }}>
            {results.customers.length > 0 && (
              <div style={{ padding: '10px 18px 4px', fontSize: 11, fontWeight: 700, color: '#A0A8B8', letterSpacing: '0.6px' }}>KUNDEN</div>
            )}
            {results.customers.map((c, i) => (
              <button key={`c-${c.id}`} onClick={() => navigate(`/kunden/${c.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: selected === i ? 'rgba(99,102,241,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                <Avatar initials={c.initials} color={c.color} size={30} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{c.industry}</div>
                </div>
                <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.1)', color: '#6366F1', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>Kunde</span>
              </button>
            ))}

            {results.contacts.length > 0 && (
              <div style={{ padding: '10px 18px 4px', fontSize: 11, fontWeight: 700, color: '#A0A8B8', letterSpacing: '0.6px', borderTop: results.customers.length > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>KONTAKTE</div>
            )}
            {results.contacts.map((ct, i) => {
              const idx = results.customers.length + i
              return (
                <button key={`ct-${ct.id}`} onClick={() => navigate(`/kunden/${ct.customerId}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: selected === idx ? 'rgba(14,165,233,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                  <Avatar initials={ct.initials} color={ct.color} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{ct.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{ct.role} · {ct.email}</div>
                  </div>
                  <span style={{ fontSize: 10, background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>Kontakt</span>
                </button>
              )
            })}

            {results.activities.length > 0 && (
              <div style={{ padding: '10px 18px 4px', fontSize: 11, fontWeight: 700, color: '#A0A8B8', letterSpacing: '0.6px', borderTop: (results.customers.length + results.contacts.length) > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>AKTIVITÄTEN</div>
            )}
            {results.activities.map((a, i) => {
              const idx = results.customers.length + results.contacts.length + i
              return (
                <button key={`a-${a.id}`} onClick={() => navigate(`/kunden/${a.customerId}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: selected === idx ? 'rgba(245,158,11,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                  <Avatar initials={a.initials} color={a.color} size={30} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#0F0F1A' }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{a.user} · {a.date}</div>
                  </div>
                  <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.1)', color: '#F59E0B', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>Aktivität</span>
                </button>
              )
            })}
          </div>
        )}

        {query.length >= 2 && !loading && allResults.length === 0 && (
          <div style={{ padding: '32px 18px', textAlign: 'center', color: '#A0A8B8', fontSize: 13 }}>
            Keine Ergebnisse für „{query}"
          </div>
        )}

        {query.length === 0 && (
          <div style={{ padding: '20px 18px', fontSize: 12, color: '#A0A8B8', lineHeight: 1.6 }}>
            Suche nach Kunden, Kontakten oder Aktivitäten. Navigiere mit ↑↓, bestätige mit Enter.
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
