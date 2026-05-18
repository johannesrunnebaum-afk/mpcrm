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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
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
      } finally {
        setLoading(false)
      }
    }, 200)
  }, [query])

  function navigate(href: string) {
    router.push(href)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, allResults.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && allResults[selected]) navigate(allResults[selected].href)
  }

  const typeLabel: Record<string, string> = { customer: 'Kunde', contact: 'Kontakt', activity: 'Aktivität' }
  const typeColor: Record<string, string> = { customer: '#7C3AED', contact: '#2563EB', activity: '#EA580C' }

  if (!open) return (
    <button
      onClick={openSearch}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#F2F2F2', border: '1px solid #E8E8E8', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#6B6B6B', minWidth: 200 }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      Suchen...
      <span style={{ marginLeft: 'auto', fontSize: 11, background: '#E8E8E8', borderRadius: 4, padding: '1px 5px' }}>⌘K</span>
    </button>
  )

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 560, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid #E8E8E8' }}>
          <svg width="18" height="18" fill="none" stroke="#6B6B6B" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kunden, Kontakte, Aktivitäten suchen..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
          />
          {loading && <div style={{ width: 16, height: 16, border: '2px solid #E8E8E8', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
          <kbd style={{ fontSize: 11, background: '#F2F2F2', border: '1px solid #E8E8E8', borderRadius: 4, padding: '2px 6px', color: '#6B6B6B' }}>Esc</kbd>
        </div>

        {/* Results */}
        {allResults.length > 0 && (
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            {results.customers.length > 0 && (
              <div style={{ padding: '8px 18px 4px', fontSize: 11, fontWeight: 700, color: '#ABABAB', letterSpacing: '0.5px' }}>KUNDEN</div>
            )}
            {results.customers.map((c, i) => {
              const idx = i
              return (
                <button key={`c-${c.id}`} onClick={() => navigate(`/kunden/${c.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: selected === idx ? '#F5F0FF' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                  <Avatar initials={c.initials} color={c.color} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#6B6B6B' }}>{c.industry}</div>
                  </div>
                  <span style={{ fontSize: 10, background: '#F5F0FF', color: '#7C3AED', borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>Kunde</span>
                </button>
              )
            })}

            {results.contacts.length > 0 && (
              <div style={{ padding: '8px 18px 4px', fontSize: 11, fontWeight: 700, color: '#ABABAB', letterSpacing: '0.5px', borderTop: results.customers.length > 0 ? '1px solid #F2F2F2' : 'none' }}>KONTAKTE</div>
            )}
            {results.contacts.map((ct, i) => {
              const idx = results.customers.length + i
              return (
                <button key={`ct-${ct.id}`} onClick={() => navigate(`/kunden/${ct.customerId}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: selected === idx ? '#EFF6FF' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                  <Avatar initials={ct.initials} color={ct.color} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{ct.name}</div>
                    <div style={{ fontSize: 11, color: '#6B6B6B' }}>{ct.role} · {ct.email}</div>
                  </div>
                  <span style={{ fontSize: 10, background: '#EFF6FF', color: '#2563EB', borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>Kontakt</span>
                </button>
              )
            })}

            {results.activities.length > 0 && (
              <div style={{ padding: '8px 18px 4px', fontSize: 11, fontWeight: 700, color: '#ABABAB', letterSpacing: '0.5px', borderTop: (results.customers.length + results.contacts.length) > 0 ? '1px solid #F2F2F2' : 'none' }}>AKTIVITÄTEN</div>
            )}
            {results.activities.map((a, i) => {
              const idx = results.customers.length + results.contacts.length + i
              return (
                <button key={`a-${a.id}`} onClick={() => navigate(`/kunden/${a.customerId}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: selected === idx ? '#FFF7ED' : 'transparent', cursor: 'pointer', textAlign: 'left', border: 'none' }}>
                  <Avatar initials={a.initials} color={a.color} size={30} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: '#6B6B6B' }}>{a.user} · {a.date}</div>
                  </div>
                  <span style={{ fontSize: 10, background: '#FFF7ED', color: '#EA580C', borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>Aktivität</span>
                </button>
              )
            })}
          </div>
        )}

        {query.length >= 2 && !loading && allResults.length === 0 && (
          <div style={{ padding: '28px 18px', textAlign: 'center', color: '#ABABAB', fontSize: 13 }}>
            Keine Ergebnisse für „{query}"
          </div>
        )}

        {query.length === 0 && (
          <div style={{ padding: '20px 18px', fontSize: 12, color: '#ABABAB' }}>
            Suche nach Kunden, Kontakten oder Aktivitäten. Navigiere mit ↑↓, bestätige mit Enter.
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
